const jwt = require("jsonwebtoken");
const senhaJwt = require("../../senha");

const criarToken = async (id) => {
    try {
        const token = jwt.sign({ id }, senhaJwt, { expiresIn: "2h" });
        return token;
    } catch (error) {
    throw new Error (error.message);
    }
};

module.exports = { criarToken };