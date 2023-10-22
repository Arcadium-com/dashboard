const horarioComercial = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
function criarGraficoFuncionario(){
  const horariosPico = {
    html: document.getElementById("horarios-pico"),
    titulo: "Máquinas com problema",
  }

  const data = {
    labels: horarioComercial,
    datasets: [{
      label: "Quantidade de problemas",
      data: [1, 3, 3,	4, 2, 3, 1, 2, 0, 3, 2, 2, 4, 3, 1, 2]
    }]
  }

  new Chart(horariosPico.html, {
    type: "line",
    data: data,
    options: {
      scales: {
        x: {
          beginAtZero: true,
          max: 23,
          title: {
            display: true,
            text: "Horários"
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Quantidade de problemas por hora"
          },
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });

}

function criarGraficoSuporte() {
  

  const disco = {
    html: document.getElementById("disco"),
    titulo: "Uso do disco",
    titulosEixos: {x: "Horário", y: "Percentual de uso"},
    mock1: [85, 72, 94, 60, 45, 78, 92, 88, 67, 70, 30, 50, 75, 63, 42, 55],
    mock2: [80, 68, 90, 79, 87, 58, 65, 98, 40, 73, 83, 95, 62, 77, 91, 54]
  };
  const memoria = {
    html: document.getElementById("memoria"),
    titulo: "Uso da memória",
    titulosEixos: {x: "Horário", y: "Percentual de uso"},
    mock1: [60, 72, 88, 50, 45, 78, 92, 68, 70, 75, 80, 90, 85, 63, 82, 55],
    mock2: [73, 78, 65, 79, 87, 58, 95, 98, 40, 73, 83, 95, 62, 77, 89, 57]
  };
  const usb = {
    html: document.getElementById("usb"),
    titulo: "Quantidade de entradas USB conectadas",
    titulosEixos: {x: "Horário", y: "Quantidade de USB conectados"},
    mock: [3, 4, 4, 3, 3, 4, 4, 4, 3, 4, 4, 4, 4, 3, 4, 4]
  };
  const cpu = {
    html: document.getElementById("cpu"),
    titulo: "Uso do processador",
    titulosEixos: {x: "Horário", y: "Percentual de uso"},
    mock1: [70, 62, 88, 45, 65, 58, 72, 68, 80, 55, 40, 50, 75, 53, 82, 45],
    mock2: [83, 78, 60, 69, 77, 58, 85, 98, 70, 73, 63, 85, 92, 87, 64, 76]
  };
  const qtdHoras = {
    html: document.getElementById("qtd-horas"),
    titulo: "Quantidade de horas de uso do aparelho",
    titulosEixos: {x: "Dias do mês", y: "Quantidade de problemas"},
    mock: [93, 28, 51, 17, 69, 88, 37, 42, 64, 79, 94, 22, 55, 87, 41, 99]
  };
  const statusTotem = {
    html: document.getElementById("status-totem"),
    titulo: "Status do totem",
    titulosEixos: {x: "Horário", y: "Percentual de uso"},
    mock: [93, 28, 51, 17, 69, 88, 37, 42, 64, 79, 94, 22, 55, 87, 41, 99]
  };
  const horariosUso = {
    html: document.getElementById("horarios-uso"),
    titulo: "Horários de maior requisição de recurso",
    titulosEixos: {x: "Horário", y: "Percentual de uso"},
    mock: [93, 28, 51, 17, 69, 88, 37, 42, 64, 79, 94, 22, 55, 87, 41, 99]
  };

  const graficosBarra = [
    usb,
    statusTotem,
    horariosUso,
  ];

  const graficosLinha = [
    disco,
    memoria,
    cpu
  ]

  const graficoSB = [
    qtdHoras
  ]

  for(var grafico of graficoSB){
    new Chart(grafico.html,
      {
        type: 'line',
        data: {
          labels: getQuantidadeDiasMes("array"),
          datasets: [
            {
              label: "CPU",
              data: gerarArrayMock(getQuantidadeDiasMes("int"))
            },
            {
              label: "RAM",
              data: gerarArrayMock(getQuantidadeDiasMes("int"))
            },
            {
              label: "Disco",
              data: gerarArrayMock(getQuantidadeDiasMes("int"))
            }
          ]
        },
        options: {
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              title: {
                display: true,
                text: grafico.titulosEixos.x
              },
              ticks: {
                stepSize: 1
              }
            },
            y: {
              title: {
                display: true,
                text: grafico.titulosEixos.y
              }
            }
          }
        }
      })
  }

  for(var grafico of graficosLinha){
    new Chart(grafico.html, {
      type: 'line',
      data: {
        labels: horarioComercial,
        datasets: [
          {
            label: "Máquina 1",
            data: grafico.mock1,  
          },
          {
            label: "Máquina 2",
            data: grafico.mock2,
          }
        ]
      },
      options: {
        scales: {
          x: {
            beginAtZero: true,
            max: 23,
            title: {
              display: true,
              text: grafico.titulosEixos.x
            }
          },
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: grafico.titulosEixos.y
            }
          }
        }
      }
    }) 
  }

  for (var grafico of graficosBarra) {
    new Chart(grafico.html, {
      type: 'bar',
      data: {
        labels: horarioComercial,
        datasets: [
          {
            label: grafico.titulo,
            data: grafico.mock
          }
        ]
      },
      options: {
        scales: {
          x: {
            beginAtZero: false,
            min: 8,
            max: 23,
            title: {
              display: true,
              text: grafico.titulosEixos.x
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: (grafico.titulo.indexOf("USB") != -1) ? 1 : 10,
              max:  (grafico.titulo.indexOf("USB") != -1) ? 4 : 100,
            },
            title: {
              display: true,
              text: grafico.titulosEixos.y
            }
          }
        }
      }
    });
  }
}

function getQuantidadeDiasMes(tipo){
  let date = new Date();
  let ano = date.getFullYear();
  let mes = date.getMonth() + 1;
  switch(tipo){
    case "int":
      return new Date(ano, mes, 0).getDate()
    case "array":
      var diasMes = [];
      for(let i = 1; i <= getQuantidadeDiasMes("int"); i++){
        diasMes.push(i);
      }
      return diasMes;
  }
}

function gerarArrayMock(quantidadeDias){
  let mock = [];
  let problemasIniciais = Math.floor(Math.random() * 7);
  for(let i = 1; i <= quantidadeDias; i++){
    let aumentaOuNao = Math.floor(Math.random() * 2);
    if(aumentaOuNao == 1){
      problemasIniciais++
    }
    mock.push(problemasIniciais)
  }
  return mock;
}