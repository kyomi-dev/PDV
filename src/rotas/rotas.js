const express = require("express");
const { cadastrarUsuario, logarUsuario, listarCategorias, detalharPerfil, editarPerfil, cadastrarProduto, cadastrarCliente, listarProdutos, listarClientes, editarProduto, excluirProduto } = require("../controladores/controladores");


// ---------- Middlewares ----------
const { validarRequsicao } = require("../middlewares/validarRequisicao");
const schemaValidacao = require("../validacoes/schemaValidacao");
const validarToken = require("../middlewares/validarToken");
const { validarLogin } = require("../middlewares/validarLogin");
const schemaValidacaoProduto = require("../validacoes/schemaValiacaoProduto");

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
rotas.post("/produto", validarToken, cadastrarProduto);

// cadastrar cliente
rotas.post("/cliente", validarToken, cadastrarCliente);

// listar os produtos do banco de dados
rotas.get("/produto", validarToken, listarProdutos);

// Excluir produto do banco de dados
rotas.delete("/produto/:id", validarToken, excluirProduto)

//listar os clientes do banco de dados
rotas.get("/cliente", validarToken, listarClientes);

rotas.put("/produto/:id", validarToken, validarRequsicao(schemaValidacaoProduto), editarProduto);





module.exports = rotas; 