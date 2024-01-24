const joi = require("joi");

const schemaValidacaoProduto = joi.object({

    descricao: joi.string().required().messages({
        "any.required": "O campo descrição é obrigatório",
        "string.empty": "O campo descrição é obrigatório"
    }),

    quantidade_estoque: joi.number().integer().positive().required().messages({
        "any.required": "O campo quantidade_estoque é obrigatório",
        "number.base": "O campo quantidade_estoque precisa ser um número",
        "number.integer": "O campo quantidade_estoque precisa ser um número inteiro",
        "number.positive": "O campo quantidade_estoque precisa ser um número positivo"
    }),

    valor: joi.number().integer().positive().required().messages({
        "any.required": "O campo valor é obrigatório",
        "number.base": "O campo valor precisa ser um número",
        "number.integer": "O campo valor precisa ser um número inteiro",
        "number.positive": "O campo valor precisa ser um número positivo"
    }),

    categoria_id: joi.string().required().messages({
        "any.required": "O campo descrição é obrigatório",
        "string.empty": "O campo descrição é obrigatório"
    })
});

module.exports = schemaValidacaoProduto; 