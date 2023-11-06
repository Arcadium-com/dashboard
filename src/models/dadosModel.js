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

function puxarStatusTotens(){
    var instrucao = "select totem.id, statusTotem from totem join statustotem on fkstatus = statustotem.id;"
    console.log(`executando ${instrucao}`);
    return database.executar(instrucao);
}   

function puxarTotensForaServico(){
    var instrucao = "select count(*) as totalFora from totem where fkstatus = 2;" // quantidade de totens inativos ou em manutenção
    console.log(`executando ${instrucao}`);
    return database.executar(instrucao);
}

module.exports = {
    puxarDadosCpu,
    puxarDadosRam,
    puxarDadosDisco,
    puxarDadosUsb,
    puxarStatusTotens,
    puxarTotensForaServico
}