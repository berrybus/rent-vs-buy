function getValidNumber(inputElement) {
  if (!(inputElement instanceof HTMLInputElement)) {
    return undefined
  }

  const value = inputElement.value.trim()

  // Return undefined for empty input
  if (value === "") {
    return undefined
  }

  // Remove commas and parse
  const num = Number(value.replace(/,/g, ""))

  const min = inputElement.min !== "" ? Number(inputElement.min) : -Infinity
  const max = inputElement.max !== "" ? Number(inputElement.max) : Infinity

  // Return the number ONLY if valid, otherwise undefined
  return !isNaN(num) && num >= min && num <= max
    ? Math.round(num * 100) / 100
    : undefined
}

let mortgage
let downPaymentAmount

function calculateDownPayment() {
  const downPayment = getValidNumber(downPaymentInput)
  const homeCost = getValidNumber(homeCostInput)

  if (downPayment != undefined && homeCost != undefined) {
    downPaymentAmount = (downPayment / 100) * homeCost
    downPaymentAmount = Math.round(downPaymentAmount * 100) / 100
    downPaymentDollarsDisplay.textContent = `($${downPaymentAmount.toLocaleString(
      undefined,
      {}
    )})`
  } else {
    downPaymentDollarsDisplay.textContent = ""
  }
}

downPaymentInput.addEventListener("blur", calculateDownPayment)
homeCostInput.addEventListener("blur", calculateDownPayment)

calculateDownPayment()

function calculateMortgage() {
  let interestRate = getValidNumber(interestRateInput)
  const mortgageYears = getValidNumber(mortgageYearsInput)
  const homeCost = getValidNumber(homeCostInput)
  const downPayment = getValidNumber(downPaymentInput)

  if (
    downPaymentAmount == undefined ||
    interestRate == undefined ||
    mortgageYears == undefined ||
    homeCost == undefined ||
    interestRate == 0 ||
    downPayment == undefined
  ) {
    mortgageInput.value = "Error"
    return
  }
  interestRate /= 100
  if (downPayment >= 100) {
    mortgage = 0
    mortgageInput.value = mortgage
    return
  }
  const principal = homeCost - downPaymentAmount
  const n = mortgageYears * 12
  const monthly_interest = interestRate / 12
  const numerator = monthly_interest * Math.pow(1 + monthly_interest, n)
  const denominator = Math.pow(1 + monthly_interest, n) - 1
  mortgage = principal * (numerator / denominator)
  mortgage = Math.round(mortgage * 100) / 100
  mortgageInput.value = mortgage
}

calculateMortgage()

downPaymentInput.addEventListener("blur", calculateMortgage)
homeCostInput.addEventListener("blur", calculateMortgage)
interestRateInput.addEventListener("blur", calculateMortgage)
mortgageYearsInput.addEventListener("blur", calculateMortgage)

document.querySelectorAll(".number-input").forEach((input) => {
  input.addEventListener("blur", (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "")
    if (value) {
      e.target.value = parseInt(value, 10).toLocaleString()
    }
  })
})

function calculate() {
  const rentAmount = getValidNumber(rentInput)
  const interestRate = getValidNumber(interestRateInput)
  const mortgageYears = getValidNumber(mortgageYearsInput)
  const homeCost = getValidNumber(homeCostInput)
  const years = getValidNumber(yearsInput)
  let rentGrowth = getValidNumber(rentGrowthInput)
  let stockGrowth = getValidNumber(stockGrowthInput)
  let propertyTax = getValidNumber(propertyTaxInput)
  let hoa = getValidNumber(hoaInput)
  let homeownerInsurance = getValidNumber(homeInsuranceInput)
  let maintenance = getValidNumber(maintenanceInput)
  const standardDeduction = getValidNumber(standardDeductionInput)
  let taxBracket = getValidNumber(taxBracketInput)
  let extraGrowth = getValidNumber(extraGrowthInput)
  let homeGrowth = getValidNumber(homeGrowthInput)
  let rentalIncome = getValidNumber(rentalIncomeInput)
  const nepoMoney = getValidNumber(nepoMoneyInput)

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
    return undefined
  }
  // Calculate yearly principal and interest table
  let piTable = []
  let principal = homeCost - downPaymentAmount
  const monthlyInterest = interestRate / 100 / 12
  rentGrowth = 1 + rentGrowth / 100
  stockGrowth = 1 + stockGrowth / 100
  extraGrowth = 1 + extraGrowth / 100
  homeGrowth = 1 + homeGrowth / 100
  taxBracket /= 100

  for (let i = 0; i < mortgageYears; i++) {
    let yearlyInterest = 0
    let yearlyDeductibleInterest = 0
    let yearlyMortgage = 0
    let yearlyPrincipal = 0
    for (let month = 0; month < 12; month++) {
      const interest = principal * monthlyInterest
      // Can only deduct interest on first $750,000 of principal
      const deductibleInterest = Math.min(principal, 750000) * monthlyInterest
      const principalPayment = Math.min(mortgage - interest, principal)
      const mortgagePayment = principalPayment + interest
      principal -= principalPayment
      yearlyInterest += interest
      yearlyDeductibleInterest += deductibleInterest
      yearlyMortgage += mortgagePayment
      yearlyPrincipal += principalPayment
    }
    piTable.push({
      interest: yearlyInterest,
      deductibleInterest: yearlyDeductibleInterest,
      mortgage: yearlyMortgage,
      portionOwned: 1 - principal / homeCost,
      principal: yearlyPrincipal,
    })
  }

  // Yearly simulation!
  let rentInvestments = Math.max(0, downPaymentAmount - nepoMoney)
  let buyInvestments = 0
  let homeValue = homeCost
  let rentData = []
  let buyData = []
  let rentPayment = rentAmount * 12
  for (let i = 0; i < years; i++) {
    const mortgage = i < piTable.length ? piTable[i].mortgage : 0
    const interest = i < piTable.length ? piTable[i].interest : 0
    const principalPayment = i < piTable.length ? piTable[i].principal : 0
    const extraCost =
      (hoa + propertyTax + homeownerInsurance + maintenance) * 12
    const homePayment = mortgage + extraCost

    // Assume that you always have the money to pay either the mortgage or rent and
    // invested the amount you saved instead of spending it
    if (homePayment > rentPayment) {
      const diff = homePayment - rentPayment
      rentInvestments += diff
    } else {
      const diff = rentPayment - homePayment
      buyInvestments += diff
    }

    buyInvestments += rentalIncome * 12

    const homeOwnedPercentage = i < piTable.length ? piTable[i].portionOwned : 1
    const homeEquity = homeOwnedPercentage * homeValue
    const interestSaved = i < piTable.length ? piTable[i].deductibleInterest : 0
    // Assume SALT cap
    const totalDeduction = interestSaved + 10000
    const deductionSaved = Math.max(0, totalDeduction - standardDeduction)
    const taxesSaved = deductionSaved * taxBracket
    buyInvestments += taxesSaved

    // Round investments to nearest cent
    rentInvestments = Math.round(rentInvestments * 100) / 100
    buyInvestments = Math.round(buyInvestments * 100) / 100
    rentData.push({
      monthlyPayment: rentPayment,
      investments: rentInvestments,
      total: rentInvestments,
    })
    buyData.push({
      monthlyPayment: homePayment,
      mortgage: mortgage,
      principal: principalPayment,
      interest: interest,
      extraCost: extraCost,
      taxesSaved: taxesSaved,
      investments: buyInvestments,
      homeEquity: homeEquity,
      rentalIncome: rentalIncome * 12,
      total: buyInvestments + homeEquity,
    })
    // Another year has passed, increase the costs!
    rentPayment *= rentGrowth
    hoa *= extraGrowth
    propertyTax *= extraGrowth
    homeownerInsurance *= extraGrowth
    maintenance *= extraGrowth
    homeValue *= homeGrowth
    buyInvestments *= stockGrowth
    rentInvestments *= stockGrowth
    rentalIncome *= homeGrowth
  }
  return { rentData, buyData }
}

function createTable() {
  const result = calculate()
  const rentalIncome = getValidNumber(rentalIncomeInput)
  if (result === undefined) {
    console.warn("Missing input(s), skipping table creation.")
    return
  }

  const { rentData, buyData } = result

  tableContainer.innerHTML = ""

  const table = document.createElement("table")
  // Create thead and tbody
  const thead = document.createElement("thead")
  const tbody = document.createElement("tbody")
  table.appendChild(thead)
  table.appendChild(tbody)

  // Column headers
  const headerRow = thead.insertRow()
  const headers = [
    ["Year", "year", ""],
    ["Total Payment", "rent", "Yearly rent payment"],
    ["Investments (Total NW)", "rent", "The total NW of renting is just the investments"],
    ["Total Payment", "buy", "Yearly payment for all things home-related"],
    ["Mortgage", "buy", "Yearly payment for mortgage"],
    ["Principal", "buy", "Yearly payment on the principal of the mortgage"],
    ["Interest", "buy", "Yearly payment on the interest of the mortgage"],
    ["Recurring Costs", "buy", "All the other costs like the maintenence, insurance, hoa, property tax"],
    ["Tax Saving", "buy", "Amount you save in taxes compared to renting, for Americans only"],
    ["Rental Income", "buy", "Yearly rental income"],
    ["Investments", "buy", "The total value in investments"],
    ["Home Equity", "buy", "The percentage of the home x value of the home"],
    ["Total NW", "buy", "Home equity + investments"],
  ]
  headers.forEach(([text, style, tooltipText]) => {
    const th = document.createElement("th")
    th.textContent = text
    th.title = tooltipText
    if (style != "") {
      th.classList.add(style)
    }
    if (
      text == "Rental Income" &&
      (rentalIncome == undefined || rentalIncome == 0)
    ) {
      return
    }
    headerRow.appendChild(th)
  })

  // Data rows
  for (let i = 0; i < rentData.length; i++) {
    const row = tbody.insertRow()
    const rent = rentData[i]
    const buy = buyData[i]

    row.insertCell().textContent = i + 1
    row.insertCell().textContent = rent.monthlyPayment.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    row.insertCell().textContent = rent.total.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

    row.insertCell().textContent = buy.monthlyPayment.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    row.insertCell().textContent = buy.mortgage.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    row.insertCell().textContent = buy.principal.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    row.insertCell().textContent = buy.interest.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    row.insertCell().textContent = buy.extraCost.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    row.insertCell().textContent = buy.taxesSaved.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    if (rentalIncome > 0) {
      row.insertCell().textContent = buy.rentalIncome.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    }
    row.insertCell().textContent = buy.investments.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    row.insertCell().textContent = buy.homeEquity.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    row.insertCell().textContent = buy.total.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  let winnerClass
  let winnerString
  let winnerDiff
  const rentFinal = rentData[rentData.length - 1].total
  const buyFinal = buyData[buyData.length - 1].total

  if (rentFinal < buyFinal) {
    winnerClass = "purple-text"
    winnerString = "Buying"
    winnerDiff = buyFinal - rentFinal
  } else if (rentFinal > buyFinal) {
    winnerClass = "blue-text"
    winnerString = "Renting"
    winnerDiff = rentFinal - buyFinal
  }

  const savingsString = winnerDiff.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  tableContainer.appendChild(table)
  results.innerHTML = `<span class=${winnerClass}>${winnerString}</span> saves you $${savingsString}`
  chartContainer.style.display = "block"
  chartContainer.setAttribute("open", "")

  const years = rentData.map((_, index) => index + 1)

  // Extract totals for rent and buy`
  const rentTotals = rentData.map((item) => Math.round(item.total * 100) / 100)
  const buyTotals = buyData.map((item) => Math.round(item.total * 100) / 100)
  Highcharts.chart("myChart", {
    chart: {
      type: "line",
    },
    title: {
      text: "Net Worth Over Time",
    },
    xAxis: {
      categories: years,
      title: {
        text: "Year",
      },
    },
    yAxis: {
      title: {
        text: "Net Worth",
      },
    },
    series: [
      {
        name: "Rent",
        data: rentTotals,
        color: "#0369a1",
      },
      {
        name: "Buy",
        data: buyTotals,
        color: "#8649bb",
      },
    ],
    tooltip: {
      headerFormat: `Year {point.key}<br>`,
    },
  })
}
