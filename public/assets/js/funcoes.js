function criarGraficoFuncionario(){
  const horariosPico = {
    html: document.getElementById("horarios-pico"),
    titulo: "Máquinas com problema",
    label: []
  }

  const data = {
    datasets: 
    [{
      label: "Máquina 1",
      data: [{
        x: 0,
        y: 0
      },
      {
        x: 0,
        y: 10
      }]
    },
    {
      label: "Máquina 2",
      data: [{
        x: 1,
        y: 0
      },
      {
        x: 1,
        y: 10
      }]
    }
    ]
  }

  new Chart(horariosPico.html, {
    type: "scatter",
    data: data 
  });

}

function criarGraficoSuporte() {
  const disco = {
    html: document.getElementById("disco"),
    titulo: "Uso do disco",
    label: [formatData("horaminuto"), formatData("horaminuto"), formatData("horaminuto"), formatData("horaminuto"), formatData("horaminuto"), formatData("horaminuto")],
  };
  const memoria = {
    html: document.getElementById("memoria"),
    titulo: "Uso da memória",
    label: [formatData("horaminuto"), formatData("horaminuto"), formatData("horaminuto"), formatData("horaminuto"), formatData("horaminuto"), formatData("horaminuto")],
  };
  const usb = {
    html: document.getElementById("usb"),
    titulo: "Estado da entrada USB",
    label: [formatData("horaminuto"), formatData("horaminuto"), formatData("horaminuto"), formatData("horaminuto"), formatData("horaminuto"), formatData("horaminuto")],
  };
  const cpu = {
    html: document.getElementById("cpu"),
    titulo: "Uso do processador",
    label: [formatData("horaminuto"), formatData("horaminuto"), formatData("horaminuto"), formatData("horaminuto"), formatData("horaminuto"), formatData("horaminuto")],
  };
  const qtdHoras = {
    html: document.getElementById("qtd-horas"),
    titulo: "Quantidade de horas de uso do aparelho",
    label: [formatData("horaminuto"), formatData("horaminuto"), formatData("horaminuto"), formatData("horaminuto"), formatData("horaminuto"), formatData("horaminuto")],
  };
  const statusTotem = {
    html: document.getElementById("status-totem"),
    titulo: "Status do totem",
    label: [formatData("horaminuto"), formatData("horaminuto"), formatData("horaminuto"), formatData("horaminuto"), formatData("horaminuto"), formatData("horaminuto")],
  };
  const horariosUso = {
    html: document.getElementById("horarios-uso"),
    titulo: "Horários de maior requisição de recurso",
    label: [formatData(), formatData(), formatData(), formatData(), formatData(), formatData()],
  };

  const graficos = [
    disco,
    memoria,
    usb,
    cpu,
    qtdHoras,
    statusTotem,
    horariosUso,
  ];

  for (var grafico of graficos) {
    new Chart(grafico.html, {
      type: "bar",
      data: {
        labels: grafico.label,
        datasets: [
          {
            label: grafico.titulo,
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}

function formatData(parametro="datahora"){
  const dataAtual = new Date();
  let opcoes;
  switch(parametro){
    case "datahora":
      opcoes = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
      break;
      case "horaminuto":
      opcoes = {hour: "2-digit", minute: "2-digit"}
      break;
  }
  const dataFormatada = dataAtual.toLocaleString('pt-BR', opcoes);
  return dataFormatada;
}

function validators(campo, tipoValidacao){
  var mensagemErro = document.createElement('h6');
  switch(tipoValidacao){
    case "required":
      if(campo.length > 0){

        return true;
      }else{
        if(campo.html.parentNode.childNodes.length <= 5){ //childNodes por padrão começa com 5, não sei pq
          mensagemErro.className = "erro";
          mensagemErro.textContent = "Campo vázio!!";
          campo.html.parentNode.appendChild(mensagemErro);  
        }
        return false;
      }
    case "email":
      return campo.valor.indexOf("@") != -1;   
  }
}