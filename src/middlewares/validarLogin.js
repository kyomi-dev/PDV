const bcrypt = require("bcrypt");
const knex = require("../../conexao");


const validarLogin = async (req, res, next) => {
    const { email, senha } = req.body;

    try {
        if (!email || !senha) {
            return res.status(400).json({ mensagem: "Preencha todos os campos." });
        }

        const usuarioEncontrado = await knex("usuarios").where({ email }).first();

        if (!usuarioEncontrado) {
            return res.status(400).json({ mensagem: "Nome e/ou senha invalido(s)." });
        }

        const senhaValida = await bcrypt.compare(senha, usuarioEncontrado.senha);
        if (!senhaValida) {
            return res.status(400).json({ mensagem: "Insira a senha correta." });
        }

        req.usuario = usuarioEncontrado;
        next();
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};


module.exports = { validarLogin };