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
// Aqui
const excluirProduto = async (req, res) => {
    try {
        const id = req.params.id;

        // Validar produto existe
        const produtoExiste = await knex('produtos').where({ id }).first()
        if (!produtoExiste) {
            return res.status(404).json({ mensagem: 'Produto não encontrado.' })
        }

        // Excluir produto
        await knex('produtos').where({ id }).delete();

        // Retornar mensagem de sucesso
        res.status(200).json({ mensagem: 'Produto excluído com sucesso.' });
    } catch (error) {
        console.log(error)
        return res.status(202).json({ mensagem: 'Erro no Servidor.' })
    }
}


const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;

    try {

        if (!nome || !email || !cpf) {
            return res.status(400).json({ mensagem: "Os campos nome, email e cpf são obrigatórios" })
        }


        const verificarCPF = await knex("clientes").where({ cpf }).first();
        const verificarEmail = await knex("clientes").where({ email }).first();


        if (verificarCPF || verificarEmail) {
            return res.status(400).json({ mensagem: "Esse email/cpf já existe." });
        };

        const cadastroCliente = await knex("clientes")
            .insert({
                nome,
                email,
                cpf,
                cep,
                rua,
                numero,
                bairro,
                cidade,
                estado
            }).returning("*");

        if (!cadastroCliente[0]) {
            return res.status(400).json({ mensagem: "Cliente não cadastrado." })
        }

        return res.status(200).json(cadastroCliente[0])

    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const listarProdutos = async (req, res) => {

    try {
        const listarProdutos = await knex('produtos');

        return res.status(200).json(listarProdutos)

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro Interno do Servidor' })
    }
};

const listarClientes = async (req, res) => {

    try {
        const listarClientes = await knex('clientes')

        return res.status(200).json(listarClientes)

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro Interno do Servidor' })
    }
};

const editarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    const produtoId = req.params.id;

    try {

        const produtoExiste = await knex("produtos").where("id", produtoId).first();

        if (!produtoExiste) {
            return res.status(404).json({ mensagem: "Esse produto não existe" });
        }
        const atualizarProduto = await knex("produtos").where("id", produtoId)
            .update({
                descricao,
                quantidade_estoque,
                valor,
                categoria_id,
            }).returning("*");


        return res.status(200).json(atualizarProduto);

    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    cadastrarUsuario,
    logarUsuario,
    listarCategorias,
    detalharPerfil,
    editarPerfil,
    cadastrarProduto,
    excluirProduto,
    cadastrarCliente,
    listarProdutos,
    listarClientes,
    editarProduto

}