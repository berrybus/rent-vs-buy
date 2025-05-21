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
  return !isNaN(num) && num >= min && num <= max
    ? Math.round(num * 100) / 100
    : undefined;
}

const downPaymentInput = document.getElementById("downPayment");
const homeCostInput = document.getElementById("homeCost");
const interestRateInput = document.getElementById("interestRate");
const mortgageYearsInput = document.getElementById("mortgageYears");
const downPaymentAmountElement = document.getElementById("downPaymentDollars");
const mortgageInput = document.getElementById("mortgage");
const rentInput = document.getElementById("rent");
const yearsInput = document.getElementById("years");
const rentGrowthInput = document.getElementById("rentGrowth");
const stockGrowthInput = document.getElementById("stockGrowth");
const homeGrowthInput = document.getElementById("homeGrowth");
const propertyTaxInput = document.getElementById("propertyTax");
const hoaInput = document.getElementById("hoa");
const homeInsuranceInput = document.getElementById("homeownerInsurance");
const maintenanceInput = document.getElementById("maintenance");
const standardDeductionInput = document.getElementById("standardDeduction");
const taxBracketInput = document.getElementById("taxBracket");
const extraGrowthInput = document.getElementById("extraGrowth");
const rentalIncomeInput = document.getElementById("rentalIncome");
const nepoMoneyInput = document.getElementById("nepoMoney");

var mortgage;
var downPaymentAmount;

function calculateDownPayment() {
  const downPayment = getValidNumber(downPaymentInput);
  const homeCost = getValidNumber(homeCostInput);

  if (downPayment != undefined && homeCost != undefined) {
    downPaymentAmount = (downPayment / 100) * homeCost;
    downPaymentAmount = Math.round(downPaymentAmount * 100) / 100;
    downPaymentAmountElement.textContent = `($${downPaymentAmount.toLocaleString(
      undefined,
      {}
    )})`;
  } else {
    downPaymentAmountElement.textContent = "";
  }
}

downPaymentInput.addEventListener("blur", calculateDownPayment);
homeCostInput.addEventListener("blur", calculateDownPayment);

calculateDownPayment();

function calculateMortgage() {
  var interestRate = getValidNumber(interestRateInput);
  const mortgageYears = getValidNumber(mortgageYearsInput);
  const homeCost = getValidNumber(homeCostInput);

  if (
    downPaymentAmount == undefined ||
    interestRate == undefined ||
    mortgageYears == undefined ||
    homeCost == undefined ||
    interestRate == 0
  ) {
    mortgageInput.value = "Error";
    return;
  }
  interestRate /= 100;
  if (downPayment >= 100) {
    mortgage = 0;
    mortgageInput.value = mortgage;
    return;
  }
  const principle = homeCost - downPaymentAmount;
  const n = mortgageYears * 12;
  const monthly_interest = interestRate / 12;
  const numerator = monthly_interest * Math.pow(1 + monthly_interest, n);
  const denominator = Math.pow(1 + monthly_interest, n) - 1;
  mortgage = principle * (numerator / denominator);
  mortgage = Math.round(mortgage * 100) / 100;
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

function calculate() {
  const rentAmount = getValidNumber(rentInput);
  const interestRate = getValidNumber(interestRateInput);
  const mortgageYears = getValidNumber(mortgageYearsInput);
  const homeCost = getValidNumber(homeCostInput);
  const years = getValidNumber(yearsInput);
  var rentGrowth = getValidNumber(rentGrowthInput);
  var stockGrowth = getValidNumber(stockGrowthInput);
  var propertyTax = getValidNumber(propertyTaxInput);
  var hoa = getValidNumber(hoaInput);
  var homeownerInsurance = getValidNumber(homeInsuranceInput);
  var maintenance = getValidNumber(maintenanceInput);
  const standardDeduction = getValidNumber(standardDeductionInput);
  var taxBracket = getValidNumber(taxBracketInput);
  var extraGrowth = getValidNumber(extraGrowthInput);
  var homeGrowth = getValidNumber(homeGrowthInput);
  var rentalIncome = getValidNumber(rentalIncomeInput);
  const nepoMoney = getValidNumber(nepoMoneyInput);

  if (
    rentAmount == undefined ||
    downPaymentAmount == undefined ||
    interestRate == undefined ||
    mortgageYears == undefined ||
    homeCost == undefined ||
    mortgage == undefined ||
    years == undefined ||
    rentGrowth == undefined ||
    stockGrowth == undefined ||
    propertyTax == undefined ||
    hoa == undefined ||
    homeownerInsurance == undefined ||
    maintenance == undefined ||
    standardDeduction == undefined ||
    taxBracket == undefined ||
    extraGrowth == undefined ||
    homeGrowth == undefined ||
    rentalIncome == undefined ||
    nepoMoney == undefined
  ) {
    return undefined;
  }
  // Calculate yearly principle and interest table
  var piTable = [];
  var principle = homeCost - downPaymentAmount;
  const monthlyInterest = interestRate / 100 / 12;
  rentGrowth = 1 + rentGrowth / 100;
  stockGrowth = 1 + stockGrowth / 100;
  extraGrowth = 1 + extraGrowth / 100;
  homeGrowth = 1 + homeGrowth / 100;
  taxBracket /= 100;

  for (let i = 0; i < mortgageYears; i++) {
    var yearlyInterest = 0;
    var yearlyDeductibleInterest = 0;
    var yearlyMortgage = 0;
    var yearlyPrinciple = 0;
    for (let month = 0; month < 12; month++) {
      const interest = principle * monthlyInterest;
      // Can only deduct interest on first $750,000 of principle
      const deductibleInterest = Math.min(principle, 750000) * monthlyInterest;
      const principlePayment = Math.min(mortgage - interest, principle);
      const mortgagePayment = principlePayment + interest;
      principle -= principlePayment;
      yearlyInterest += interest;
      yearlyDeductibleInterest += deductibleInterest;
      yearlyMortgage += mortgagePayment;
      yearlyPrinciple += principlePayment;
    }
    piTable.push({
      interest: yearlyInterest,
      deductibleInterest: yearlyDeductibleInterest,
      mortgage: yearlyMortgage,
      portionOwned: 1 - principle / homeCost,
      principle: yearlyPrinciple,
    });
  }

  // Yearly simulation!
  var rentInvestments = Math.max(0, downPaymentAmount - nepoMoney);
  var buyInvestments = 0;
  var homeValue = homeCost;
  var rentData = [];
  var buyData = [];
  var rentPayment = rentAmount * 12;
  for (let i = 0; i < years; i++) {
    const mortgage = i < piTable.length ? piTable[i].mortgage : 0;
    const interest = i < piTable.length ? piTable[i].interest : 0;
    const principlePayment = i < piTable.length ? piTable[i].principle : 0;
    const extraCost =
      (hoa + propertyTax + homeownerInsurance + maintenance) * 12;
    const homePayment = mortgage + extraCost;

    // Assume that you always have the money to pay either the mortgage or rent and
    // invested the amount you saved instead of spending it
    if (homePayment > rentPayment) {
      const diff = homePayment - rentPayment;
      rentInvestments += diff;
    } else {
      const diff = rentPayment - homePayment;
      buyInvestments += diff;
    }

    buyInvestments += rentalIncome * 12;

    const homeOwnedPercentage =
      i < piTable.length ? piTable[i].portionOwned : 1;
    const homeEquity = homeOwnedPercentage * homeValue;
    const interestSaved =
      i < piTable.length ? piTable[i].deductibleInterest : 0;
    // Assume SALT cap
    const totalDeduction = interestSaved + 10000;
    const deductionSaved = Math.max(0, totalDeduction - standardDeduction);
    const taxesSaved = deductionSaved * taxBracket;
    buyInvestments += taxesSaved;

    // Round investments to nearest cent
    rentInvestments = Math.round(rentInvestments * 100) / 100;
    buyInvestments = Math.round(buyInvestments * 100) / 100;
    rentData.push({
      monthlyPayment: rentPayment,
      investments: rentInvestments,
      total: rentInvestments,
    });
    buyData.push({
      monthlyPayment: homePayment,
      mortgage: mortgage,
      principle: principlePayment,
      interest: interest,
      extraCost: extraCost,
      taxesSaved: taxesSaved,
      investments: buyInvestments,
      homeEquity: homeEquity,
      rentalIncome: rentalIncome * 12,
      total: buyInvestments + homeEquity,
    });
    // Another year has passed, increase the costs!
    rentPayment *= rentGrowth;
    hoa *= extraGrowth;
    propertyTax *= extraGrowth;
    homeownerInsurance *= extraGrowth;
    maintenance *= extraGrowth;
    homeValue *= homeGrowth;
    buyInvestments *= stockGrowth;
    rentInvestments *= stockGrowth;
    rentalIncome *= homeGrowth;
  }
  return { rentData, buyData };
}

function createTable() {
  const result = calculate();
  const rentalIncome = getValidNumber(rentalIncomeInput);
  if (result === undefined) {
    console.warn("Missing input(s), skipping table creation.");
    return;
  }

  const { rentData, buyData } = result;

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
    ["Total Payment", "rent"],
    ["Investments (Total NW)", "rent"],
    ["Total Payment", "buy"],
    ["Mortgage", "buy"],
    ["Principle", "buy"],
    ["Interest", "buy"],
    ["Recurring Costs", "buy"],
    ["Tax Saving", "buy"],
    ["Rental Income", "buy"],
    ["Investments", "buy"],
    ["Home Equity", "buy"],
    ["Total NW", "buy"],
  ];
  headers.forEach(([text, style]) => {
    const th = document.createElement("th");
    th.textContent = text;
    if (style != "") {
      th.classList.add(style);
    }
    if (
      text == "Rental Income" &&
      (rentalIncome == undefined || rentalIncome == 0)
    ) {
      return;
    }
    headerRow.appendChild(th);
  });

  // Data rows
  for (let i = 0; i < rentData.length; i++) {
    const row = tbody.insertRow();
    const rent = rentData[i];
    const buy = buyData[i];

    row.insertCell().textContent = i + 1;
    row.insertCell().textContent = rent.monthlyPayment.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    row.insertCell().textContent = rent.total.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    row.insertCell().textContent = buy.monthlyPayment.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    row.insertCell().textContent = buy.mortgage.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    row.insertCell().textContent = buy.principle.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    row.insertCell().textContent = buy.interest.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    row.insertCell().textContent = buy.extraCost.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    row.insertCell().textContent = buy.taxesSaved.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    if (rentalIncome > 0) {
      row.insertCell().textContent = buy.rentalIncome.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    row.insertCell().textContent = buy.investments.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    row.insertCell().textContent = buy.homeEquity.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    row.insertCell().textContent = buy.total.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  let winnerClass;
  let winnerString;
  let winnerDiff;
  const rentFinal = rentData[rentData.length - 1].total;
  const buyFinal = buyData[buyData.length - 1].total;

  if (rentFinal < buyFinal) {
    winnerClass = "purple-text";
    winnerString = "Buying";
    winnerDiff = buyFinal - rentFinal;
  } else if (rentFinal > buyFinal) {
    winnerClass = "blue-text";
    winnerString = "Renting";
    winnerDiff = rentFinal - buyFinal;
  }

  const savingsString = winnerDiff.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  container.appendChild(table);
  const results = document.getElementById("results");
  results.innerHTML = `<span class=${winnerClass}>${winnerString}</span> saves you $${savingsString}`;
  const chartContainer = document.getElementById("chart-container");
  chartContainer.style.display = "block";
  chartContainer.setAttribute("open", "");
}
