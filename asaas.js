require('dotenv').config();

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


async function criarCobranca(valor, vencimento, nome, email) {
  try {
    
    const response = await fetch(`${process.env.ASAAS_API_URL}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "application/json",
        "access_token": process.env.ASAAS_API_KEY,
      },
      body: JSON.stringify({
        billingType: "PIX",
        customer: process.env.ASAAS_CUSTOMER_ID,
        value: valor,
        dueDate: vencimento,
        description: `Reserva Muzza Jazz Club - ${nome}`,
        externalReference: email,
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      try {
        const erro = JSON.parse(responseText); // tenta converter para JSON
        throw new Error(`Erro ao criar cobrança: ${JSON.stringify(erro)}`);
      } catch {
        throw new Error(`Erro ao criar cobrança (sem JSON): ${responseText}`);
      }
    }

    try {
      return JSON.parse(responseText);
    } catch {
      throw new Error(`Resposta inválida do Asaas: ${responseText}`);
    }

  } catch (error) {
    console.error('❌ Erro ao criar cobrança:', error.message);
    throw error; 
  }
}

module.exports = {
  criarCobranca
};
