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