const knex = require("../../conexao");
const bcrypt = require("bcrypt");
const { criarToken } = require("../middlewares/criarToken");
const { error } = require("../validacoes/schemaValidacao");

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
    const { categoria_id } = req.query;

    try {

        if (categoria_id) {
            const listarProdutos = await knex("produtos").where({ categoria_id });
            return res.status(200).json(listarProdutos)
        }

        else {
            const produtos = await knex("produtos");
            return res.status(200).json(produtos)
        }


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

const detalharProduto = async (req, res) => {
    const produtoId = req.params.id;

    try {
        const produto = await knex('produtos').where("id", produtoId);

        if (produto.length === 0) {
            return res.status(404).json({ mensagem: "Produto não encontrado." })
        }

        return res.status(200).json(produto);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." })
    };
};


const detalharCliente = async (req, res) => {
    const clienteId = req.params.id;

    try {
        const cliente = await knex('clientes').where("id", clienteId).select("id", "nome", "email", "cpf", "cep", "rua", "numero", "bairro", "cidade", "estado");

        if (cliente.length === 0) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado.' })
        }

        return res.status(200).json(cliente);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." })
    };
};

const editarDadosDoCliente = async (req, res) => {
    const clientePorId = req.params.id;
    const { nome, email, cpf } = req.body;

    try {

        if (!nome || !email || !cpf) {
            return res.status(400).json({ mensagem: "Campos Obrigatórios não preenchidos" })
        }

        const clienteCadastradoPorId = await knex('clientes').where("id", clientePorId).first();

        if (!clienteCadastradoPorId) {
            return res.status(400).json('Esse ID do cliente não está cadastrado.')
        }

        const emailCadastrado = await knex('clientes').where({ email }).first();

        if (emailCadastrado && emailCadastrado.email === clienteCadastradoPorId.email) {
            return res.status(400).json('Email informado já está cadastrado');
        }

        const cpfCadastrado = await knex('clientes').where({ cpf }).first();

        if (cpfCadastrado && cpfCadastrado.cpf === clienteCadastradoPorId.cpf) {
            return res.status(400).json('CPF informado já está cadastrado.');
        }

        const clienteAtualizado = await knex('clientes')
            .where({ id: clientePorId })
            .update({
                nome: nome,
                email: email,
                cpf: cpf
            }).returning(['id', 'nome', 'email', 'cpf']);

        if (!clienteAtualizado) {
            return res.status(500).json('Erro ao atualizar dados do cliente.');
        }

        return res.status(200).json(clienteAtualizado[0]);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." })

    }
}

const listarPedidos = async (req, res) => {
    const { cliente_id } = req.query;

    try {

        if (cliente_id) {
            const listarPedidos = await knex("pedidos").where({ cliente_id });
            const listarPedidosProduto = await knex("pedido_produtos").where({ cliente_id });
            const objListarPedido = { listarPedidos, listarPedidosProduto };
            return res.status(200).json(objListarPedido);
        }

        else {
            const pedidosProduto = await knex("pedido_produtos");
            const pedidos = await knex("pedidos");
            const objPedido = { pedidos, pedidosProduto };
            return res.status(200).json(objPedido);
        }


    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro Interno do Servidor' })
    }
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
    editarProduto,
    detalharCliente,
    detalharProduto,
    editarDadosDoCliente,
    listarPedidos
}