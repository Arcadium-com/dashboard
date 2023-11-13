var database = require("../database/config");
var mysql = require("mysql2");


function puxarStatusTotens() {
    var instrucao = "select totem.id, statusTotem from totem join statustotem on fkstatus = statustotem.id order by totem.id;"
    console.log(`executando ${instrucao}`);
    return database.executar(instrucao);
}

function puxarTotensForaServico() {
    var instrucao = "select count(*) as totalFora from totem where fkstatus = 2;" // quantidade de totens inativos ou em manutenção
    console.log(`executando ${instrucao}`);
    return database.executar(instrucao);
}

function puxarTotemMaisAlertas() {
    var instrucao = "SELECT totem.id as id_totem, COUNT(*) as quantidade_problemas FROM totem JOIN indicadores ON totem.fkindicadores = indicadores.id JOIN dados ON dados.fktotem = totem.id WHERE (valorCPU >= limiteCPU OR valorMemoriaRAM >= limiteRAM OR valorDisco >= limiteDisco) GROUP BY totem.id ORDER BY quantidade_problemas DESC LIMIT 1;"
    console.log(`executando: ${instrucao}`);
    return database.executar(instrucao);
}

async function puxarHorariosComQuantidadeAlertas() { // PERCEBI AGORA QUE NÃO TA FILTRANDO POR EMPRESA, PRECISO CORRIGIR!!!
    try {
        var conexao = mysql.createConnection(database.mySqlConfig);
        conexao.connect();

        let instrucao1 = `
        DROP TEMPORARY TABLE IF EXISTS todos_horarios;`

        let instrucao2 =
            `CREATE TEMPORARY TABLE todos_horarios AS
        SELECT CURDATE() + INTERVAL 8 HOUR as hora
        UNION SELECT CURDATE() + INTERVAL 9 HOUR
        UNION SELECT CURDATE() + INTERVAL 10 HOUR
        UNION SELECT CURDATE() + INTERVAL 11 HOUR
        UNION SELECT CURDATE() + INTERVAL 12 HOUR
        UNION SELECT CURDATE() + INTERVAL 13 HOUR
        UNION SELECT CURDATE() + INTERVAL 14 HOUR
        UNION SELECT CURDATE() + INTERVAL 15 HOUR
        UNION SELECT CURDATE() + INTERVAL 16 HOUR
        UNION SELECT CURDATE() + INTERVAL 17 HOUR
        UNION SELECT CURDATE() + INTERVAL 18 HOUR
        UNION SELECT CURDATE() + INTERVAL 19 HOUR
        UNION SELECT CURDATE() + INTERVAL 20 HOUR
        UNION SELECT CURDATE() + INTERVAL 21 HOUR
        UNION SELECT CURDATE() + INTERVAL 22 HOUR
        UNION SELECT CURDATE() + INTERVAL 23 HOUR;`

        let instrucao3 =
            `SELECT HOUR(todos_horarios.hora) as hora,
        IFNULL(SUM(CASE WHEN valorCPU >= limiteCPU OR valorMemoriaRAM >= limiteRAM OR valorDisco >= limiteDisco OR dados.USB < totem.USB THEN 1 ELSE 0 END), 0) as quantidade_problemas
        FROM todos_horarios
        LEFT JOIN dados ON DATE_FORMAT(dados.dt_hora, '%Y-%m-%d %H:00:00') = todos_horarios.hora
        LEFT JOIN totem ON totem.id = dados.fktotem
        LEFT JOIN indicadores ON totem.fkindicadores = indicadores.id
        WHERE (valorCPU >= limiteCPU OR valorMemoriaRAM >= limiteRAM OR valorDisco >= limiteDisco OR dados.USB < totem.USB OR dados.dt_hora IS NULL)
        AND DATE(todos_horarios.hora) = CURRENT_DATE
        GROUP BY todos_horarios.hora
        ORDER BY todos_horarios.hora;`;
        console.log("Executando 'puxarHorariosComQuantidadeAlertas'")


        await database.executarSemEncerrar(instrucao1, conexao);
        await database.executarSemEncerrar(instrucao2, conexao);
        let resultado = await database.executarSemEncerrar(instrucao3, conexao);
        conexao.end()
        return resultado;
    } catch (error) {
        console.error("Houve um erro ao realizar a consulta de 'puxarHorariosComQuantidadeAlertas': ", error)
    }
}

function puxarMaquinas(idEmpresa) {
    var instrucao = `select id from totem where fkempresa = ${idEmpresa}`;
    console.log(`Executando ${instrucao}`);
    return database.executar(instrucao);
}

function puxarDadosMaquina(idMaquina) {
    var instrucao = `select TIME(dt_hora) as hora, DATE(dt_hora) as "data", valorCPU, valorDisco, valorMemoriaRAM, USB from dados where fktotem = ${idMaquina} and DATE(dt_hora) = DATE(current_date) order by dt_hora desc limit 7`
    console.log(`Executando ${instrucao}`);
    return database.executar(instrucao);
}

function puxarIndicadores(idMaquina) {
    var instrucao = `select totem.id as "idtotem", limitecpu, limiteram, limitedisco, usb as limiteusb from indicadores join totem on fkindicadores = indicadores.id where totem.id = ${idMaquina};`
    console.log(`Executando ${instrucao}`);
    return database.executar(instrucao);
}

function puxarDadoMaisRecente(idMaquina) {
    var instrucao = `select TIME(dt_hora) as hora, DATE(dt_hora) as "data", valorCPU, valorDisco, valorMemoriaRAM, dados.USB  from dados join totem on fktotem = totem.id where totem.id = ${idMaquina} and DATE(dt_hora) = DATE(current_date) order by dt_hora desc limit 1;`
    console.log(`Executando puxandoDadoMaisRecente`);
    return database.executar(instrucao);
}

async function puxarDiasMesComQuantidadeAlertas(idEmpresa) {
    try {
        var conexao = mysql.createConnection(database.mySqlConfig);
        conexao.connect();

        let instrucao1 = `DROP TEMPORARY TABLE IF EXISTS todos_dias_mes`;

        let instrucao2 = `CREATE TEMPORARY TABLE todos_dias_mes AS
            SELECT CURDATE() - INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY AS dia_do_mes
            FROM (SELECT 0 AS a UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) AS a
            CROSS JOIN (SELECT 0 AS a UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) AS b
            CROSS JOIN (SELECT 0 AS a UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) AS c
            WHERE (CURDATE() - INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY) BETWEEN CURDATE() - INTERVAL DAY(LAST_DAY(CURDATE())) DAY AND CURDATE();`
        let instrucao3 = `SELECT
            day(todos_dias_mes.dia_do_mes) as dia,
            COALESCE(SUM(CASE WHEN valorCPU >= limiteCPU THEN 1 ELSE 0 END), 0) AS qtd_alertas_cpu,
            COALESCE(SUM(CASE WHEN valorMemoriaRAM >= limiteRAM THEN 1 ELSE 0 END), 0) AS qtd_alertas_ram,
            COALESCE(SUM(CASE WHEN valorDisco >= limiteDisco THEN 1 ELSE 0 END), 0) AS qtd_alertas_disco,
            COALESCE(SUM(CASE WHEN dados.USB < totem.USB THEN 1 ELSE 0 END), 0) as qtd_alertas_usb
            FROM
            todos_dias_mes
            LEFT JOIN
            dados ON DATE(dados.dt_hora) = todos_dias_mes.dia_do_mes
            LEFT JOIN
            totem ON totem.id = dados.fktotem AND totem.fkempresa = ${idEmpresa}
            LEFT JOIN
            indicadores ON totem.fkindicadores = indicadores.id
            where MONTH(dia_do_mes) = MONTH(current_date)
            GROUP BY
            todos_dias_mes.dia_do_mes
            order by dia_do_mes;`

        await database.executarSemEncerrar(instrucao1, conexao);
        await database.executarSemEncerrar(instrucao2, conexao);
        let resultado = await database.executarSemEncerrar(instrucao3, conexao);
        conexao.end()
        return resultado;
    } catch (error) {
        console.error("Houve um erro ao realizar a consulta de 'puxarHorariosComQuantidadeAlertas': ", error)
    }
}


module.exports = {
    puxarStatusTotens,
    puxarTotensForaServico,
    puxarTotemMaisAlertas,
    puxarHorariosComQuantidadeAlertas,
    puxarMaquinas,
    puxarDadosMaquina,
    puxarIndicadores,
    puxarDadoMaisRecente,
    puxarDiasMesComQuantidadeAlertas
}