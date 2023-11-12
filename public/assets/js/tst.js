async function criarGraficoSuporte() {
    const disco = {
      html: document.getElementById("disco"),
      titulo: "Uso do disco",
      titulosEixos: { x: "Horário", y: "Percentual de uso" },
    };
    const memoria = {
      html: document.getElementById("memoria"),
      titulo: "Uso da memória",
      titulosEixos: { x: "Horário", y: "Percentual de uso" },
    };
    const usb = {
      html: document.getElementById("usb"),
      titulo: "Quantidade de entradas USB conectadas",
      titulosEixos: { x: "Horário", y: "Quantidade de USB conectados" },
    };
    const cpu = {
      html: document.getElementById("cpu"),
      titulo: "Uso do processador",
      titulosEixos: { x: "Horário", y: "Percentual de uso" },
    };
    const hardwares = [disco, memoria, usb, cpu];
    const graficos = []; // Array para armazenar as instâncias dos gráficos
  
    let dados = await puxarDadosMaquina();
    console.log(dados.map((json) => json.valorCPU));
    for (item of hardwares) {
      let tipoGrafico = item == usb ? "bar" : "line";
      let labels = dados.map((json) => json.dt_hora);
      let registro;
      switch (item) {
        case disco:
          registro = dados.map((json) => json.valorDisco);
          break;
        case memoria:
          registro = dados.map((json) => json.valorMemoriaRAM);
          break;
        case usb:
          registro = dados.map((json) => json["USB"]);
          break;
        case cpu:
          registro = dados.map((json) => json.valorCPU);
          break;
      }
      let data = {
        labels: labels,
        datasets: [
          {
            label: "Teste",
            data: registro,
          },
        ],
      };
  
      // Cria o gráfico e armazena a instância no array
      const grafico = new Chart(item.html, {
        type: tipoGrafico,
        data: data,
        options: {
          scales: {
            x: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Horários",
              },
            },
            y: {
              beginAtZero: true,
              max: item != usb ? 100 : null,
              title: {
                display: true,
                text: "Quantidade de alertas críticos por hora",
              },
              ticks: {
                stepSize: item == usb ? 1 : 10,
              },
            },
          },
        },
      });
  
      graficos.push(grafico); // Armazena a instância no array
    }
    
    // Função para atualizar os gráficos
    function atualizarGraficos() {
      for (const grafico of graficos) {
        grafico.data.datasets[0].data = [1,1, 3, 10, 90, 9, 2];
        grafico.update(); // Atualiza cada gráfico
        console.log("grafico atualizado!")
      }
    }
  
    // Atualiza os gráficos a cada segundo
    setInterval(atualizarGraficos(), 1000);
}
  

// ORIGINAL!!!
async function criarGraficoSuporte() {
    const disco = {
      html: document.getElementById("disco"),
      titulo: "Uso do disco",
      titulosEixos: {x: "Horário", y: "Percentual de uso"}
    };
    const memoria = {
      html: document.getElementById("memoria"),
      titulo: "Uso da memória",
      titulosEixos: {x: "Horário", y: "Percentual de uso"}
    };
    const usb = {
      html: document.getElementById("usb"),
      titulo: "Quantidade de entradas USB conectadas",
      titulosEixos: {x: "Horário", y: "Quantidade de USB conectados"}
    };
    const cpu = {
      html: document.getElementById("cpu"),
      titulo: "Uso do processador",
      titulosEixos: {x: "Horário", y: "Percentual de uso"}
    };
    const hardwares = [disco, memoria, usb, cpu];
    let graficos = [];
  
    let dados = await puxarDadosMaquina();
    console.log(dados.map(json => json.valorCPU))
    for(item of hardwares){
      let tipoGrafico = item == usb ? 'bar' : 'line';
      let labels = dados.map(json => json.dt_hora);
      let registro;
      switch(item){
        case disco:
          registro = dados.map(json => json.valorDisco);
          break;
        case memoria:
          registro = dados.map(json => json.valorMemoriaRAM);
          break
        case usb:
          registro = dados.map(json => json["USB"]);
          break
        case cpu:
          registro = dados.map(json => json.valorCPU);
          break 
      }    
      let data = {
        labels: labels,
        datasets: [{
          label: "Teste",
          data: registro
        }]
      }
  
      let grafico = new Chart(item.html, {
        type: tipoGrafico,
        data: data,
        options: {
          scales: {
            x: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Horários"
              }
            },
            y: {
              beginAtZero: true,
              max: item != usb ? 100 : null,
              title: {
                display: true,
                text: "Quantidade de alertas críticos por hora"
              },
              ticks: {
                stepSize: item == usb ? 1 : 10
              }
            }
          }
        }
      });
  
      graficos.push(grafico);
    }
    
    const qtdAlertas = {
      html: document.getElementById("qtd-horas"),
      titulo: "Quantidade de horas de uso do aparelho",
      titulosEixos: {x: "Dias do mês", y: "Quantidade de alertas críticos"}
    };
  }