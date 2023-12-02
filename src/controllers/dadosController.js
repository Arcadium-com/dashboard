var dadosModel = require("../models/dadosModel");



function puxarStatusTotens(req, res){
    var empresa = req.params.idEmpresa
    dadosModel.puxarStatusTotens(empresa).then(function (resultado) {
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

function puxarTotensForaServico(req, res){
    var empresa = req.params.idEmpresa;
    dadosModel.puxarTotensForaServico(empresa).then(function (resultado) {
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

function puxarTotemComMaisAlertas(req, res){ 
    var empresa = req.params.idEmpresa
    dadosModel.puxarTotemMaisAlertas(empresa).then(function (resultado) {
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

async function puxarHorariosComQuantidadeAlertas(req, res) {
    var empresa = req.params.idEmpresa;
    try {
        const resultado = await dadosModel.puxarHorariosComQuantidadeAlertas(empresa);
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!");
        }
    } catch (erro) {
        console.error("Houve um erro ao realizar a consulta! Erro: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    }
}

function puxarMaquinas(req, res){
    var empresa = req.params.idEmpresa;
    dadosModel.puxarMaquinas(empresa).then(function (resultado) {
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

function puxarDadosMaquina(req, res){
    var maquina = req.params.idMaquina;
    dadosModel.puxarDadosMaquina(maquina)
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

function puxarIndicadores(req, res){
    var maquina = req.params.idMaquina;
    dadosModel.puxarIndicadores(maquina)
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

function puxarDadoMaisRecente(req, res){
    var maquina = req.params.idMaquina;
    dadosModel.puxarDadoMaisRecente(maquina)
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

function puxarDadoMaisRecenteTodasMaquinas(req, res){
    var empresa = req.params.idEmpresa;
    dadosModel.puxarDadoMaisRecenteTodasMaquinas(empresa)
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

function puxarDiasMesComQuantidadeAlertas(req, res){
    var empresa = req.params.idEmpresa;
    dadosModel.puxarDiasMesComQuantidadeAlertas(empresa)
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

function puxarDiaSemanaComMaisAlertas(req, res){
    var empresa = req.params.idEmpresa;
    dadosModel.puxarDiaSemanaComMaisAlertas(empresa)
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
    puxarStatusTotens,
    puxarTotensForaServico,
    puxarTotemComMaisAlertas,
    puxarHorariosComQuantidadeAlertas,
    puxarMaquinas,
    puxarDadosMaquina,
    puxarIndicadores,
    puxarDadoMaisRecente,
    puxarDiasMesComQuantidadeAlertas,
    puxarDiaSemanaComMaisAlertas,
    puxarDadoMaisRecenteTodasMaquinas
}