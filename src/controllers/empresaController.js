var empresaModel = require("../models/empresaModel")

function cadastrar(req, res) {
    var credenciais = req.body.credenciaisJSON;
    console.log("Estou em cadastrar empresa")
    console.log(credenciais)
    for(var campo of Object.values(credenciais)){
        if(campo == undefined){
            res.status(400).send(`${campo} está undefined!`);
            return;
        }
    }
    console.log("estou indo ao model!")
    empresaModel.cadastrar(credenciais)
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
    cadastrar
}