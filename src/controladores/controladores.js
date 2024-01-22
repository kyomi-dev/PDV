const knex = require("../../conexao");
const bcrypt = require("bcrypt");
const { criarToken } = require("../middlewares/criarToken");

// PARA TODOS: se conectem ao banco de dados colando cada valor 
// das variaveis no .env no beekeeper ou na extensão que vcs tao usando


// só completem o controlador de vocês
// implemente o middleware de validarUsuario.js e o schemaValidacao
const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {

        const verificarEmail = await knex("usuarios").where({ email }).first();

        if (verificarEmail) {
            return res.status(400).json({ mensagem: "Esse email já existe." });
        };

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const cadastroUsuario = await knex("usuarios")
            .insert({
                nome,
                email,
                senha: senhaCriptografada
            }).returning("*");

        if (!cadastroUsuario[0]) {
            return res.status(400).json({ mensagem: "Usuário não cadastrado." })
        }

        return res.status(200).json(cadastroUsuario[0])

    } catch (error) {
        return res.status(500).json(error.message);
    }
};


// o responsável pelo login deverá escrever o código dos middlewares
// de criarToken, validarToken, validarLogin
const logarUsuario = async (req, res) => {
    try {
        const usuario = req.usuario;
        const tokenLogin = await criarToken(usuario.id)
        const { senha: _, ...usuarioLogado } = usuario;

        return res.status(200).json({ mensagem: usuarioLogado, token: tokenLogin });

    } catch (error) {
        return res.status(400).json({ mensagem:error.message});
    }
};


const listarCategorias = async (req, res) => {

    try {
        const listarCategorias = await knex('categorias')

        return res.status(200).json(listarCategorias)

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro Interno do Servidor' })
    }
};


const detalharPerfil = async (req, res) => { }


const editarPerfil = async (req, res) => { }


module.exports = { cadastrarUsuario, logarUsuario, listarCategorias, detalharPerfil, editarPerfil }