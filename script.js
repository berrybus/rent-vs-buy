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
    mortgageYears == undefined
  ) {
    return;
  }
  interestRate /= 100;
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
  const data = [
    { year: 1, principal: 10000, interest: 3000, total: 13000 },
    { year: 2, principal: 10500, interest: 2500, total: 13000 },
    { year: 3, principal: 11000, interest: 2000, total: 13000 },
    { year: 4, principal: 11500, interest: 1500, total: 13000 },
    { year: 5, principal: 12000, interest: 1000, total: 13000 },
  ];

  const container = document.getElementById("table-container");
  container.innerHTML = ""; // clear previous tables if any

  const table = document.createElement("table");
  const headerRow = table.insertRow();

  const headers = [
    "Year",
    "Principal ($)",
    "Interest ($)",
    "Total Payment ($)",
  ];
  headers.forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });

  data.forEach((row) => {
    const tr = table.insertRow();
    tr.insertCell().textContent = row.year;
    tr.insertCell().textContent = row.principal.toLocaleString();
    tr.insertCell().textContent = row.interest.toLocaleString();
    tr.insertCell().textContent = row.total.toLocaleString();
  });

  container.appendChild(table);
  table.scrollIntoView({ behavior: "smooth" });
}
