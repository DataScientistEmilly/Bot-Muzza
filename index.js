// 📁 index.js (com webhook opcional e opções de pagamento)
require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { OpenAI } = require('openai');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { buscarShows, buscarArtistas, buscarPromocoes, ReservasFirestore } = require('./firestore-operations');
const { parseDados } = require('./utils/parseDados');
const { temIntencao } = require('./utils/intencoes');
const respostasFixas = require('./messages/respostasFixas');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

const dadosPendentes = new Map();
const historicoConversas = new Map();
const atendimentoHumano = new Set();
const botStartTime = Date.now();

client.on('qr', qr => qrcode.generate(qr, { small: true }));
client.on('ready', () => console.log('🤖 Bot online'));

client.on('message', async message => {
  const texto = message.body.toLowerCase().trim();
  const numero = message.from;
  if (message.timestamp * 1000 < botStartTime) return;
  const chat = await message.getChat();
  if (chat.isGroup) return;

  const pendentes = dadosPendentes.get(numero) || {};

  if (temIntencao(texto, 'limpar')) {
    historicoConversas.delete(numero);
    dadosPendentes.delete(numero);
    return message.reply(respostasFixas.limpar);
  }

  if (temIntencao(texto, 'localizacao')) return message.reply(respostasFixas.localizacao);
  if (temIntencao(texto, 'cardapio')) return message.reply(respostasFixas.cardapio);
  if (temIntencao(texto, 'horarios')) return message.reply(respostasFixas.horarios);

  if (temIntencao(texto, 'agenda')) {
    try {
      const shows = await buscarShows();
      if (!shows.length) return message.reply(respostasFixas.semShows);
      const resposta = shows.map(s => `📅 ${s.data} - ${s.horario}\n🎤 ${s.artista}`).join('\n\n');
      return message.reply(resposta);
    } catch {
      return message.reply(respostasFixas.erroBusca);
    }
  }

  if (temIntencao(texto, 'artistas')) {
    try {
      const artistas = await buscarArtistas();
      if (!artistas.length) return message.reply(respostasFixas.semArtistas);
      const resposta = artistas.map(a => `🎤 ${a.nome} - ${a.estilo}`).join('\n');
      return message.reply(resposta);
    } catch {
      return message.reply(respostasFixas.erroBusca);
    }
  }

  if (temIntencao(texto, 'atendimento')) {
    atendimentoHumano.add(numero);
    return message.reply(respostasFixas.paraHumano);
  }

  if (temIntencao(texto, 'voltarBot')) {
    atendimentoHumano.delete(numero);
    return message.reply(respostasFixas.voltarBot);
  }

  if (atendimentoHumano.has(numero)) return;

  // ✅ Intercepta perguntas sobre funcionamento (valor incluso) antes de avançar para reserva
  if (temIntencao(texto, 'funcionamento')) {
    return message.reply(respostasFixas.funcionamento);
  }

  if (!historicoConversas.has(numero)) {
    historicoConversas.set(numero, [
      { role: 'system', content: respostasFixas.systemPrompt }
    ]);
  }

  const dados = parseDados(texto);
  if (dados.dia) pendentes.dia = dados.dia;
  if (dados.horario) pendentes.horario = dados.horario;
  if (dados.quantidade) pendentes.quantidade = dados.quantidade;
  dadosPendentes.set(numero, pendentes);

  if (pendentes.dia && pendentes.horario && pendentes.quantidade && !pendentes.menuMostrado) {
    pendentes.menuMostrado = true;
    return message.reply(respostasFixas.menuInterativo({
      dia: pendentes.dia,
      horario: pendentes.horario,
      quantidade: pendentes.quantidade,
      valor: (pendentes.quantidade * 50).toFixed(2)
    }));
  }

  if (texto === '5' && pendentes.dia && pendentes.horario && pendentes.quantidade) {
    message.reply('🔐 Criando cobrança segura...');
    try {
      const cliente = await fetch("https://www.asaas.com/api/v3/customers", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          access_token: process.env.ASAAS_TOKEN
        },
        body: JSON.stringify({
          name: numero,
          email: `${numero}@muzza.bot`,
          mobilePhone: numero.replace(/[^0-9]/g, '')
        })
      }).then(res => res.json());

      const cobranca = await fetch("https://www.asaas.com/api/v3/payments", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          access_token: process.env.ASAAS_TOKEN
        },
        body: JSON.stringify({
          customer: cliente.id,
          billingType: "PIX",
          value: pendentes.quantidade * 50,
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })
      }).then(res => res.json());

      await ReservasFirestore.salvar(numero, {
        ...pendentes,
        pago: false,
        clienteId: cliente.id,
        cobrancaId: cobranca.id,
        link: cobranca.invoiceUrl
      });

      return message.reply(`🎉 *Sua reserva foi iniciada!*\n\nVocê pode pagar via *Pix* ou *Cartão de Crédito*.\n\n💳 Link de pagamento seguro:\n🔗 ${cobranca.invoiceUrl}\n\nAssim que o pagamento for confirmado, enviaremos uma mensagem de confirmação. ✨`);

    } catch (err) {
      console.error('Erro ao gerar cobrança:', err);
      return message.reply('❌ Erro ao gerar cobrança. Tente novamente mais tarde.');
    }
  }

  if (!pendentes.dia || !pendentes.horario || !pendentes.quantidade) {
    return message.reply(
      respostasFixas.dadosIncompletos(!pendentes.dia, !pendentes.horario, !pendentes.quantidade)
    );
  }

  const historico = historicoConversas.get(numero);
  historico.push({ role: 'user', content: texto });
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: historico
    });
    const resposta = completion.choices[0].message.content;
    historico.push({ role: 'assistant', content: resposta });
    historicoConversas.set(numero, historico);
    return message.reply(resposta);
  } catch (err) {
    console.error('Erro IA:', err);
    return message.reply(respostasFixas.erroIA);
  }
});

client.initialize();
