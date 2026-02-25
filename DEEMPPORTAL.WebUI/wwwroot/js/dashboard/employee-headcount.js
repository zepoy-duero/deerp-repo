const gBaseUrl = '/dashboard/employee-headcount'

let gChartLabel = []
let gChartData = []
let gTotalCount = 0

$(function () {
  getTotalListOfEmployeeByJobStatus(function () {
    getTotalEmployeeCount(function () {
      displayChart()
    })
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
          text: `Total Employee in DE Group ${gTotalCount}`,
          color: 'red',
          font: {
            size: 18,      // <-- change this to your desired size
            weight: 'bold' // optional (default is 'bold')
            // family: 'Arial', // optional
          }
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

async function getTotalListOfEmployeeByJobStatus(callback) {
  try {
    const response = await fetch(`${gBaseUrl}/getTotalEmployeeByJobStatus`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const totalCount = data.length

    let badges = ""

    for (let i = 0; i < totalCount; i++) {
      badges += `
        <span class="badge d-flex align-items-center p-1 pe-2 text-dark bg-info-subtle border border-info rounded-pill">
								<strong class="badge bg-danger me-1">${data[i].TOTAL_COUNT}</strong> ${data[i].JOB_STATUS}
							</span>
      `
    }

    $("#secTotalCountJobStatus").empty().append(badges);
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