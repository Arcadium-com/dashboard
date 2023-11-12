async function criarGraficoFuncionario(){
  const horariosPico = {
    html: document.getElementById("horarios-pico"),
    titulo: "Máquinas com problema",
  }
  const quantidadeAlertas = await puxarHorariosComQuantidadeAlertas();

  const data = {
    labels: quantidadeAlertas.map(json => json.hora),
    datasets: [{
      label: "Quantidade de alertas críticos",
      data: quantidadeAlertas.map(json => json.quantidade_problemas)
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
            text: "Quantidade de alertas críticos por hora"
          },
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}
