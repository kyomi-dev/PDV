const express = require("express");
const { cadastrarUsuario, logarUsuario, listarCategorias, detalharPerfil, editarPerfil, cadastrarProduto } = require("../controladores/controladores");


// ---------- Middlewares ----------
const { validarUsuario } = require("../middlewares/validarUsuario");
const schemaValidacao = require("../validacoes/schemaValidacao");
const validarToken = require("../middlewares/validarToken");
const { validarLogin } = require("../middlewares/validarLogin");

const rotas = express();


// listar as categorias do banco de dados
rotas.get("/categoria", listarCategorias);

// fazer o cadastro do usuario
rotas.post("/usuario", validarUsuario(schemaValidacao), cadastrarUsuario);

// fazer o login do usuario
rotas.post("/login", validarLogin, logarUsuario);

// detalhar perfil do usuario
rotas.get("/usuario", validarToken, detalharPerfil);

// editar perfil do usuario
rotas.put("/usuario", validarToken, editarPerfil);

// cadastrar produto
rotas.post("/produto", validarToken, cadastrarProduto);

module.exports = rotas; 