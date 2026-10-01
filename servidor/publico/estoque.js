// ===== DADOS =====

let estoque = [];

// ===== FUNÇÕES =====

async function carregarEstoque() {
  const resposta = await fetch("/estoque");
  estoque = await resposta.json();
  renderizarTabela();
}

function renderizarTabela() {
  const corpo = document.getElementById("corpo-tabela");
  corpo.textContent = ""; // limpa o que havia antes

  estoque.forEach((item) => {
    const tr = document.createElement("tr");

    const tdNome = document.createElement("td");
    tdNome.textContent = item.nome;

    const tdQtd = document.createElement("td");
    tdQtd.textContent = item.quantidade;

    const tdMin = document.createElement("td");
    tdMin.textContent = item.estoqueMinimo;

    tr.append(tdNome, tdQtd, tdMin);

    if (item.quantidade < item.estoqueMinimo) {
      tr.classList.add("alerta");
    }

    corpo.append(tr);
  });
}

carregarEstoque();

const form = document.getElementById("form-movimento");

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const nome = document.getElementById("campo-nome").value;
  const qtd = Number(document.getElementById("campo-qtd").value);
  const mensagem = document.getElementById("mensagem");
  // mensagem.textContent = "";

  let rota, tipo, sinal;

  if (evento.submitter.id === "btn-entrada") {
    rota = "/entrada";
    tipo = "entrada";
    sinal = "+";
  } else if (evento.submitter.id === "btn-baixa") {
    rota = "/baixa";
    tipo = "baixa";
    sinal = "-";
  } else {
    console.error("botão desconhecido");
    return;
  }

  const resposta = await fetch(rota, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: nome, quantidade: qtd }),
  });

  const resultado = await resposta.json();

  if (resultado.ok) {
    mensagem.classList.remove("erro");
    mensagem.classList.add("sucesso");
    mensagem.textContent = `Operação de ${tipo} realizada com sucesso! ${nome}, ${sinal}${qtd}`;
    form.reset();
  } else {
    mensagem.classList.remove("sucesso");
    mensagem.classList.add("erro");
    mensagem.textContent = resultado.motivo;
  }

  await carregarEstoque();
});
