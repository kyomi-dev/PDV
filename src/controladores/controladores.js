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
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
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

const detalharPerfil = async (req, res) => {
    const [{ id }] = req.usuario;

    try {
        const usuario = await knex('usuarios').where({ id }).select("id", "nome", "email");

        if (!usuario) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' })
        }

        return res.json(usuario);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." })
    };
}

const editarPerfil = async (req, res) => {

    const { nome, email, senha } = req.body;
    const [{ id }] = req.usuario;

    try {

        if (!nome || !email || !senha) {
            return res.status(400).json({ mensagem: "Campos Obrigatórios não preenchidos" })
        }

        const verificarEmail = await knex("usuarios").where({ email }).first();

        if (verificarEmail) {
            return res.status(400).json({ mensagem: "Esse email já existe." });
        };

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const editarPerfil = await knex("usuarios").where({ id })
            .update({
                nome,
                email,
                senha: senhaCriptografada
            }).returning("*");

        if (!editarPerfil) {
            return res.status(400).json({ mensagem: "Não foi possível editar o usuário." });
        }

        return res.status(200).json({ mensagem: "Usuário atualizado com sucesso." });

    } catch (error) {
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const cadastrarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    if (!descricao || !quantidade_estoque || !valor || !categoria_id) {
        return res.json({ mensagem: "Todos os campos são obrigatórios." }).status(400);
    }

    try {
        const categoria = await knex("categorias").where("id", categoria_id).first();

        if (categoria) {
            if (valor * 100 > 2147483647) {
                return res.json({ mensagem: "O valor deve ser menor ou igual a 21474836.47 no campo 'valor'" }).stauts(400);
            }

            const produto = await knex("produtos").insert({
                descricao,
                quantidade_estoque,
                valor: valor * 100,
                categoria_id
            }).returning("*");

            if (produto) {
                return res.json({ mensagem: "O produto foi criado." }).status(201);
            }
        }

        else {
            return res.json({ mensagem: "A categoria não existe" }).status(404);
        }

    } catch (error) {
        return res.json({ mensagem: "Erro interno do servidor." }).status(500);
    }
}


module.exports = {
    cadastrarUsuario,
    logarUsuario,
    listarCategorias,
    detalharPerfil,
    editarPerfil,
    cadastrarProduto
}