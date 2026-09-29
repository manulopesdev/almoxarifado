// ===== DADOS =====
const estoqueInicial = [
  { nome: "Mangueira 63mm", quantidade: 12, estoqueMinimo: 5 },
  { nome: "Luva de aproximação", quantidade: 3, estoqueMinimo: 8 },
  { nome: "Extintor PQS 6kg", quantidade: 20, estoqueMinimo: 10 },
];

const salvo = localStorage.getItem("estoque");
const estoque = salvo ? JSON.parse(salvo) : estoqueInicial;

// ===== FUNÇÕES =====

function salvar() {
  localStorage.setItem("estoque", JSON.stringify(estoque));
}

// Sua versão original de darBaixa (recebe o nome)
function darBaixa(nome, qtd) {
  if (!Number.isInteger(qtd) || qtd <= 0)
    return { ok: false, motivo: "Quantidade inválida" };
  const item = estoque.find((i) => nome === i.nome);
  if (!item) return { ok: false, motivo: "Item não encontrado" };
  if (item.quantidade < qtd)
    return {
      ok: false,
      motivo: "o estoque atual está abaixo da quantidade necessária",
    };

  item.quantidade = item.quantidade - qtd;
  return { ok: true };
}

// Sua darEntrada (recebe o nome)
function darEntrada(nome, qtd) {
  if (!Number.isInteger(qtd) || qtd <= 0)
    return { ok: false, motivo: "Quantidade inválida" };
  const item = estoque.find((i) => i.nome === nome);
  if (!item) return { ok: false, motivo: "item não encontrado" };
  item.quantidade += qtd;
  return { ok: true };
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

renderizarTabela();

const form = document.getElementById("form-movimento");

form.addEventListener("submit", (evento) => {
  evento.preventDefault(); // impede o navegador de recarregar a página
  console.log("Formulário enviado!");
  const nome = document.getElementById("campo-nome").value;
  const qtd = Number(document.getElementById("campo-qtd").value);
  console.log(nome, qtd);
  console.log(evento.submitter.id);

  const mensagem = document.getElementById("mensagem");
  let resultado;
  let tipo, sinal;

  if (evento.submitter.id === "btn-entrada") {
    resultado = darEntrada(nome, qtd);
    tipo = "entrada";
    sinal = "+";
  } else if (evento.submitter.id === "btn-baixa") {
    resultado = darBaixa(nome, qtd);
    tipo = "baixa";
    sinal = "-";
  } else {
    console.log("botão desconhecido");
    return;
  }

  if (resultado.ok) {
    salvar();
    mensagem.classList.remove("erro");
    mensagem.classList.add("sucesso");
    mensagem.textContent = `Operação de ${tipo} realizada com sucesso! ${nome}, ${sinal}${qtd}`;
    form.reset();
  } else {
    mensagem.classList.remove("sucesso");
    mensagem.classList.add("erro");
    mensagem.textContent = resultado.motivo;
  }

  renderizarTabela();
});
