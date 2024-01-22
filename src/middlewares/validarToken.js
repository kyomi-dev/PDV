const knex = require("../../conexao");
const senhaJwt = require("../../senha");
const jwt = require("jsonwebtoken");


const validarToken = async (req, res, next) => {

    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: "Para acessar este recurso, um token de autenticação válido deve ser enviado" });
    }

    try {
        const token = authorization.split(" ")[1];
        const tokenVerificado = jwt.verify(token, senhaJwt);
        const { id } = tokenVerificado;

        const usuario = await knex("usuarios").where({ id });

        if (!usuario) {
            return res.status(404).json({ mensagem: "Usuário não encontrado." });
        }

        req.usuario = usuario
        next();
    } catch (error) {
        return res.status(401).json({ mensagem: "Token inválido." });
    }
};

module.exports = validarToken;
