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
        console.log('oi')
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
    fetch("/dados/puxarStatusTotens")
    .then(response => {
        console.log(response)
        if(response.ok){
            response.json().then(resposta => {
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
    fetch("/dados/puxarTotensForaServico")
    .then(response => {
        if(response.ok){
            response.json().then(response => {
                if(response[0].totalFora <= 1){
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

detectarPermissao()
puxarNomePermissao()