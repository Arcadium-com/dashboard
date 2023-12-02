function puxarPermissoes(){
    var selectPermissoes = document.querySelector("#Permissao")
    fetch("/usuarios/puxarPermissoes")
    .then(response => {
        console.log(response)
        if(response.ok){
            response.json().then(resposta => {
                console.log(resposta)
                let arrayPermissoes;
                if(sessionStorage.getItem("PERMISSAO") == 1){ // Administrador Total
                    arrayPermissoes = resposta; // pode criar qualquer usuario
                }else if(sessionStorage.getItem("PERMISSAO") == 2){ // Administrador Técnico
                    arrayPermissoes = resposta.slice(2 , 4) // só pode criar usuario tecnico e funcionario
                }else{
                    arrayPermissoes = null;
                }
                for(let linha of arrayPermissoes){
                    let opcao = document.createElement("option");
                    opcao.setAttribute("value", linha.id);
                    opcao.textContent = linha.autoridade;
                    selectPermissoes.appendChild(opcao)
                }
            })
        }else{
            console.log("erro")
        }
    }).catch(error => console.log(error))
}

function puxarNomePermissao(){
    var fkPermissao = sessionStorage.getItem("PERMISSAO");
    fetch(`/usuarios/verificarPermissao/${fkPermissao}`)
    .then(response => {
        console.log(response)
        response.json().then(resposta => {
            sessionStorage.PERMISSAO_NOME = resposta[0].autoridade;
            document.querySelector("#Acesso").innerHTML += `<h5 class="destaque">${sessionStorage.getItem("PERMISSAO_NOME")}</h5>`;
        })
    }).catch(error => console.log(error))
}

function detectarPermissao(){
    const permissao = sessionStorage.getItem("PERMISSAO");
    const botaoCadastro = document.querySelector("#CadastroUsuarios");
    const botaoFuncionario = document.querySelector("#DashboardFuncionario")
    const botaoSuporte = document.querySelector("#DashboardSuporte")
    if(permissao == 1){
        console.log('Permissão Total');
    }else if(permissao == 2){
        botaoFuncionario.style.display = "none"
    }else if(permissao == 3){
        botaoCadastro.style.display = "none"
        botaoSuporte.style.display = "none"
    }else if(permissao == 4){
        botaoFuncionario.style.display = "none"
        botaoCadastro.style.display = "none"
    }else{
        window.location.href = "../acesso-foodie-kioske/FoodieKioskie.html"
    }
}

function puxarStatusTotens(){
    let elementoHTML = document.querySelector(".status-totem");
    fetch(`/dados/puxarStatusTotens/${sessionStorage.getItem("ID_EMPRESA")}`)
    .then(response => {
        console.log(response)
        if(response.ok){
            response.json().then(resposta => {
                // O PROBLEMA ACONTECE AQUI NO RESPONSE.JSON() POIS OS TOTENS CADASTRADOS NA TABELA TOTEM POSSUEM STATUS NULO
                // O QUE ACABA RESULTANDO NO CODIGO 204, REQUISIÇAO BEM SUCEEDIDA, POREM SEM RETORNO!
                resposta.forEach(element => {
                    let linhaTabela = document.createElement("tr")
                    let itemTabela1 = document.createElement("td"); itemTabela1.textContent = element.id;
                    let itemTabela2 = document.createElement("td"); itemTabela2.textContent = element.statusTotem;
                    linhaTabela.append(itemTabela1, itemTabela2);
                    elementoHTML.append(linhaTabela);
                });
            });
        }else{
            console.log("erro");
        }
    }).catch(error => console.log(error))
}

function puxarTotensFora(){
    let elementoHTML = document.querySelector("#TotensFora")
    fetch(`/dados/puxarTotensForaServico/${sessionStorage.getItem("ID_EMPRESA")}`)
    .then(response => {
        if(response.ok){
            response.json().then(response => {
                if(response[0].totalFora == 1){
                    elementoHTML.textContent = "1 totem"
                }else{
                    elementoHTML.textContent = `${response[0].totalFora} totens`
                }
            })
        }else{
            console.log('erro');
        }
    }).catch(error => console.log(error))
}

function puxarTotemComMaisAlertas(){
    let elementoHTML = document.querySelector("#TotemMaisAlertas");
    let elementoHTML2 = document.querySelector("#QuantidadeAlertas");
    fetch(`/dados/puxarTotemComMaisAlertas/${sessionStorage.getItem("ID_EMPRESA")}`)
    .then(response => {
        if(response.ok){
            response.json().then(resposta => {
                elementoHTML.textContent = `Totem ID ${resposta[0].id_totem}`;
                elementoHTML2.textContent = `${resposta[0].quantidade_problemas} alertas críticos`;       
            });
        }else {
            console.log("erro");
        }
    }).catch(error => console.log(error))
}

async function puxarHorariosComQuantidadeAlertas() {
    try {
        const response = await fetch(`/dados/puxarHorariosComQuantidadeAlertas/${sessionStorage.getItem("ID_EMPRESA")}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else console.error("Erro na requisição:", response.statusText);
        
    } catch (error) {
        console.error(error);
    }
}

function puxarMaquinas(){
    const select = document.querySelector(".selectBox select")
    fetch(`/dados/puxarMaquinas/${sessionStorage.getItem("ID_EMPRESA")}`)
    .then(response => {
        if(response.ok){
            response.json().then(resposta => {
                for(item of resposta){
                    let option = document.createElement("option");
                    option.setAttribute("value", item.id);
                    option.textContent = "Máquina " + item.id;
                    select.appendChild(option);
                }
                if (!sessionStorage.getItem("ID_MAQUINA")) {
                    sessionStorage.setItem("ID_MAQUINA", document.querySelector(".selectBox select").value)
                }
            });
        }else{
            console.log("error")
        }
    }).catch(error => console.log(error))
}

async function puxarDadosMaquina(){
    try{
        const response = await fetch(`/dados/puxarDadosMaquina/${sessionStorage.getItem("ID_MAQUINA")}`);
        if(response.ok){
            const data = await response.json();
            return data.reverse();
        } else console.error("Erro na requisição:", response.statusText);
    } catch (error){
        console.error(error)
    }
}

async function puxarIndicadores(){
    try{
        const response = await fetch(`/dados/puxarIndicadores/${sessionStorage.getItem("ID_MAQUINA")}`);
        if(response.ok){
            const data = await response.json();
            return data;
        } else console.error("Erro na requisição:", response.statusText);
    } catch (error){
        console.error(error)
    }
}

async function puxarDadoMaisRecente(){
    try{
        const response = await fetch(`/dados/puxarDadoMaisRecente/${sessionStorage.getItem("ID_MAQUINA")}`);
        if(response.ok){
            const data = await response.json();
            return data;
        } else console.error("Erro na requisição:", response.statusText);
    } catch (error){
        console.error(error)
    }
}

async function puxarDadoMaisRecenteTodasMaquinas(){
    try{
        const response = await fetch(`/dados/puxarDadoMaisRecenteTodasMaquinas/${sessionStorage.getItem("ID_EMPRESA")}`);
        if(response.ok){
            const data = await response.json();
            return data;
        } else console.error("Erro na requisição:", response.statusText);
    } catch (error){
        console.error(error)
    }
}

async function puxarDiasMesComQuantidadeAlertas(){
    try{
        const response = await fetch(`/dados/puxarDiasMesComQuantidadeAlertas/${sessionStorage.getItem("ID_EMPRESA")}`);
        if(response.ok){
            const data = await response.json();
            return data
        }else console.error("Erro na requisição:", response.statusText);
    } catch (error){
        console.error(error)
    }
}

async function puxarDiaSemanaMaisAlertas(){
    try{
        const response = await fetch(`/dados/puxarDiaSemanaComMaisAlertas/${sessionStorage.getItem("ID_EMPRESA")}`);
        if(response.ok){
            const data = await response.json();
            return data
        }else console.error("Erro na requisição: ", response.statusText);
    }catch (error){
        console.error(error)
    }
}

detectarPermissao()
puxarNomePermissao()