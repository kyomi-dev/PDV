const express = require("express");
const { cadastrarUsuario, logarUsuario, listarCategorias, detalharPerfil, editarPerfil, cadastrarProduto, cadastrarCliente,
    listarProdutos, listarClientes, editarProduto, excluirProduto, detalharProduto, detalharCliente, editarDadosDoCliente, cadastrarPedido, listarPedidos, excluirImagemProduto } = require("../controladores/controladores");


// ---------- Middlewares ----------
const { validarRequsicao } = require("../middlewares/validarRequisicao");
const schemaValidacao = require("../validacoes/schemaValidacao");
const validarToken = require("../middlewares/validarToken");
const { validarLogin } = require("../middlewares/validarLogin");
const multer = require("../middlewares/multer");

const rotas = express();


// listar as categorias do banco de dados
rotas.get("/categoria", listarCategorias);

// fazer o cadastro do usuario
rotas.post("/usuario", validarRequsicao(schemaValidacao), cadastrarUsuario);

// fazer o login do usuario
rotas.post("/login", validarLogin, logarUsuario);

// detalhar perfil do usuario
rotas.get("/usuario", validarToken, detalharPerfil);

// editar perfil do usuario
rotas.put("/usuario", validarToken, editarPerfil);

// cadastrar produto
rotas.post("/produto", validarToken, multer.single('produto_imagem'), cadastrarProduto);

// cadastrar cliente
rotas.post("/cliente", validarToken, cadastrarCliente);

// listar os produtos do banco de dados
rotas.get("/produto", validarToken, listarProdutos);

// Excluir produto do banco de dados
rotas.delete("/produto/:id", validarToken, excluirProduto)

// Excluir imagem do produto
rotas.delete("/produto/:id/imagem", validarToken, excluirImagemProduto);

//listar os clientes do banco de dados
rotas.get("/cliente", validarToken, listarClientes);

rotas.put("/produto/:id", validarToken, multer.single('produto_imagem'), editarProduto);

// Detalhar Produto
rotas.get("/produto/:id", validarToken, detalharProduto);

// Detalhar Cliente
rotas.get("/cliente/:id", validarToken, detalharCliente);

// Editar Dados do Cliente
rotas.put("/cliente/:id", validarToken, editarDadosDoCliente);

// cadastrar pedido
rotas.post("/pedido", validarToken, cadastrarPedido);

// Listagem dos pedidos do banco de dados
rotas.get("/pedido", validarToken, listarPedidos);

module.exports = rotas; 