const outerContainer = document.querySelector(".outercontainer");
const updateDate = document.querySelector(".updatedate");
const confirmedText = document.querySelector(".confirmedtext");
const recoveredText = document.querySelector(".recoveredtext");
const activeText = document.querySelector(".activetext");
const deceasedText = document.querySelector(".deceasedtext");

//new cases
const newRecovered = document.querySelector(".newrecovered");
const newActive = document.querySelector(".newactive");
const newDeceased = document.querySelector(".newdeceased");

//statewise
const stateDetails = document.querySelector(".statedetails");
//newcases

const preLoader = document.querySelector(".preloader");
window.onload = function () {
  setTimeout(function () {
    preLoader.style.display = "none";
    outerContainer.style.display = "block";
  }, 1000);
};

function positiveOrNot(caseData) {
  let createdIcon = document.createElement("i");
  if (caseData.includes("-")) {
    createdIcon.classList.add("fas", "fa-arrow-down", "ml-2");
  } else {
    createdIcon.classList.add("fas", "fa-arrow-up", "ml-2");
  }
  return createdIcon;
}

fetch(
  "https://api.apify.com/v2/key-value-stores/toDWvRj1JpTXiM8FF/records/LATEST?disableRedirect=true",
  {}
)
  .then((res) => res.json())
  .then((data) => {
    //Currentcases
    updateDate.textContent = data.lastUpdatedAtApify.split("T")[0];
    confirmedText.textContent = data.totalCases;
    recoveredText.textContent = data.recovered;
    activeText.textContent = data.activeCases;
    deceasedText.textContent = data.deaths;

    //Newcases
    newRecovered.textContent = data.recoveredNew;
    newRecovered.append(positiveOrNot(data.recoveredNew.toString()));
    if (data.recoveredNew.toString().includes("-")) {
      newRecovered.classList.add("negative");
    } else {
      newRecovered.classList.add("positive");
    }
    newActive.textContent = data.activeCasesNew;
    newActive.append(positiveOrNot(data.activeCasesNew.toString()));
    if (data.activeCasesNew.toString().includes("-")) {
      newActive.classList.add("positive");
    } else {
      newRecovered.classList.add("negative");
    }
    newDeceased.textContent = data.deathsNew;
    newDeceased.append(positiveOrNot(data.deathsNew.toString()));
    if (data.deathsNew.toString().includes("-")) {
      newDeceased.classList.add("positive");
    } else {
      newDeceased.classList.add("negative");
    }

    //state wise
    data.regionData.forEach((stateUT) => {
      let stateName = document.createElement("td");
      let stateConfirmed = document.createElement("td");
      let stateRecovered = document.createElement("td");
      let stateActive = document.createElement("td");
      let stateDeceased = document.createElement("td");
      let newlyInfected = document.createElement("span");
      let newlyRecovered = document.createElement("span");
      let newlyDeceased = document.createElement("span");
      let newRow = document.createElement("tr");

      stateName.textContent = stateUT.region;
      stateConfirmed.innerHTML = `<b>${stateUT.totalInfected}</b>`;
      stateRecovered.innerHTML = `<b>${stateUT.recovered}</b>`;
      stateActive.innerHTML = `<b>${stateUT.activeCases}</b>`;
      stateDeceased.innerHTML = `<b>${stateUT.deceased}</b>`;
      newlyInfected.textContent = stateUT.newInfected;
      newlyRecovered.textContent = stateUT.newRecovered;
      newlyDeceased.textContent = stateUT.newDeceased;

      if (stateUT.newInfected.toString().includes("-")) {
        newlyInfected.classList.add("positivetable");
      } else {
        newlyInfected.classList.add("negativetable");
      }
      newlyInfected.append(positiveOrNot(stateUT.newInfected.toString()));

      newlyRecovered.classList.add("positivetable");
      newlyRecovered.append(positiveOrNot(stateUT.newRecovered.toString()));
      newlyDeceased.classList.add("negativetable");
      newlyDeceased.append(positiveOrNot(stateUT.newDeceased.toString()));

      stateRecovered.append(newlyRecovered);
      stateActive.append(newlyInfected);
      stateDeceased.append(newlyDeceased);

      newRow.append(
        stateName,
        stateConfirmed,
        stateRecovered,
        stateActive,
        stateDeceased
      );
      stateDetails.append(newRow);
    });
  });

//chart

var confirmedChartCanvas = document
  .getElementById("confirmedchart")
  .getContext("2d");
var confirmedChart = new Chart(confirmedChartCanvas, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Confirmed cases",
        data: [],
        backgroundColor: ["#cd113b"],
        borderColor: ["#454787"],
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

var recoveredChartCanvas = document
  .getElementById("recoveredchart")
  .getContext("2d");
var recoveredChart = new Chart(recoveredChartCanvas, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Recovered cases",
        data: [],
        backgroundColor: ["#66DE93"],
        borderColor: ["#454787"],
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

var activeChartCanvas = document.getElementById("activechart").getContext("2d");
var activeChart = new Chart(activeChartCanvas, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Active cases",
        data: [],
        backgroundColor: ["#185adb"],
        borderColor: ["#454787"],
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

var deceasedChartCanvas = document
  .getElementById("deceasedchart")
  .getContext("2d");
var deceasedChart = new Chart(deceasedChartCanvas, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Deceased cases",
        data: [],
        backgroundColor: ["#171717"],
        borderColor: ["#454787"],
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

fetch("https://api.covid19india.org/data.json", {})
  .then((res) => res.json())
  .then((data) => {
    let pastMonth = data.cases_time_series.length - 30;
    for (let i = pastMonth; i < data.cases_time_series.length; i++) {
      confirmedChart.data.labels.push(data.cases_time_series[i].date);
      confirmedChart.data.datasets[0].data.push(
        data.cases_time_series[i].dailyconfirmed
      );

      recoveredChart.data.labels.push(data.cases_time_series[i].date);
      recoveredChart.data.datasets[0].data.push(
        data.cases_time_series[i].dailyrecovered
      );

      activeChart.data.labels.push(data.cases_time_series[i].date);
      let active =
        parseInt(data.cases_time_series[i].totalconfirmed) -
        (parseInt(data.cases_time_series[i].totalrecovered) +
          parseInt(data.cases_time_series[i].totaldeceased));
      activeChart.data.datasets[0].data.push(active);

      deceasedChart.data.labels.push(data.cases_time_series[i].date);
      deceasedChart.data.datasets[0].data.push(
        data.cases_time_series[i].dailydeceased
      );

      confirmedChart.update();
      recoveredChart.update();
      activeChart.update();
      deceasedChart.update();
    }
  });
