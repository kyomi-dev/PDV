/ / 1a Sprint 

CREATE TABLE usuarios (
    id SERIAL NOT NULL PRIMARY KEY, nome TEXT NOT NULL, email TEXT NOT NULL UNIQUE, senha TEXT NOT NULL
);

CREATE TABLE categorias (
    id SERIAL NOT NULL PRIMARY KEY, descricao TEXT NOT NULL
);

INSERT INTO
    categorias (descricao)
VALUES ('Informática'),
    ('Celulares'),
    ('Beleza e Perfumaria'),
    ('Mercado'),
    ('Livros e Papelaria'),
    ('Brinquedos'),
    ('Moda'),
    ('Bebê'),
    ('Games');

CREATE TABLE produtos (
    id SERIAL PRIMARY KEY NOT NULL, descricao TEXT NOT NULL, quantidade_estoque INTEGER NOT NULL, valor INTEGER NOT NULL, categoria_id INTEGER REFERENCES categorias (id)
);

CREATE TABLE clientes (
    id SERIAL PRIMARY KEY NOT NULL, nome TEXT NOT NULL, email TEXT NOT NULL UNIQUE, cpf TEXT NOT NULL UNIQUE, cep TEXT, rua TEXT, numero TEXT, bairro TEXT, cidade TEXT, estado TEXT
);

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY NOT NULL, cliente_id INTEGER REFERENCES clientes (id), observacao TEXT NOT NULL, valor_total DECIMAL NOT NULL
);

CREATE TABLE pedidos_produtos (
    id SERIAL PRIMARY KEY NOT NULL, pedido_id INTEGER REFERENCES pedidos (id), produto_id INTEGER REFERENCES produtos (id), quantidade_produto INTEGER NOT NULL, valor_produto DECIMAL NOT NULL
);

ALTER TABLE produtos ADD produto_imagem TEXT;

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY NOT NULL, cliente_id INTEGER REFERENCES clientes (id), observacao TEXT NOT NULL, valor_total DECIMAL NOT NULL
);

CREATE TABLE pedidos_produtos (
    id SERIAL PRIMARY KEY NOT NULL, pedido_id INTEGER REFERENCES pedidos (id), produto_id INTEGER REFERENCES produtos (id), quantidade_produto INTEGER NOT NULL, valor_produto DECIMAL NOT NULL
);

ALTER TABLE produtos ADD produto_imagem TEXT;

ALTER TABLE pedidos_produtos RENAME TO pedido_produtos;

ALTER TABLE pedido_produtos ALTER COLUMN valor_produto TYPE INTEGER;

ALTER TABLE pedidos ALTER COLUMN valor_total TYPE INTEGER;