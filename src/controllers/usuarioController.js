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

function verificarPermissao(req, res){
    var permissao = req.params.fkPermissao;;
    if(permissao == undefined){
        res.status(400).send('permissao esta undefined');
        return;
    }
    usuarioModel.verificarPermissao(permissao)
    .then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(
        function (erro) {
            console.log(erro);
            console.log("Houve um erro ao realizar a consulta! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        }
    );
}

function puxarPermissoes(req, res){
    usuarioModel.puxarPermissoes()
    .then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(
        function (erro) {
            console.log(erro);
            console.log("Houve um erro ao realizar a consulta! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        }
    );
}

module.exports = {
    autenticar,
    cadastrar,
    puxarPermissoes,
    verificarPermissao
}