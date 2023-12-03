var database = require("../database/config");
var mysql = require("mysql2");
var sql = require("mssql");


function puxarStatusTotens(idEmpresa) {
    var instrucao = `select totem.id, statusTotem from totem join statusTotem on fkstatus = statusTotem.id where totem.fkempresa = ${idEmpresa} order by totem.id;`
    console.log(`executando ${instrucao}`);
    return database.executar(instrucao);
    // sintaxe igual pra SQL Server e MYSQL
}


function puxarTotensForaServico(idEmpresa) {
    var instrucao = `select count(*) as totalFora from totem where fkstatus = 2 and totem.fkempresa = ${idEmpresa};` // quantidade de totens inativos ou em manutenção
    console.log(`executando ${instrucao}`);
    return database.executar(instrucao);
    // sintaxe igual pra SQL SERVER E MYSQL
}

function puxarTotemMaisAlertas(idEmpresa) {
    var instrucao = `SELECT totem.id as id_totem, COUNT(*) as quantidade_problemas FROM totem JOIN Indicadores ON totem.fkindicadores = Indicadores.id JOIN dados ON dados.fktotem = totem.id WHERE (valorCPU >= LimiteCPU OR valorMemoriaRAM >= LimiteRAM OR valorDisco >= LimiteDisco) OR dados.USB != IndicadorUSB AND totem.fkempresa = ${idEmpresa} GROUP BY totem.id ORDER BY quantidade_problemas DESC LIMIT 1;`

    var instrucaoSqlServer = `SELECT TOP 1 totem.id AS id_totem, COUNT(*) AS quantidade_problemas FROM totem JOIN Indicadores ON totem.fkindicadores = Indicadores.id JOIN dados ON dados.fktotem = totem.id WHERE (valorCPU >= LimiteCPU OR valorMemoriaRAM >= LimiteRAM OR valorDisco >= LimiteDisco) OR dados.USB != IndicadorUSB AND totem.fkempresa = ${idEmpresa} GROUP BY totem.id ORDER BY quantidade_problemas DESC;`
    console.log(`executando: ${instrucao}`);
    return database.executar(instrucao);
}

async function puxarHorariosComQuantidadeAlertas(idEmpresa) {
    const ambiente = "mysql" // sqlserver
    
    try {
        const conexoes = {
            mySql: mysql.createConnection(database.mySqlConfig),
            sqlServer: new sql.ConnectionPool(database.sqlServerConfig)
        }
        const instrucoes = {
            mySql: {
                primeira: `DROP TEMPORARY TABLE IF EXISTS todos_horarios;`,
                segunda: `CREATE TEMPORARY TABLE todos_horarios AS
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
                UNION SELECT CURDATE() + INTERVAL 23 HOUR;`,
                terceira: `SELECT HOUR(todos_horarios.hora) as hora,
                IFNULL(SUM(CASE WHEN valorCPU >= LimiteCPU OR valorMemoriaRAM >= LimiteRAM OR valorDisco >= LimiteDisco OR dados.USB < IndicadorUSB THEN 1 ELSE 0 END), 0) as quantidade_problemas
                FROM todos_horarios
                LEFT JOIN dados ON DATE_FORMAT(dados.dt_hora, '%Y-%m-%d %H:00:00') = todos_horarios.hora
                LEFT JOIN totem ON totem.id = dados.fktotem
                LEFT JOIN indicadores ON totem.fkindicadores = indicadores.id
                WHERE (valorCPU >= LimiteCPU OR valorMemoriaRAM >= LimiteRAM OR valorDisco >= LimiteDisco OR dados.USB < IndicadorUSB OR dados.dt_hora IS NULL)
                AND DATE(todos_horarios.hora) = CURRENT_DATE
                AND TOTEM.FKEMPRESA = ${idEmpresa}
                GROUP BY todos_horarios.hora
                ORDER BY todos_horarios.hora;`
            }, sqlServer: {
                primeira: `DROP TABLE IF EXISTS todos_horarios;`,
                segunda: `CREATE TABLE todos_horarios AS
                    SELECT DATEADD(HOUR, 8, CAST(GETDATE() AS DATETIME)) as hora
                    UNION SELECT DATEADD(HOUR, 9, CAST(GETDATE() AS DATETIME))
                    UNION SELECT DATEADD(HOUR, 10, CAST(GETDATE() AS DATETIME))
                    UNION SELECT DATEADD(HOUR, 11, CAST(GETDATE() AS DATETIME))
                    UNION SELECT DATEADD(HOUR, 12, CAST(GETDATE() AS DATETIME))
                    UNION SELECT DATEADD(HOUR, 13, CAST(GETDATE() AS DATETIME))
                    UNION SELECT DATEADD(HOUR, 14, CAST(GETDATE() AS DATETIME))
                    UNION SELECT DATEADD(HOUR, 15, CAST(GETDATE() AS DATETIME))
                    UNION SELECT DATEADD(HOUR, 16, CAST(GETDATE() AS DATETIME))
                    UNION SELECT DATEADD(HOUR, 17, CAST(GETDATE() AS DATETIME))
                    UNION SELECT DATEADD(HOUR, 18, CAST(GETDATE() AS DATETIME))
                    UNION SELECT DATEADD(HOUR, 19, CAST(GETDATE() AS DATETIME))
                    UNION SELECT DATEADD(HOUR, 20, CAST(GETDATE() AS DATETIME))
                    UNION SELECT DATEADD(HOUR, 21, CAST(GETDATE() AS DATETIME))
                    UNION SELECT DATEADD(HOUR, 22, CAST(GETDATE() AS DATETIME))
                UNION SELECT DATEADD(HOUR, 23, CAST(GETDATE() AS DATETIME));`,
                terceira: `SELECT DATEPART(HOUR, todos_horarios.hora) as hora,
                    COALESCE(SUM(CASE WHEN valorCPU >= LimiteCPU OR valorMemoriaRAM >= LimiteRAM OR valorDisco >= LimiteDisco OR dados.USB < IndicadorUSB THEN 1 ELSE 0 END), 0) as quantidade_problemas
                    FROM todos_horarios
                    LEFT JOIN dados ON CONVERT(DATETIME, FORMAT(dados.dt_hora, 'yyyy-MM-dd HH:00:00')) = todos_horarios.hora
                    LEFT JOIN totem ON totem.id = dados.fktotem
                    LEFT JOIN indicadores ON totem.fkindicadores = indicadores.id
                    WHERE (valorCPU >= LimiteCPU OR valorMemoriaRAM >= LimiteRAM OR valorDisco >= LimiteDisco OR dados.USB < IndicadorUSB OR dados.dt_hora IS NULL)
                    AND CAST(todos_horarios.hora AS DATE) = CAST(GETDATE() AS DATE)
                    AND TOTEM.FKEMPRESA = ${idEmpresa}
                    GROUP BY DATEPART(HOUR, todos_horarios.hora)
                ORDER BY DATEPART(HOUR, todos_horarios.hora);`
            }       
        }
        
        if(ambiente == "mysql"){
            conexoes.mySql.connect();
            console.log("Executando 'puxarHorariosComQuantidadeAlertas'")
            await database.executarSemEncerrar(instrucoes.mySql.primeira, conexoes.mySql);
            await database.executarSemEncerrar(instrucoes.mySql.segunda, conexoes.mySql);
            let resultado = await database.executarSemEncerrar(instrucoes.mySql.terceira, conexoes.mySql);
            
            conexoes.mySql.end()
            return resultado;
        }else if(ambiente == "sqlserver"){
            console.log("Conectando ao SQL Server...");
            const pool = await conexoes.sqlServer.connect();
            console.log('Conexão SQL Server estabelecida com sucesso!');

            try {
                const requisicao = pool.request();
                const resultados1 = await requisicao.query(instrucoes.sqlServer.primeira);
                console.log('Resultados SQL Server 1:', resultados1.recordset);

                const resultados2 = await requisicao.query(instrucoes.sqlServer.segunda);
                console.log('Resultados SQL Server 2:', resultados2.recordset);

                const resultados3 = await requisicao.query(instrucoes.sqlServer.terceira);
                console.log('Resultados SQL Server 3:', resultados3.recordset);

                return resultados3.recordset;
            } catch (error) {
                console.error('Erro na execução de consultas SQL Server:', error);
            } finally {
                pool.close(); // Fechando a conexão SQL Server
            }
        }else{
            console.log("AMBIENTE NAO DEFINIDO!")
        }
    } catch (error) {
        console.error("Houve um erro ao realizar a consulta de 'puxarHorariosComQuantidadeAlertas': ", error)
    }
}

function puxarMaquinas(idEmpresa) {
    var instrucao = `select id from totem where fkempresa = ${idEmpresa}`;
    console.log(`Executando ${instrucao}`);
    return database.executar(instrucao);
    // igual pros dois
}

function puxarDadosMaquina(idMaquina) {
    var instrucao = `select TIME(dt_hora) as hora, DATE(dt_hora) as "data", valorCPU, valorDisco, valorMemoriaRAM, USB from dados where fktotem = ${idMaquina} and DATE(dt_hora) = DATE(current_date) order by dt_hora desc limit 7`
    var instrucaoSqlServer = `SELECT TOP 7 FORMAT(dt_hora, 'HH:mm') AS hora, FORMAT(dt_hora, 'yyyy-MM-dd') AS data, valorCPU, valorDisco, valorMemoriaRAM, USB FROM dados WHERE fktotem = ${idMaquina} AND CAST(dt_hora AS DATE) = CAST(GETDATE() AS DATE) ORDER BY dt_hora DESC;`

    console.log(`Executando ${instrucao}`);
    return database.executar(instrucao);
}

function puxarIndicadores(idMaquina) {
    var instrucao = `select LimiteCPU as "cpu", LimiteRAM as "ram", LimiteDisco as "disco", IndicadorUSB as "usb" from indicadores join totem on fkindicadores = indicadores.id where totem.id = ${idMaquina};`

    //igual pros dois
    console.log(`Executando ${instrucao}`);
    return database.executar(instrucao);
}

function puxarDadoMaisRecente(idMaquina) {
    var instrucao = `select TIME(dt_hora) as hora, DATE(dt_hora) as "data", valorCPU as cpu, valorDisco as disco, valorMemoriaRAM as ram, dados.USB as usb  from dados join totem on fktotem = totem.id where totem.id = ${idMaquina} and DATE(dt_hora) = DATE(current_date) order by dt_hora desc limit 1;`

    var instrucaoSqlServer = `SELECT CAST(dt_hora AS DATE) AS [data], FORMAT(dt_hora, 'HH:mm:ss') AS hora, valorCPU AS cpu, valorDisco AS disco, valorMemoriaRAM AS ram, dados.USB AS usb FROM dados JOIN totem ON fktotem = totem.id WHERE totem.id = ${idMaquina} AND CAST(dt_hora AS DATE) = CAST(GETDATE() AS DATE) ORDER BY dt_hora DESC OFFSET 0 ROWS FETCH FIRST 1 ROWS ONLY;`

    console.log(`Executando puxandoDadoMaisRecente`);
    return database.executar(instrucao);
}

function puxarDadoMaisRecenteTodasMaquinas(idEmpresa) {
    var instrucao = `select TIME(dt_hora) as hora,  totem.id as "totem", DATE(dt_hora) as "data", valorCPU as cpu, valorDisco as disco, valorMemoriaRAM as ram, dados.USB as usb  from dados join totem on fktotem = totem.id where totem.fkempresa = ${idEmpresa} and DATE(dt_hora) = DATE(current_date) order by dt_hora desc limit 1;`
    console.log(`Executando puxandoDadoMaisRecenteTodasMaquinas`);

    var instrucaoSqlServer = `SELECT FORMAT(dt_hora, 'HH:mm:ss') AS hora, totem.id AS totem, CAST(dt_hora AS DATE) AS [data], valorCPU AS cpu, valorDisco AS disco, valorMemoriaRAM AS ram, dados.USB AS usb FROM dados JOIN totem ON fktotem = totem.id WHERE totem.fkempresa = ${idEmpresa} AND CAST(dt_hora AS DATE) = CAST(GETDATE() AS DATE) ORDER BY dt_hora DESC OFFSET 0 ROWS FETCH FIRST 1 ROWS ONLY;`

    return database.executar(instrucao);
}

async function puxarDiasMesComQuantidadeAlertas(idEmpresa) {
    const ambiente = "mysql" // ou sqlserver
    try {
        const conexoes = {
            mySql: mysql.createConnection(database.mySqlConfig),
            sqlServer: new sql.ConnectionPool(database.sqlServerConfig)
        }
        const instrucoes = {
            mySql: {
                primeira: `DROP TEMPORARY TABLE IF EXISTS todos_dias_mes`,
                segunda: `CREATE TEMPORARY TABLE todos_dias_mes AS
                SELECT CURDATE() - INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY AS dia_do_mes
                FROM (SELECT 0 AS a UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) AS a
                CROSS JOIN (SELECT 0 AS a UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) AS b
                CROSS JOIN (SELECT 0 AS a UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) AS c
                WHERE (CURDATE() - INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY) BETWEEN CURDATE() - INTERVAL DAY(LAST_DAY(CURDATE())) DAY AND CURDATE();`,
                terceira: `SELECT
                day(todos_dias_mes.dia_do_mes) as dia,
                COALESCE(SUM(CASE WHEN valorCPU >= LimiteCPU THEN 1 ELSE 0 END), 0) AS qtd_alertas_cpu,
                COALESCE(SUM(CASE WHEN valorMemoriaRAM >= LimiteRAM THEN 1 ELSE 0 END), 0) AS qtd_alertas_ram,
                COALESCE(SUM(CASE WHEN valorDisco >= LimiteDisco THEN 1 ELSE 0 END), 0) AS qtd_alertas_disco,
                COALESCE(SUM(CASE WHEN dados.USB < IndicadorUSB THEN 1 ELSE 0 END), 0) as qtd_alertas_usb
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
            }, sqlServer: {
                primeira: `DROP TABLE IF EXISTS todos_dias_mes`,
                segunda: `CREATE TABLE todos_dias_mes AS
                    SELECT DATEADD(DAY, -(a.a + (10 * b.a) + (100 * c.a)), GETDATE()) AS dia_do_mes
                    FROM (SELECT 0 AS a UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) AS a
                    CROSS JOIN (SELECT 0 AS a UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) AS b
                    CROSS JOIN (SELECT 0 AS a UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) AS c
                    WHERE (DATEADD(DAY, -(a.a + (10 * b.a) + (100 * c.a)), GETDATE())) BETWEEN DATEADD(DAY, -DAY(EOMONTH(GETDATE())) + 1, GETDATE()) AND GETDATE();`,
                terceira: `SELECT
                    DAY(todos_dias_mes.dia_do_mes) as dia,
                    COALESCE(SUM(CASE WHEN valorCPU >= LimiteCPU THEN 1 ELSE 0 END), 0) AS qtd_alertas_cpu,
                    COALESCE(SUM(CASE WHEN valorMemoriaRAM >= LimiteRAM THEN 1 ELSE 0 END), 0) AS qtd_alertas_ram,
                    COALESCE(SUM(CASE WHEN valorDisco >= LimiteDisco THEN 1 ELSE 0 END), 0) AS qtd_alertas_disco,
                    COALESCE(SUM(CASE WHEN dados.USB < IndicadorUSB THEN 1 ELSE 0 END), 0) as qtd_alertas_usb
                    FROM
                    todos_dias_mes
                    LEFT JOIN
                    dados ON CAST(dados.dt_hora AS DATE) = todos_dias_mes.dia_do_mes
                    LEFT JOIN
                    totem ON totem.id = dados.fktotem AND totem.fkempresa = ${idEmpresa}
                    LEFT JOIN
                    indicadores ON totem.fkindicadores = indicadores.id
                    WHERE MONTH(todos_dias_mes.dia_do_mes) = MONTH(GETDATE())
                    GROUP BY
                    todos_dias_mes.dia_do_mes
                    ORDER BY
                    todos_dias_mes.dia_do_mes;`
            }
        }
        
        if(ambiente == "mysql"){
            conexoes.mySql.connect();
            console.log("Executando 'puxarHorariosComQuantidadeAlertas'")
            await database.executarSemEncerrar(instrucoes.mySql.primeira, conexoes.mySql);
            await database.executarSemEncerrar(instrucoes.mySql.segunda, conexoes.mySql);
            let resultado = await database.executarSemEncerrar(instrucoes.mySql.terceira, conexoes.mySql);
            
            conexoes.mySql.end()
            return resultado;
        }else if(ambiente == "sqlserver"){
            console.log("Conectando ao SQL Server...");
            const pool = await conexoes.sqlServer.connect();
            console.log('Conexão SQL Server estabelecida com sucesso!');

            try {
                const requisicao = pool.request();
                const resultados1 = await requisicao.query(instrucoes.sqlServer.primeira);
                console.log('Resultados SQL Server 1:', resultados1.recordset);

                const resultados2 = await requisicao.query(instrucoes.sqlServer.segunda);
                console.log('Resultados SQL Server 2:', resultados2.recordset);

                const resultados3 = await requisicao.query(instrucoes.sqlServer.terceira);
                console.log('Resultados SQL Server 3:', resultados3.recordset);

                return resultados3.recordset;
            } catch (error) {
                console.error('Erro na execução de consultas SQL Server:', error);
            } finally {
                pool.close(); // Fechando a conexão SQL Server
            }
        }else{
            console.log("AMBIENTE NAO DEFINIDO!")
        }
    } catch (error) {
        console.error("Houve um erro ao realizar a consulta de 'puxarHorariosComQuantidadeAlertas': ", error)
    }
}

function puxarDiaSemanaComMaisAlertas(idEmpresa){
    var instrucao = `SELECT
        DAYNAME(d.dt_hora) AS dia_da_semana,
        COUNT(*) / COUNT(DISTINCT DAYOFMONTH(d.dt_hora)) AS media_alertas
    FROM
        dados d
    JOIN
        totem t ON d.fktotem = t.id
    JOIN
        Indicadores i ON t.fkindicadores = i.id
    WHERE
        (
            -- Condições para alertas críticos para CPU, RAM e Disco
            (d.valorCPU >= i.LimiteCPU OR d.valorMemoriaRAM >= i.LimiteRAM OR d.valorDisco >= i.LimiteDisco)
            OR
            -- Condição para alertas críticos para USB
            (d.USB != i.IndicadorUSB)
        )
        AND t.fkempresa = ${idEmpresa}-- Substitua [ID_DA_EMPRESA] pelo ID da empresa desejada
        AND MONTH(d.dt_hora) = MONTH(NOW()) -- Filtra pelo mês atual
        AND YEAR(d.dt_hora) = YEAR(NOW())   -- Filtra pelo ano atual
    GROUP BY
        DAYNAME(d.dt_hora)
    ORDER BY
        media_alertas DESC;`

    var instrucaoSqlServer = `SELECT
    DATENAME(WEEKDAY, d.dt_hora) AS dia_da_semana,
    COUNT(*) * 1.0 / COUNT(DISTINCT DAY(d.dt_hora)) AS media_alertas
FROM
    dados d
JOIN
    totem t ON d.fktotem = t.id
JOIN
    Indicadores i ON t.fkindicadores = i.id
WHERE
    (
        -- Condições para alertas críticos para CPU, RAM e Disco
        (d.valorCPU >= i.LimiteCPU OR d.valorMemoriaRAM >= i.LimiteRAM OR d.valorDisco >= i.LimiteDisco)
        OR
        -- Condição para alertas críticos para USB
        (d.USB != i.IndicadorUSB)
    )
    AND t.fkempresa = ${idEmpresa}-- Substitua [ID_DA_EMPRESA] pelo ID da empresa desejada
    AND MONTH(d.dt_hora) = MONTH(GETDATE()) -- Filtra pelo mês atual
    AND YEAR(d.dt_hora) = YEAR(GETDATE())   -- Filtra pelo ano atual
GROUP BY
    DATENAME(WEEKDAY, d.dt_hora)
ORDER BY
    media_alertas DESC;
`
    console.log("Executando puxarDiaSemanaComMaisAlertas")
    return database.executar(instrucao)
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
    puxarDiasMesComQuantidadeAlertas,
    puxarDiaSemanaComMaisAlertas,
    puxarDadoMaisRecenteTodasMaquinas
}