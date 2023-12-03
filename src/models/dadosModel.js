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
    var instrucao = `SELECT totem.id as id_totem, COUNT(*) as quantidade_problemas FROM totem JOIN empresa ON totem.fkempresa = empresa.id JOIN Indicadores ON empresa.fkindicadores = Indicadores.id JOIN dados ON dados.fktotem = totem.id WHERE (valorCPU >= LimiteCPU OR valorMemoriaRAM >= LimiteRAM OR valorDisco >= LimiteDisco) OR dados.USB != IndicadorUSB AND totem.fkempresa = ${idEmpresa} GROUP BY totem.id ORDER BY quantidade_problemas DESC LIMIT 1;`

    var instrucaoSqlServer = `SELECT TOP 1 totem.id as id_totem, COUNT(*) as quantidade_problemas FROM totem JOIN empresa ON totem.fkempresa = empresa.id JOIN Indicadores ON empresa.fkindicadores = Indicadores.id JOIN dados ON dados.fktotem = totem.id WHERE (valorCPU >= LimiteCPU OR valorMemoriaRAM >= LimiteRAM OR valorDisco >= LimiteDisco OR dados.USB != IndicadorUSB) AND totem.fkempresa = ${idEmpresa} GROUP BY totem.id ORDER BY quantidade_problemas DESC;`
    console.log(`executando: ${instrucao}`);
    return database.executar(instrucaoSqlServer);
}

function puxarHorariosComQuantidadeAlertas(idEmpresa) {
    const ambiente = "sqlserver" // sqlserver
    var instrucao = `select hour(dt_hora) as "hora" , count(*) as "quantidade_alertas" from dados join totem on totem.id = dados.fktotem
    join empresa on totem.fkempresa = empresa.id
    join indicadores on indicadores.id = empresa.fkindicadores
    where (valorDisco >= LimiteDisco or valorMemoriaRAM >= LimiteRAM or valorCPU >= LimiteCPU or dados.USB != IndicadorUSB) and date(dt_hora) = date(current_date())
    and empresa.id = ${idEmpresa} group by hora;`
    var instrucaoSqlServer = `SELECT
    DATEPART(HOUR, dt_hora) AS hora,
    COUNT(*) AS quantidade_problemas
FROM
    dados
    JOIN totem ON totem.id = dados.fktotem
    JOIN empresa ON totem.fkempresa = empresa.id
    JOIN indicadores ON indicadores.id = empresa.fkindicadores
WHERE
    (valorDisco >= LimiteDisco OR valorMemoriaRAM >= LimiteRAM OR valorCPU >= LimiteCPU OR dados.USB != IndicadorUSB)
    AND CONVERT(DATE, dt_hora) = CONVERT(DATE, GETDATE())
    AND empresa.id = ${idEmpresa} 
GROUP BY
    DATEPART(HOUR, dt_hora)
    order by hora;`
    return database.executar(instrucaoSqlServer)
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

    console.log(`Executando puxarDadosMaquina`);
    return database.executar(instrucaoSqlServer);
}

function puxarIndicadores(idMaquina) {
    var instrucao = `select LimiteCPU as "cpu", LimiteRAM as "ram", LimiteDisco as "disco", IndicadorUSB as "usb" from indicadores join empresa on fkindicadores = indicadores.id where empresa.id = ${idMaquina};`

    //igual pros dois
    console.log(`Executando puxarIndicadores`);
    return database.executar(instrucao);
}

function puxarDadoMaisRecente(idMaquina) {
    var instrucao = `select TIME(dt_hora) as hora, DATE(dt_hora) as "data", valorCPU as cpu, valorDisco as disco, valorMemoriaRAM as ram, dados.USB as usb  from dados join totem on fktotem = totem.id where totem.id = ${idMaquina} and DATE(dt_hora) = DATE(current_date) order by dt_hora desc limit 1;`

    var instrucaoSqlServer = `SELECT CAST(dt_hora AS DATE) AS [data], FORMAT(dt_hora, 'HH:mm:ss') AS hora, valorCPU AS cpu, valorDisco AS disco, valorMemoriaRAM AS ram, dados.USB AS usb FROM dados JOIN totem ON fktotem = totem.id WHERE totem.id = ${idMaquina} AND CAST(dt_hora AS DATE) = CAST(GETDATE() AS DATE) ORDER BY dt_hora DESC OFFSET 0 ROWS FETCH FIRST 1 ROWS ONLY;`

    console.log(`Executando puxandoDadoMaisRecente`);
    return database.executar(instrucaoSqlServer);
}

function puxarDadoMaisRecenteTodasMaquinas(idEmpresa) {
    var instrucao = `select TIME(dt_hora) as hora,  totem.id as "totem", DATE(dt_hora) as "data", valorCPU as cpu, valorDisco as disco, valorMemoriaRAM as ram, dados.USB as usb  from dados join totem on fktotem = totem.id where totem.fkempresa = ${idEmpresa} and DATE(dt_hora) = DATE(current_date) order by dt_hora desc limit 1;`
    console.log(`Executando puxandoDadoMaisRecenteTodasMaquinas`);

    var instrucaoSqlServer = `SELECT FORMAT(dt_hora, 'HH:mm:ss') AS hora, totem.id AS totem, CAST(dt_hora AS DATE) AS [data], valorCPU AS cpu, valorDisco AS disco, valorMemoriaRAM AS ram, dados.USB AS usb FROM dados JOIN totem ON fktotem = totem.id WHERE totem.fkempresa = ${idEmpresa} AND CAST(dt_hora AS DATE) = CAST(GETDATE() AS DATE) ORDER BY dt_hora DESC OFFSET 0 ROWS FETCH FIRST 1 ROWS ONLY;`
    return database.executar(instrucaoSqlServer);
}

async function puxarDiasMesComQuantidadeAlertas(idMaquina) {
    const ambiente = "sqlserver";
    const pool = new sql.ConnectionPool(database.sqlServerConfig);

    try {
        console.log("Conectando ao SQL Server...");
        await pool.connect();
        console.log('Conexão SQL Server estabelecida com sucesso!');

        const instrucoes = {
            script1: `IF OBJECT_ID('dbo.todos_dias_mes', 'U') IS NOT NULL
            DROP TABLE dbo.todos_dias_mes;`,
            script2: `
                CREATE TABLE dbo.todos_dias_mes (
                    dia_do_mes DATE
                );

                INSERT INTO dbo.todos_dias_mes (dia_do_mes)
                SELECT DISTINCT DATEADD(DAY, -(a.a + (10 * b.a) + (100 * c.a)), GETDATE())
                FROM (SELECT 0 AS a UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) AS a
                CROSS JOIN (SELECT 0 AS a UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) AS b
                CROSS JOIN (SELECT 0 AS a UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) AS c
                WHERE DATEADD(DAY, -(a.a + (10 * b.a) + (100 * c.a)), GETDATE()) BETWEEN DATEADD(DAY, -DAY(EOMONTH(GETDATE())), GETDATE()) AND GETDATE();
            `,
            script3: `
            SELECT
            DAY(dia_do_mes) as dia,
            COALESCE(SUM(CASE WHEN valorCPU >= LimiteCPU THEN 1 ELSE 0 END), 0) AS qtd_alertas_cpu,
            COALESCE(SUM(CASE WHEN valorMemoriaRAM >= LimiteRAM THEN 1 ELSE 0 END), 0) AS qtd_alertas_ram,
            COALESCE(SUM(CASE WHEN valorDisco >= LimiteDisco THEN 1 ELSE 0 END), 0) AS qtd_alertas_disco,
            COALESCE(SUM(CASE WHEN dados.USB != IndicadorUSB THEN 1 ELSE 0 END), 0) as qtd_alertas_usb
                FROM
                    dbo.todos_dias_mes
                LEFT JOIN
                    dados ON CAST(dados.dt_hora AS DATE) = dbo.todos_dias_mes.dia_do_mes
                LEFT JOIN
                    totem ON totem.id = dados.fktotem AND totem.id = ${idMaquina} -- Substitua 3 pelo valor real de @idMaquina
                LEFT JOIN
                    empresa ON empresa.id = totem.fkempresa
                LEFT JOIN
                    indicadores ON empresa.fkindicadores = indicadores.id
                WHERE MONTH(dia_do_mes) = MONTH(GETDATE())
                GROUP BY
                    DAY(dia_do_mes)
                ORDER BY
                DAY(dia_do_mes);
            `,
        };

        // Iniciar transação
        const transaction = new sql.Transaction(pool);

        // Tente executar as instruções dentro da transação
        try {
            await transaction.begin();

            // Executar instrução 1
            await transaction.request().query(instrucoes.script1);

            // Executar instrução 2
            await transaction.request().query(instrucoes.script2);

            // Executar instrução 3
            const resultados = await transaction.request().query(instrucoes.script3);
            console.log('Resultados SQL Server:', resultados.recordset);

            // Commit da transação
            await transaction.commit();

            return resultados.recordset;
        } catch (error) {
            // Rollback em caso de erro
            console.error("Erro ao executar transação SQL Server:", error);
            await transaction.rollback();
        }
    } catch (error) {
        console.error("Houve um erro ao realizar a consulta de 'puxarHorariosComQuantidadeAlertas': ", error);
    } finally {
        pool.close();
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
    empresa e ON e.id = t.fkempresa
JOIN
    Indicadores i ON e.fkindicadores = i.id
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
    COUNT(*) / COUNT(DISTINCT DAY(d.dt_hora)) AS media_alertas
FROM
    dados d
JOIN
    totem t ON d.fktotem = t.id
JOIN
    empresa e ON e.id = t.fkempresa
JOIN
    Indicadores i ON e.fkindicadores = i.id
WHERE
    (
        -- Condições para alertas críticos para CPU, RAM e Disco
        (d.valorCPU >= i.LimiteCPU OR d.valorMemoriaRAM >= i.LimiteRAM OR d.valorDisco >= i.LimiteDisco)
        OR
        -- Condição para alertas críticos para USB
        (d.USB != i.IndicadorUSB)
    )
    AND t.fkempresa = ${idEmpresa} -- Substitua [ID_DA_EMPRESA] pelo ID da empresa desejada
    AND MONTH(d.dt_hora) = MONTH(GETDATE()) -- Filtra pelo mês atual
    AND YEAR(d.dt_hora) = YEAR(GETDATE())   -- Filtra pelo ano atual
GROUP BY
    DATENAME(WEEKDAY, d.dt_hora)
ORDER BY
    media_alertas DESC;
;
`
    console.log("Executando puxarDiaSemanaComMaisAlertas")
    return database.executar(instrucaoSqlServer)
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