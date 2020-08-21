// Selecting ids
function selectIds(idName) {
  idName = document.getElementById(idName);
  return idName;
}

const errorContainer = selectIds("error");

// Display errors
function displayError(error) {
  if (error == "TypeError: Cannot read property 'id' of undefined") {
    errorContainer.innerHTML = `
    <div class="alert alert-danger text-dark alert-dismissible fade show" role="alert">
      Sorry! The district that you searched couldn't be found.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    `;
  } else {
    errorContainer.innerHTML = `
    <div class="alert alert-danger text-dark alert-dismissible fade show" role="alert">
      Sorry! Something went wrong.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    `;
  }
  preLoaderSearch.style.visibility = "hidden";
}

const preLoader = selectIds("preloader");
const preLoaderSearch = selectIds("preloader1");
document.addEventListener("DOMContentLoaded", () => {
  console.log("ready");
  preLoader.style.visibility = "hidden";
});

const nameDetails = selectIds("name-details");
// Date time show
const body = document.querySelector("body");
const dateShow = document.querySelector("#date-show");

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];

// Request option for fetching
let requestOptions = {
  method: "GET",
  redirect: "follow",
};

// Adding commas for better readability
function appendCommas(val) {
  string = val.toString();
  let strLen = string.length;
  let required = "";
  if (strLen > 3) {
    required = string[strLen - 3] + string[strLen - 2] + string[strLen - 1];
    for (let i = strLen - 4; i >= 0; i--) {
      if (strLen % 2 === 0) {
        if (i % 2 === 0) {
          required = string[i] + "," + required;
        } else {
          required = string[i] + required;
        }
      } else {
        let compare = i + 1;
        if (compare % 2 === 0) {
          required = string[i] + "," + required;
        } else {
          required = string[i] + required;
        }
      }
    }
  } else {
    required = string;
  }
  return required;
}

// console.log(appendCommas("47124"));

// Showing date and time
function dateAndTime() {
  const todayDate = new Date();
  let dateObj = {
    date: todayDate.getDate(),
    month: months[todayDate.getMonth()],
    year: todayDate.getFullYear(),
    localTime: todayDate.toLocaleTimeString(),
  };
  dateShow.textContent = `${dateObj.date} ${dateObj.month} ${dateObj.year} | ${dateObj.localTime}`;
}

setInterval(dateAndTime, 1000);

const casesSummary = {
  recoveredNepal: selectIds("recovered-nepal"),
  deathNepal: selectIds("death-nepal"),
  activeNepal: selectIds("active-nepal"),
  totalCasesNepal: selectIds("total-cases-nepal"),
};

const casesSummaryWorld = {
  recoveredWorld: selectIds("recovered-world"),
  deathWorld: selectIds("death-world"),
  activeWorld: selectIds("active-world"),
  totalCasesWorld: selectIds("total-cases-world"),
};

// Display World tracking Details
function displayWorldDetails(result) {
  casesSummaryWorld.recoveredWorld.textContent = appendCommas(result.recovered);
  casesSummaryWorld.deathWorld.textContent = appendCommas(result.deaths);
  casesSummaryWorld.activeWorld.textContent = appendCommas(result.active);
  casesSummaryWorld.totalCasesWorld.textContent = appendCommas(result.cases);
}

// Fetching world details
fetch("https://data.nepalcorona.info/api/v1/world", requestOptions)
  .then((response) => response.json())
  .then((result) => displayWorldDetails(result))
  .catch((error) => displayError(error));

// console.log(casesSummary);

// Displaying cases summary
function displaySummaryResult(result) {
  casesSummary.recoveredNepal.textContent = appendCommas(
    result.current_state[2].count
  );
  casesSummary.deathNepal.textContent = appendCommas(
    result.current_state[0].count
  );
  casesSummary.activeNepal.textContent = appendCommas(
    result.current_state[1].count
  );
  casesSummary.totalCasesNepal.textContent = appendCommas(result.total);
  // nameDetails.textContent = "Nepal";
  // console.log(result);

  // Bar Graph
  // Data for graph:
  let graphData = [];
  let graphLabels = [];
  result.province.active.forEach((data) => graphData.push(data.count));
  result.province.active.forEach((data) =>
    graphLabels.push(`Province: ${data.province}`)
  );

  new Chart(document.getElementById("horizontalBar"), {
    type: "horizontalBar",
    data: {
      labels: graphLabels,
      datasets: [
        {
          label: "No. of Active Cases",
          data: graphData,
          fill: true,
          backgroundColor: [
            "rgba(255, 99, 132)",
            "rgba(255, 159, 64)",
            "rgba(255, 205, 86)",
            "rgba(75, 192, 192)",
            "rgba(54, 162, 235)",
            "rgba(153, 102, 255)",
            "rgba(221, 203, 207)",
          ],
          borderColor: [
            "rgb(255, 99, 132)",
            "rgb(255, 159, 64)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(54, 162, 235)",
            "rgb(153, 102, 255)",
            "rgb(221, 203, 207)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
}

// Fetching Cases Summary
fetch("https://data.nepalcorona.info/api/v1/covid/summary", requestOptions)
  .then((response) => response.json())
  .then((result) => displaySummaryResult(result))
  .catch((error) => displayError(error));

// Displaying Test Details

const testDetails = {
  testedNegative: selectIds("negative-nepal"),
  testedPositive: selectIds("positive-nepal"),
  totalTests: selectIds("total-tests-nepal"),
};

function displayTestDetails(result) {
  testDetails.testedNegative.textContent = appendCommas(result.tested_negative);
  testDetails.testedPositive.textContent = appendCommas(result.tested_positive);
  testDetails.totalTests.textContent = appendCommas(result.tested_total);

  // pie chart
  const ctxP = document.getElementById("labelChart").getContext("2d");
  const myPieChart = new Chart(ctxP, {
    plugins: [ChartDataLabels],
    type: "pie",
    data: {
      labels: ["Negative", "Positive"],
      datasets: [
        {
          data: [result.tested_negative, result.tested_positive],
          backgroundColor: ["#00C851", "#ff4444"],
          hoverBackgroundColor: ["#007E33", "#CC0000"],
        },
      ],
    },
    options: {
      responsive: true,
      legend: {
        position: "right",
        labels: {
          padding: 20,
          boxWidth: 10,
        },
      },
      plugins: {
        datalabels: {
          formatter: (value, ctx) => {
            let sum = 0;
            let dataArr = ctx.chart.data.datasets[0].data;
            dataArr.map((data) => {
              sum += data;
            });
            let percentage = ((value * 100) / sum).toFixed(2) + "%";
            return percentage;
          },
          color: "white",
          labels: {
            title: {
              font: {
                size: "16",
              },
            },
          },
        },
      },
    },
  });
}
// Fetching tests details

fetch("https://nepalcorona.info/api/v1/data/nepal", requestOptions)
  .then((response) => response.json())
  .then((result) => displayTestDetails(result))
  .catch((error) => displayError(error));

// Drawing line graph:
function drawLineGraph(result) {
  const xLabels = [];
  result.forEach((data) => {
    xLabels.push(data.date);
  });

  const totalCases = [];
  result.forEach((data) => {
    totalCases.push(data.totalCases);
  });

  //line
  total = document.getElementById("lineChart1").getContext("2d");
  myLineChart = new Chart(total, {
    type: "line",
    data: {
      labels: xLabels,
      datasets: [
        {
          label: "Total Cases",
          data: totalCases,
          backgroundColor: ["rgba(223, 6, 6, 0.2)"],
          borderColor: ["rgba(223, 6, 6)"],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
}

// Fetching Cases Time line for line graph

fetch("https://data.nepalcorona.info/api/v1/covid/timeline", requestOptions)
  .then((response) => response.json())
  .then((result) => drawLineGraph(result))
  .catch((error) => displayError(error));

// Covid news
function displayNews(result) {
  const covidNews = document.querySelector("#covid-news");
  let countNews = 0;
  while (countNews < 15) {
    let articleFrame = document.createElement("article");
    articleFrame.className = "row my-2 covid-news";
    covidNews.appendChild(articleFrame);
    articleFrame.innerHTML = `
        <div class="article-image col-12 col-md-4 m-md-0">
        <a href="${result.data[countNews].url}"  target="_blank"><img src="${
      result.data[countNews].image_url
    }"
            alt="Article image" class="" height="" /></a>
            <div class="news-date"><p class="text-sm-center text-primary">${result.data[
              countNews
            ].updated_at.slice(0, 10)}</p></div>
        </div>
        <div class="article-details py-2 py-md-0 d-flex flex-column col-12 col-md-8">
          <div class="article-title">
            <h4>
              <a href="${result.data[countNews].url}" target="_blank">${
      result.data[countNews].title
    }</a>
            </h4><span><p>${result.data[countNews].summary.slice(
              0,
              100
            )} <a href=${
      result.data[countNews].url
    } target="_blank">Read more<i class="fa fa-angle-double-right"></i></a></p></span>
          </div>
        </div>
    `;
    countNews++;
  }
}

// Fetching news

fetch("https://nepalcorona.info/api/v1/news", requestOptions)
  .then((response) => response.json())
  .then((result) => displayNews(result))
  .catch((error) => displayError(error));

// Covid Myths
// Display myths

function displayMyths(result) {
  const mythCards = document.querySelector(".myth-cards");
  // console.log(result);
  let countCard = 0;
  while (countCard < 3) {
    let newCard = document.createElement("article");
    newCard.className = "card";
    mythCards.appendChild(newCard);
    newCard.innerHTML = `
      <div class="view overlay">
        <img class="card-img-top" src="${result.data[countCard].image_url}"
          alt="Card image cap" />
      </div>
    `;
    countCard++;
  }
}

// Fetching myths

fetch("https://nepalcorona.info/api/v1/myths", requestOptions)
  .then((response) => response.json())
  .then((result) => displayMyths(result))
  .catch((error) => displayError(error));

// Covid Table

// Fetching district details
function displayTable(districtList) {
  const covidTable = document.getElementById("covid-table");
  districtList.forEach((district) => {
    const tableRow = document.createElement("tr");
    covidTable.appendChild(tableRow);
    tableRow.idName = `district ${district.id}`;

    // Fetching district details
    fetch(
      `https://data.nepalcorona.info/api/v1/districts/${district.id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then(
        (result) =>
          (tableRow.innerHTML = `
        <td>${district.title}</td>
        <td class="bg-primary text-white">${result.covid_summary.cases}</td>
        <td>${result.covid_summary.active}</td>
        <td class="bg-success text-white">${result.covid_summary.recovered}</td>
        <td class="bg-danger text-white">${result.covid_summary.death}</td>
        
      `)
      )
      .catch((error) => displayError(error));
  });
}

fetch("https://data.nepalcorona.info/api/v1/districts", requestOptions)
  .then((response) => response.json())
  .then((result) => displayTable(result))
  .catch((error) => displayError(error));

// Search District Features
const searchBoxText = selectIds("district-name");
const searchBtn = selectIds("search-btn");

// Display required district details
function displayDistrictResult(result) {
  // console.log(result);
  casesSummary.recoveredNepal.textContent = result.covid_summary.recovered;
  casesSummary.deathNepal.textContent = result.covid_summary.death;
  casesSummary.activeNepal.textContent = result.covid_summary.active;
  casesSummary.totalCasesNepal.textContent = result.covid_summary.cases;
  nameDetails.textContent = `${result.title}`;
  preLoaderSearch.style.visibility = "hidden";
}

function searchDistrict(districtName) {
  // console.log(districtName);
  fetch(
    `https://data.nepalcorona.info/api/v1/districts?search=${districtName}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) =>
      // fetching the details from the id
      fetch(
        `https://data.nepalcorona.info/api/v1/districts/${result[0].id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => displayDistrictResult(result))
        .catch((error) => displayError(error))
    )
    .catch((error) => displayError(error));
}

function searchDistrictClick() {
  const districtName = searchBoxText.value;
  if (!districtName) return;
  searchDistrict(districtName);
}

function triggeringSearch(event) {
  if (event.keyCode == 13) {
    const districtName = searchBoxText.value;
    if (!districtName) return;
    preLoaderSearch.style.visibility = "visible";
    searchDistrict(districtName);
  }
}
searchBtn.addEventListener("click", searchDistrictClick);

searchBoxText.addEventListener("keyup", triggeringSearch);
