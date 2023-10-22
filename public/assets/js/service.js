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

detectarPermissao()
puxarNomePermissao()