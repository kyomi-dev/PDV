const knex = require("../../conexao");
const bcrypt = require("bcrypt");
const { criarToken } = require("../middlewares/criarToken");

// PARA TODOS: se conectem ao banco de dados colando cada valor 
// das variaveis no .env no beekeeper ou na extensão que vcs tao usando


// só completem o controlador de vocês
// implemente o middleware de validarUsuario.js e o schemaValidacao
const cadastrarUsuario = async (req, res) => { }


// o responsável pelo login deverá escrever o código dos middlewares
// de criarToken, validarToken, validarLogin
const logarUsuario = async (req, res) => { }


const listarCategorias = async (req, res) => { }


const detalharPerfil = async (req, res) => { }


const editarPerfil = async (req, res) => { }


module.exports = { cadastrarUsuario, logarUsuario, listarCategorias, detalharPerfil, editarPerfil }