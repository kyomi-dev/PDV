const express = require("express");
const app = express();
const rotas = require("./src/rotas/rotas");

app.use(express.json());
app.use(rotas);


app.get("/", async (_req, res) => {
    try {

        return res.json("funcionando ").status(200);
    } catch (error) {
        return res.json({ mensagem: "Erro interno do servidor." }).status(500);
    }
})

app.listen(process.env.PORT || 3000);