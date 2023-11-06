var database = require("../database/config");

function puxarDadosCpu(idTotem){
    var instrucao = `select dt_hora, valor from dados where fktotem = ${idTotem}`;
    console.log(`executando ${instrucao}`)
    return database.executar(instrucao);
}

function puxarDadosRam(idTotem){
    var instrucao = `select dt_hora, valor from dados where fktotem = ${idTotem}`;
    console.log(`executando ${instrucao}`)
    return database.executar(instrucao);
}

function puxarDadosDisco(idTotem){
    var instrucao = `select dt_hora, valor from dados where fktotem = ${idTotem}`;
    console.log(`executando ${instrucao}`)
    return database.executar(instrucao);
}

function puxarDadosUsb(idTotem){
    var instrucao = `select dt_hora, valor from dados where fktotem = ${idTotem}`;
    console.log(`executando ${instrucao}`)
    return database.executar(instrucao);
}

module.exports = {
    puxarDadosCpu,
    puxarDadosRam,
    puxarDadosDisco,
    puxarDadosUsb,
}