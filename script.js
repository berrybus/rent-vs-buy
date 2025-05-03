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
const downPaymentAmountElement = document.getElementById("downPaymentDollars");

function calculateDownPayment() {
  const downPayment = getValidNumber(downPaymentInput);
  const homeCost = getValidNumber(homeCostInput);

  console.log(downPayment);
  console.log(homeCost);

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

downPaymentInput.addEventListener("input", calculateDownPayment);
homeCostInput.addEventListener("input", calculateDownPayment);

calculateDownPayment();
