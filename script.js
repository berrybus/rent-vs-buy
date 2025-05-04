function getValidNumber(inputElement) {
  if (!(inputElement instanceof HTMLInputElement)) {
    return undefined;
  }

  const value = inputElement.value.trim();

  // Return undefined for empty input
  if (value === "") {
    return undefined;
  }

  // Remove commas and parse
  const num = Number(value.replace(/,/g, ""));

  const min = inputElement.min !== "" ? Number(inputElement.min) : -Infinity;
  const max = inputElement.max !== "" ? Number(inputElement.max) : Infinity;

  // Return the number ONLY if valid, otherwise undefined
  return !isNaN(num) && num >= min && num <= max ? num : undefined;
}

const downPaymentInput = document.getElementById("downPayment");
const homeCostInput = document.getElementById("homeCost");
const interestRateInput = document.getElementById("interestRate");
const mortgageYearsInput = document.getElementById("mortgageYears");
const downPaymentAmountElement = document.getElementById("downPaymentDollars");
const mortgageInput = document.getElementById("mortgage");
var mortgage;

function calculateDownPayment() {
  const downPayment = getValidNumber(downPaymentInput);
  const homeCost = getValidNumber(homeCostInput);

  if (downPayment != undefined && homeCost != undefined) {
    const downPaymentAmount = (downPayment / 100) * homeCost;
    console.log(downPaymentAmount);
    downPaymentAmountElement.textContent = `($${downPaymentAmount.toLocaleString(
      undefined,
      {},
    )})`;
  } else {
    downPaymentAmountElement.textContent = "";
  }
}

downPaymentInput.addEventListener("blur", calculateDownPayment);
homeCostInput.addEventListener("blur", calculateDownPayment);

calculateDownPayment();

function calculateMortgage() {
  var downPayment = getValidNumber(downPaymentInput);
  var homeCost = getValidNumber(homeCostInput);
  var interestRate = getValidNumber(interestRateInput);
  var mortgageYears = getValidNumber(mortgageYearsInput);

  if (
    downPayment == undefined ||
    homeCost == undefined ||
    interestRate == undefined ||
    mortgageYears == undefined ||
    interestRate == 0
  ) {
    return;
  }
  interestRate /= 100;
  if (downPayment >= 100) {
    mortgage = 0;
    mortgageInput.value = mortgage;
    return;
  }
  console.log("downPayment: " + downPayment);
  console.log("homeCost: " + homeCost);
  console.log("interestRate: " + interestRate);
  console.log("mortgageYears: " + mortgageYears);
  const downPaymentDollars = ((downPayment / 100) * homeCost).toFixed(2);
  const principle = homeCost - downPaymentDollars;
  const n = mortgageYears * 12;
  const monthly_interest = interestRate / 12;
  const numerator = monthly_interest * Math.pow(1 + monthly_interest, n);
  const denominator = Math.pow(1 + monthly_interest, n) - 1;
  mortgage = (principle * (numerator / denominator)).toFixed(2);
  mortgageInput.value = mortgage;
}

calculateMortgage();

downPaymentInput.addEventListener("blur", calculateMortgage);
homeCostInput.addEventListener("blur", calculateMortgage);
interestRateInput.addEventListener("blur", calculateMortgage);
mortgageYearsInput.addEventListener("blur", calculateMortgage);

document.querySelectorAll(".number-input").forEach((input) => {
  input.addEventListener("blur", (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value) {
      e.target.value = parseInt(value, 10).toLocaleString();
    }
  });
});

function createTable() {
  const rentData = [
    { year: 1, rentPaid: 12000, cumulative: 12000 },
    { year: 2, rentPaid: 12360, cumulative: 24360 },
    { year: 3, rentPaid: 12731, cumulative: 37091 },
    { year: 4, rentPaid: 13113, cumulative: 50204 },
    { year: 5, rentPaid: 13506, cumulative: 63710 },
    { year: 1, rentPaid: 12000, cumulative: 12000 },
    { year: 2, rentPaid: 12360, cumulative: 24360 },
    { year: 3, rentPaid: 12731, cumulative: 37091 },
    { year: 4, rentPaid: 13113, cumulative: 50204 },
    { year: 5, rentPaid: 13506, cumulative: 63710 },
    { year: 1, rentPaid: 12000, cumulative: 12000 },
    { year: 2, rentPaid: 12360, cumulative: 24360 },
    { year: 3, rentPaid: 12731, cumulative: 37091 },
    { year: 4, rentPaid: 13113, cumulative: 50204 },
    { year: 5, rentPaid: 13506, cumulative: 63710 },
    { year: 1, rentPaid: 12000, cumulative: 12000 },
    { year: 2, rentPaid: 12360, cumulative: 24360 },
    { year: 3, rentPaid: 12731, cumulative: 37091 },
    { year: 4, rentPaid: 13113, cumulative: 50204 },
    { year: 5, rentPaid: 13506, cumulative: 63710 },
    { year: 1, rentPaid: 12000, cumulative: 12000 },
    { year: 2, rentPaid: 12360, cumulative: 24360 },
    { year: 3, rentPaid: 12731, cumulative: 37091 },
    { year: 4, rentPaid: 13113, cumulative: 50204 },
    { year: 5, rentPaid: 13506, cumulative: 63710 },
    { year: 1, rentPaid: 12000, cumulative: 12000 },
    { year: 2, rentPaid: 12360, cumulative: 24360 },
    { year: 3, rentPaid: 12731, cumulative: 37091 },
    { year: 4, rentPaid: 13113, cumulative: 50204 },
    { year: 5, rentPaid: 13506, cumulative: 63710 },
    { year: 1, rentPaid: 12000, cumulative: 12000 },
    { year: 2, rentPaid: 12360, cumulative: 24360 },
    { year: 3, rentPaid: 12731, cumulative: 37091 },
    { year: 4, rentPaid: 13113, cumulative: 50204 },
    { year: 5, rentPaid: 13506, cumulative: 63710 },
    { year: 1, rentPaid: 12000, cumulative: 12000 },
    { year: 2, rentPaid: 12360, cumulative: 24360 },
    { year: 3, rentPaid: 12731, cumulative: 37091 },
    { year: 4, rentPaid: 13113, cumulative: 50204 },
    { year: 5, rentPaid: 13506, cumulative: 63710 },
  ];

  const buyData = [
    { year: 1, mortgage: 13000, equity: 10000 },
    { year: 2, mortgage: 13000, equity: 20500 },
    { year: 3, mortgage: 13000, equity: 31500 },
    { year: 4, mortgage: 13000, equity: 43000 },
    { year: 5, mortgage: 13000, equity: 55000 },
    { year: 1, mortgage: 13000, equity: 10000 },
    { year: 2, mortgage: 13000, equity: 20500 },
    { year: 3, mortgage: 13000, equity: 31500 },
    { year: 4, mortgage: 13000, equity: 43000 },
    { year: 5, mortgage: 13000, equity: 55000 },
    { year: 1, mortgage: 13000, equity: 10000 },
    { year: 2, mortgage: 13000, equity: 20500 },
    { year: 3, mortgage: 13000, equity: 31500 },
    { year: 4, mortgage: 13000, equity: 43000 },
    { year: 5, mortgage: 13000, equity: 55000 },
    { year: 1, mortgage: 13000, equity: 10000 },
    { year: 2, mortgage: 13000, equity: 20500 },
    { year: 3, mortgage: 13000, equity: 31500 },
    { year: 4, mortgage: 13000, equity: 43000 },
    { year: 5, mortgage: 13000, equity: 55000 },
    { year: 1, mortgage: 13000, equity: 10000 },
    { year: 2, mortgage: 13000, equity: 20500 },
    { year: 3, mortgage: 13000, equity: 31500 },
    { year: 4, mortgage: 13000, equity: 43000 },
    { year: 5, mortgage: 13000, equity: 55000 },
    { year: 1, mortgage: 13000, equity: 10000 },
    { year: 2, mortgage: 13000, equity: 20500 },
    { year: 3, mortgage: 13000, equity: 31500 },
    { year: 4, mortgage: 13000, equity: 43000 },
    { year: 5, mortgage: 13000, equity: 55000 },
    { year: 1, mortgage: 13000, equity: 10000 },
    { year: 2, mortgage: 13000, equity: 20500 },
    { year: 3, mortgage: 13000, equity: 31500 },
    { year: 4, mortgage: 13000, equity: 43000 },
    { year: 5, mortgage: 13000, equity: 55000 },
    { year: 1, mortgage: 13000, equity: 10000 },
    { year: 2, mortgage: 13000, equity: 20500 },
    { year: 3, mortgage: 13000, equity: 31500 },
    { year: 4, mortgage: 13000, equity: 43000 },
    { year: 5, mortgage: 13000, equity: 55000 },
  ];

  const container = document.getElementById("table-container");
  container.innerHTML = "";

  const table = document.createElement("table");
  // Create thead and tbody
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  table.appendChild(thead);
  table.appendChild(tbody);

  // Column headers
  const headerRow = thead.insertRow();
  const headers = [
    ["Year", "year"],
    ["Rent Paid ($)", "rent"],
    ["Cumulative Rent ($)", "rent"],
    ["Mortgage ($)", "buy"],
    ["Equity Gained ($)", "buy"],
  ];
  headers.forEach(([text, style]) => {
    const th = document.createElement("th");
    th.textContent = text;
    if (style != "") {
      th.classList.add(style);
    }
    headerRow.appendChild(th);
  });

  // Data rows
  for (let i = 0; i < rentData.length; i++) {
    const row = tbody.insertRow();
    const rent = rentData[i];
    const buy = buyData[i];

    row.insertCell().textContent = rent.year;
    row.insertCell().textContent = rent.rentPaid.toLocaleString();
    row.insertCell().textContent = rent.cumulative.toLocaleString();

    row.insertCell().textContent = buy.mortgage.toLocaleString();
    row.insertCell().textContent = buy.equity.toLocaleString();
  }

  container.appendChild(table);
  table.scrollIntoView({ behavior: "smooth" });
}
