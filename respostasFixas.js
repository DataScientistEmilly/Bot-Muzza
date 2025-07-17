// 📁 messages/respostasFixas.js
module.exports = {
  limpar: `🔄 Conversa reiniciada! Como posso te ajudar?`,

  localizacao: `📍 *O Muzza te espera em meio à natureza!*

🌿 **Localização:** Ecocentro IPEC
📱 **Google Maps:** https://www.google.com/maps/place/Muzza+Jazz+Clube/@-15.8787209,-48.9375302,21z/data=!3m1!4b1!4m6!3m5!1s0x935c6d0064edd951:0x876f0bc434e78de9!8m2!3d-15.881067!4d-48.9420765`,

  cardapio: `🍽️ *O Muzza presenteia você com sabores que fazem a alma dançar!*

Pizzas de massa fina e crocante, ingredientes regionais selecionados, vinhos que harmonizam com a liberdade do jazz... Cada sabor conecta você ao que é belo, livre, vibrante.

📋 Cardápio completo: https://abqr.io/cardapio/t/jOyEQ83BSCqpU9OyMi80QwbREQzAG6gk

✨ *Invoque o Muzza e deixe os sabores acenderem sua inspiração!*`,

  funcionamento: `🎷 *Como funciona o Muzza Jazz Club:*

🌿 **Jazz e Natureza em Harmonia**
Ambiente ao ar livre, pizzas artesanais, jazz ao vivo e reservas via WhatsApp.

💰 R$ 50 por pessoa (reserva antecipada com pagamento via Pix ou cartão).

✨ *Invoque o Muzza e deixe a vida entrar no ritmo!*`,

  horarios: `⏰ *Horários de Funcionamento:*
• Sexta-feira: 19h às 23h
• Sábado: 19h às 23h

Para reservar, informe:
• Dia (sexta ou sábado)
• Horário
• Número de pessoas`,

  semShows: `🎷 Ainda não temos shows cadastrados. Fique ligado!`,

  semArtistas: `🎷 Ainda não temos artistas cadastrados.`,

  erroBusca: `❌ Ocorreu um erro ao buscar as informações. Tente novamente em instantes.`,

  paraHumano: `👤 *Você foi direcionado para atendimento humano!*
Em breve um de nossos atendentes entrará em contato.

🤖 Digite *VOLTAR BOT* para retornar ao atendimento automatizado.`,

  voltarBot: `🤖 *Bem-vindo de volta ao atendimento automatizado!*

✨ *A inspiração acende. Faz a alma dançar.*

Como posso ajudá-lo?`,

  erroIA: `❌ Ocorreu um erro ao tentar responder com inteligência artificial.

👤 Digite *FALAR COM ATENDENTE* se precisar de ajuda personalizada.`,

  systemPrompt: `Você é o assistente virtual do Muzza Jazz Club. O Muzza é uma força inspiradora ancestral que aproxima, envolve e acende um clima único. Jazz é liberdade - vibra em alma, improviso e beleza.

INFORMAÇÕES DO MUZZA:
🌿 LOCALIZAÇÃO: Ecocentro IPEC
🔗 Google Maps: https://www.google.com/maps/place/Muzza+Jazz+Clube/@-15.8787209,-48.9375302,21z/

⏰ FUNCIONAMENTO: Sexta e Sábado: 19h às 23h
🍕 PIZZAS artesanais com ingredientes regionais
💳 RESERVAS por WhatsApp, com pagamento via Pix ou Cartão

Use linguagem poética, acolhedora e envolvente. Responda todas as perguntas com base nessas informações.`,

  introducao: `Olá! Bem-vindo ao *Muzza Jazz Club*! 🎷

*Invocamos a Muzza. E a vida entra no ritmo.

Para quem ama Jazz. Para quem vai amar.*

 O Muzza te presenteia com o melhor do Jazz, em meio à floresta, pronto para inspirar sua vida.

⏰ *Funcionamento:* Sexta e Sábado: 19h às 23h
🎵 *Jazz é liberdade - vibra em alma, improviso e beleza*

Como posso ajudá-lo nesta jornada sensorial?`,

  menuInterativo: ({ dia, horario, quantidade, valor }) => `🎷 *Dados da sua reserva no Muzza:*

📅 **Dia:** ${dia}
⏰ **Horário:** ${horario}
👥 **Pessoas:** ${quantidade}
💰 **Valor total:** R$ ${valor}

✨ *Antes de finalizar, que tal conhecer mais sobre o Muzza?*

*Digite o número da opção:*

1️⃣ Ver cardápio
2️⃣ Ver localização
3️⃣ Ver agenda de shows
4️⃣ Artistas que já se apresentaram
5️⃣ **Finalizar reserva**`,

  confirmacaoReserva: `🎷 *Perfeito! Agora preciso de seus dados para finalizar a reserva:*

📝 **Qual é o seu nome completo?**`,

  dadosIncompletos: (faltaDia, faltaHorario, faltaQtd) => {
    let msg = `🎷 *Para fazer sua reserva no Muzza, preciso de algumas informações:*

`;
    if (faltaDia) msg += `📅 **Dia:** Sexta ou Sábado?
`;
    if (faltaHorario) msg += `⏰ **Horário:** Entre 19:00 e 23:00
`;
    if (faltaQtd) msg += `👥 **Pessoas:** Quantas pessoas?
`;
    msg += `
✨ *Você pode enviar tudo junto ou separado!*
*Exemplo:* "Sexta às 20h para 4 pessoas"`;
    return msg;
  }
};
