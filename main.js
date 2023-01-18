import datapoints from "./fuelPrices.js";

const switchButton = document.getElementById("switchButton");

const forecastScreen = document.getElementById("forecastContainer");

const historicalScreen = document.getElementById("myChartContainer");

const forecastText = "Switch to Forecast Mode";

const historicalText = "Switch to Historical Mode";

function updateChart(datapoints, chart) {
  const fuelOne = datapoints.map(function (index) {
    return index["Solid fuels"];
  });

  const fuelTwo = datapoints.map(function (index) {
    return index["Gas "];
  });

  const fuelThree = datapoints.map(function (index) {
    return index["Electricity "];
  });

  const fuelFour = datapoints.map(function (index) {
    return index["Liquid fuels"];
  });

  const labels = datapoints.map((index) => {
    return `${index.Month} ${index.Year}`;
  });

  chart.config.data.labels = labels;
  chart.config.data.datasets[0].data = fuelOne;
  chart.config.data.datasets[1].data = fuelTwo;
  chart.config.data.datasets[2].data = fuelThree;
  chart.config.data.datasets[3].data = fuelFour;
  chart.update();
}

function getHighestPrice(datapoints, key) {
  return Math.max(
    ...datapoints.map((point) => {
      return point[key];
    })
  );
}

function getLowestPrice(datapoints, key) {
  return Math.min(
    ...datapoints.map((point) => {
      return point[key];
    })
  );
}

function getYearIncrease(highest, lowest) {
  return lowest / highest;
}

function getLastSetData(datapoints, duration) {
  return datapoints.filter((element, index) => {
    return index >= datapoints.length - duration;
  });
}

function forecast(datapoints) {
  return getLastSetData(datapoints, 12).map((datapoint) => {
    return {
      ...datapoint,
      "Solid fuels":
        datapoint["Solid fuels"] *
        (1 +
          getYearIncrease(
            getHighestPrice(datapoints, "Solid fuels"),
            getLowestPrice(datapoints, "Solid fuels")
          )),
      "Gas ":
        datapoint["Gas "] *
        (1 +
          getYearIncrease(
            getHighestPrice(datapoints, "Gas "),
            getLowestPrice(datapoints, "Gas ")
          )),
      "Electricity ":
        datapoint["Electricity "] *
        (1 +
          getYearIncrease(
            getHighestPrice(datapoints, "Electricity "),
            getLowestPrice(datapoints, "Electricity ")
          )),
      "Liquid fuels":
        datapoint["Liquid fuels"] *
        (1 +
          getYearIncrease(
            getHighestPrice(datapoints, "Liquid fuels"),
            getLowestPrice(datapoints, "Liquid fuels")
          )),
      Year: datapoint["Year"] + 1,
    };
  });
}

const data = {
  labels: [],
  datasets: [
    {
      label: "Solid Fuels",
      data: [],
      borderColor: "rgba(255, 26, 104, 1)",
      backgroundColor: "rgba(255, 26, 104, 0.2)",
    },
    {
      label: "Gas",
      data: [],
      borderColor: "rgba(rgba(54, 162, 235, 1)",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
    },
    {
      label: "Electricity",
      data: [],
      borderColor: "rgba(255, 206, 86, 1)",
      backgroundColor: "rgba(255, 206, 86, 0.2)",
    },
    {
      label: "Liquid Fuels",
      data: [],
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
    },
  ],
};

//forecast data

const forecastData = {
  labels: [],
  datasets: [
    {
      label: "Solid Fuels",
      data: [],
      borderColor: "rgba(255, 26, 104, 1)",
      backgroundColor: "rgba(255, 26, 104, 0.2)",
    },
    {
      label: "Gas",
      data: [],
      borderColor: "rgba(rgba(54, 162, 235, 1)",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
    },
    {
      label: "Electricity",
      data: [],
      borderColor: "rgba(255, 206, 86, 1)",
      backgroundColor: "rgba(255, 206, 86, 0.2)",
    },
    {
      label: "Liquid Fuels",
      data: [],
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
    },
  ],
};

// config

const config = {
  type: "line",
  data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Heating Fuel Costs in the UK",
      },
    },
    scales: {
      x: {
        // show only 12 months
        min: datapoints.length - 12,
        max: datapoints.length,
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Fuel Prices in Pounds (£)",
        },
      },
    },
  },
};

//forecasr config

const forecastConfig = {
  type: "line",
  data: forecastData,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Heating Fuel Costs in the UK",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Fuel Prices in Pounds (£)",
        },
      },
    },
  },
};

// render init block
const myChart = new Chart(document.getElementById("myChart"), config);
const forecastChart = new Chart(
  document.getElementById("forecastChart"),
  forecastConfig
);

// creating previous & next buttons
function nextPage(start, end) {
  let startScale = myChart.config.options.scales.x.min + start;
  let endScale = myChart.config.options.scales.x.max + end;

  let alertText = "";
  if (endScale > datapoints.length) {
    endScale = datapoints.length;
    startScale = endScale - 12;
    alertText = "Data not available beyond this point, See Forecast Mode!";
  }

  if (startScale < 0) {
    endScale = 11;
    startScale = 0;
    alertText = "Data not available beyond this point!";
  }

  myChart.config.options.scales.x.min = startScale;
  myChart.config.options.scales.x.max = endScale;

  myChart.update();

  if (alertText.length > 0) {
    alert(alertText);
  }
}

//Switch innertext of button and change screen

function switchContext() {
  if (forecastScreen.classList.contains("display-none")) {
    switchButton.innerHTML = historicalText;
    forecastScreen.classList.remove("display-none");
    historicalScreen.classList.add("display-none");
  } else {
    switchButton.innerHTML = forecastText;
    forecastScreen.classList.add("display-none");
    historicalScreen.classList.remove("display-none");
  }
}

switchButton.addEventListener("click", function () {
  switchContext();
});

document.getElementById("prevBtn").addEventListener("click", function () {
  nextPage(-12, -12);
});

document.getElementById("nextBtn").addEventListener("click", function () {
  nextPage(12, 12);
});

updateChart(datapoints, myChart);
updateChart(forecast(datapoints), forecastChart);
