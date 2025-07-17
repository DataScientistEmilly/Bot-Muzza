// 📁 utils/parseDados.js

function extrairDia(texto) {
  const normalizado = texto.toLowerCase();
  if (normalizado.includes('sexta')) return 'sexta';
  if (normalizado.includes('sábado') || normalizado.includes('sabado')) return 'sábado';
  return null;
}

function extrairHorario(texto) {
  const horaMatch = texto.match(/(\d{1,2})[:h\\s]?(\\d{0,2})/);
  if (horaMatch) {
    let [_, h, m] = horaMatch;
    if (!m) m = '00';
    return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
  }
  return null;
}

function extrairQuantidade(texto) {
  const match = texto.match(/(\\d{1,2})\\s*pessoas?/i);
  if (match) return parseInt(match[1]);
  return null;
}

function parseDados(texto) {
  return {
    dia: extrairDia(texto),
    horario: extrairHorario(texto),
    quantidade: extrairQuantidade(texto),
  };
}

module.exports = { parseDados };
