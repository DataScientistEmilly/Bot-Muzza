// 📁 utils/intencoes.js
const sinonimos = {
  localizacao: ['localiza', 'endereço', 'onde fica', 'como chegar', 'local'],
  cardapio: ['cardápio', 'cardapio', 'menu', 'comida', 'pratos', 'bebidas'],
  funcionamento: ['como funciona', 'funcionamento', 'qual é o processo', 'dinâmica', 'Me fale sobre o muzza jazz', 'Como funciona','Como funciona ai','Me fale mais','Meconte sobre', 'Como eu reservo', 'Tem horario','Quero saber mais', 'Me conta sobre o Muzza Jazz', 'Qual o valor da reserva', 'Qual o valor', 'Quanto custa a reserva'],
  horarios: ['tem horário', 'horário de funcionamento', 'que horas funciona', 'hora de abrir', 'funciona até'],
  agenda: ['agenda de shows', 'me fale dos shows', 'tem evento', 'programação', 'atrações'],
  artistas: ['artistas', 'quem são os artistas', 'quais artistas vão tocar', 'quem vai tocar'],
  atendimento: ['falar com atendente', 'atendimento humano', 'pessoa', 'humano', 'quero falar com'],
  voltarBot: ['voltar bot', 'bot', 'voltar ao bot'],
  limpar: ['limpar conversa', 'nova conversa', 'resetar chat', 'recomeçar'],
  reserva: ['reserva', 'reservar', 'mesa', 'quero ir', 'lugar', 'ir na sexta', 'ir no sábado', 'sexta', 'sábado'],
  vinhos: ['quais vinhos', 'me fale da carta de vinhos', 'vinhos', 'serve vinhos'],
  pizzas: ['me fale sobre as pizzas', 'pizza', 'pizzas', 'a pizza serve quantas pessoas']
};

function temIntencao(texto, categoria) {
  const normalizado = texto.toLowerCase();
  return sinonimos[categoria]?.some(padrao => normalizado.includes(padrao));
}

module.exports = { temIntencao };
