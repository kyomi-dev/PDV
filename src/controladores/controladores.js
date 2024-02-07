const knex = require("../../conexao");
const bcrypt = require("bcrypt");
const { criarToken } = require("../middlewares/criarToken");
const { error, id } = require("../validacoes/schemaValidacao");
const { uploadImagem } = require("../middlewares/uploud");
const sendMail = require('../email');

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
    try {
        const { descricao, quantidade_estoque, valor, categoria_id } = req.body;


        // Validar campos obrigatórios
        if (!descricao || !quantidade_estoque || !valor || !categoria_id) {
            return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios.' });
        }

        // Validar categoria
        const categoriaExiste = await knex('categorias').where({ id: categoria_id }).first();
        if (!categoriaExiste) {
            return res.status(400).json({ mensagem: 'Categoria não encontrada.' });
        }

        let produtoNovo = await knex('produtos').insert({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id
        }).returning(`*`)


        const idProdutoNovo = produtoNovo[0].id
        // Imagem



        // se a imagem for passada adiciona no banco de dados 
        if (req.file) {
            const { originalname, mimetype, buffer } = req.file
            const produto_imagem = await uploadImagem(
                `produtos/${idProdutoNovo}/${originalname}`,
                buffer,
                mimetype
            )
            await knex('produtos').update({
                produto_imagem: produto_imagem.url
            }).where({ id: idProdutoNovo })


            const produtoNovoComImagem = await knex('produtos').where({ id: idProdutoNovo })
            // Retornar produto criado

            return res.status(201).json(produtoNovoComImagem);
        }

        else {
            const produtoNovo = await knex('produtos').where({ id: idProdutoNovo }).select('id', 'descricao', 'quantidade_estoque', 'valor', 'categoria_id')

            return res.status(201).json(produtoNovo);
        }


    } catch (error) {
        console.log(error);
        return res.status(400).json({ mensagem: 'Erro no Servidor.' });
    }
};

const excluirProduto = async (req, res) => {
    try {
        const id = req.params.id;

        // Validar produto existe
        const produtoExiste = await knex('produtos').where({ id }).first()
        if (!produtoExiste) {
            return res.status(404).json({ mensagem: 'Produto não encontrado.' })
        }

        const produtoPedido = await knex('pedido_produtos').where("produto_id", id).first();
        if (produtoPedido) {
            return res.status(400).json({ mensagem: "Não é possível excluir um produto vinculado a um pedido" })
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
    try {
        const id = req.params.id;
        const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

        // Validar campos obrigatórios
        if (!descricao || !quantidade_estoque || !valor || !categoria_id) {
            return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios.' });
        }

        // O Produto
        const produtoExiste = await knex('produtos').where({ id }).first();

        // Validar categoria existe
        const categoriaExiste = await knex('categorias').where({ id: categoria_id }).first();
        if (!categoriaExiste) {
            return res.status(400).json({ mensagem: 'Categoria não encontrada.' });
        }

        // Atualizar produto
        const dados = {
            descricao,
            quantidade_estoque,
            valor,
            categoria_id,
        };

        // Verificar se há uma nova imagem
        if (req.file) {
            const { originalname, mimetype, buffer } = req.file;

            // Imagem
            const produto_imagem = await uploadImagem(
                `produtos/${id}/${originalname}`,
                buffer,
                mimetype
            );

            dados.produto_imagem = produto_imagem.url;
        }

        await knex('produtos').where({ id }).update(dados);

        const produtoEditado = await knex('produtos').where({ id: produtoExiste.id }).select('descricao', 'quantidade_estoque', 'valor', 'categoria_id', 'produto_imagem').first();

        // Retornar produto atualizado
        res.status(200).json(produtoEditado);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensagem: 'Erro no Servidor.' });
    }
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
};


const cadastrarPedido = async (req, res) => {
    const { cliente_id, observacao, pedido_produtos } = req.body;

    try {

        if (!cliente_id || !pedido_produtos) {
            return res.status(400).json({ mensagem: "Os campos cliente_id e pedido_produtos são obrigatórios" })
        }

        for (i = 0; i < pedido_produtos.length; i++) {
            if (!pedido_produtos[i].produto_id || !pedido_produtos[i].quantidade_produto) {
                return res.status(400).json({ mensagem: "Os campos produto_id e quantidade_produto são obrigatórios" })
            }
        }

        const clienteCadastradoId = await knex('clientes').where("id", cliente_id).first();

        if (!clienteCadastradoId) {
            return res.status(400).json('Esse cliente não existe.')
        }


        let valor_total = 0;
        for (i = 0; i < pedido_produtos.length; i++) {

            const produtoCadastradoId = await knex('produtos').where("id", pedido_produtos[i].produto_id).first();

            if (!produtoCadastradoId) {
                return res.status(400).json('Um ou mais produtos vinculados ao pedido não existe(m).')
            }

            const produtoQuantEstoque = await knex('produtos').where("id", pedido_produtos[i].produto_id).select('quantidade_estoque').first();
            const { quantidade_estoque } = produtoQuantEstoque;

            if (quantidade_estoque < pedido_produtos[i].quantidade_produto) {
                return res.status(400).json("Não há itens suficientes no estoque para atender a este pedido.")
            }

            const produtoValor = await knex('produtos').where("id", pedido_produtos[i].produto_id).select('valor').first();
            const { valor } = produtoValor;
            valor_total = valor_total + (valor * pedido_produtos[i].quantidade_produto);

        }

        const cadastroPedido = await knex("pedidos")
            .insert({
                cliente_id,
                observacao,
                valor_total
            }).returning('*')

        const pedidoID = (await knex('pedidos').select('id'));
        const index = pedidoID.length;
        const { id } = pedidoID[index - 1];

        for (const pedidoProduto of pedido_produtos) {
            const valorDoProduto = await knex('produtos').where("id", pedidoProduto.produto_id).select('valor').first();
            const { valor } = valorDoProduto;
            await knex('pedido_produtos')
                .insert({
                    pedido_id: id,
                    produto_id: pedidoProduto.produto_id,
                    quantidade_produto: pedidoProduto.quantidade_produto,
                    valor_produto: valor
                })
        }

        if (!cadastroPedido[0]) {
            return res.status(400).json({ mensagem: "Pedido não cadastrado." })
        }

        const cliente = await knex('clientes').where({ id: cliente_id }).first();

        if (!cliente) {
            return res.status(400).json({ mensagem: 'Cliente não encontrado.' });
        }

        await sendMail(cliente.email, cliente.nome);

        return res.status(200).json(cadastroPedido[0]);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const listarPedidos = async (req, res) => {
    const { cliente_id } = req.query;

    try {

        //na tabela pedidos pegar o cliente id que eu estou passando como query e vai pegar o id desta tabela
        if (cliente_id) {
            const listarPedidos = await knex("pedidos").where({ cliente_id }).select("*");
            const [{ id }] = listarPedidos;
            const listarPedidosProduto = await knex("pedido_produtos").where('pedido_id', id);
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
    cadastrarPedido,
    listarPedidos

}