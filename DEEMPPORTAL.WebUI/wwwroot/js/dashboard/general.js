const gBaseUrl = '/erp/general'

let gChartLabel = []
let gChartData = []
let gTotalCount = 0

$(function () {
  getTotalEmployeeCount(() => {
    displayChart()
  })
})

function displayChart() {
  Chart.register(ChartDataLabels);
  const ctx = document.getElementById('myChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: gChartLabel,
      datasets: [{
        label: `Dahbashi Engineering`,
        data: gChartData,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      indexAxis: 'y',
      scales: {
        y: {
          beginAtZero: true
        },
      },
      plugins: {
        colors: { forceOverride: true },
        title: {
          display: true,
          text: `Total Employee in DE Group ${gTotalCount}`
        },
        legend: { display: false },
        datalabels: {
          color: '#000', // white for contrast
          align: 'center', // center within bar
          anchor: 'center', // center alignment
          clamp: true,
          font: {
            weight: 'bold'
          },
          formatter: function (value) {
            return value; // you can customize format here
          }
        }
      }
    }
  });
}

async function getTotalEmployeeCount(callback) {
  try {
    const response = await fetch(`${gBaseUrl}/getTotalEmployeeByOrganization`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();

    return result.map(data => {
      gChartLabel.push(data.ORG_NAME);
      gChartData.push(data.TOTAL_COUNT);
      gTotalCount += parseInt(data.TOTAL_COUNT)
    });
  }
  catch (error) {
    console.error("Error fetching total employee count:", error);
    throw new Error("Something went wrong!" + error)
  }
  finally {
    if (callback) {
      callback();
    }
  }
}