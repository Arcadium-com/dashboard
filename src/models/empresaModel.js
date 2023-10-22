var database = require("../database/config")

function cadastrar(credenciais) {
    var instrucao = `
        INSERT INTO Empresa VALUES (null, '${credenciais.nomeResponsavel}', '${credenciais.nomeFantasia}', '${credenciais.cnpj}', '${credenciais.telefone}', '${credenciais.cep}', '${credenciais.tipoLogradouro}', '${credenciais.logradouro}', '${credenciais.numeroLogradouro}', '${credenciais.complemento}', '${credenciais.bairro}', '${credenciais.cidade}', ${credenciais.idEstado} );
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    cadastrar
};