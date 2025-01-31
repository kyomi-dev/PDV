const joi = require("joi")

const schemaValidacao = joi.object({
    nome: joi.string().required().messages({
        "any.required": "O campo nome é obrigatório",
        "string.empty": "O campo nome é obrigatório"
    }),
    email: joi.string().email().required().messages({
        "string.email": "O campo email precisa ter um formato válido",
        "any.required": "O campo email é obrigatório",
        "string.empty": "O campo email é obrigatório"
    }),
    senha: joi.string().min(5).required().messages({
        "any.required": "O campo senha é obrigatório",
        "string.min": "A senha precisa ter no mínimo 5 caracteres",
        "string.empty": "O campo senha é obrigatório"
    }),
});

module.exports = schemaValidacao; 