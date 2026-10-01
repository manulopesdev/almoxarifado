const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "publico")));
app.use(express.json());

const estoque = [
  { nome: "Mangueira 63mm", quantidade: 12, estoqueMinimo: 5 },
  { nome: "Luva de aproximação", quantidade: 3, estoqueMinimo: 8 },
  { nome: "Extintor PQS 6kg", quantidade: 2, estoqueMinimo: 10 },
];

function abaixoDoMinimo(estoque) {
  return estoque.filter((i) => i.estoqueMinimo > i.quantidade);
}

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

function darEntrada(nome, qtd) {
  if (!Number.isInteger(qtd) || qtd <= 0)
    return { ok: false, motivo: "Quantidade inválida" };
  const item = estoque.find((i) => i.nome === nome);
  if (!item) return { ok: false, motivo: "item não encontrado" };
  item.quantidade += qtd;
  return { ok: true };
}

app.get("/estoque", (req, res) => {
  res.json(estoque);
});

app.get("/estoque/abaixo-do-minimo", (req, res) => {
  res.json(abaixoDoMinimo(estoque));
});

app.post("/entrada", (req, res)=>{
    const {nome, quantidade} = req.body;
    const resultado = darEntrada(nome, quantidade);

    if(!resultado.ok){
        return res.status(400).json(resultado);
    }

    res.json(resultado);
});

app.post("/baixa", (req, res)=>{
    const {nome, quantidade} = req.body;
    const resultado = darBaixa(nome, quantidade);

    if(!resultado.ok){
        return res.status(400).json(resultado);
    }

    res.json(resultado);
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
