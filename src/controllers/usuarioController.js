var usuarioModel = require("../models/usuarioModel")

function autenticar(req, res) {
    var credenciais = req.body.credenciaisJSON;
    console.log(credenciais)
    if (credenciais.email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (credenciais.senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {
        usuarioModel.autenticar(credenciais)
        .then((resposta) => {
            res.json(resposta)
        })
        .catch((erro) => {
                console.log(erro);
                console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
    }

}

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var credenciais = req.body.credenciaisJSON;

    for(var campo of Object.values(credenciais)){
        if(campo == undefined){
            res.status(400).send(`${campo} está undefined!`);
            return;
        }
    }
    // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
    usuarioModel.cadastrar(credenciais)
    .then((resposta)=> {
            res.json(resposta);
    }).catch((erro)=> {
        console.log(erro);
        console.log(
            "\nHouve um erro ao realizar o cadastro! Erro: ",
            erro.sqlMessage
        );
        res.status(500).json(erro.sqlMessage);
    }
    );
}

module.exports = {
    autenticar,
    cadastrar
}