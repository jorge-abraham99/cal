const display = document.getElementById("display");
let currentValue = "0";
let previousValue = null;
let operator = null;
let operatorClicked = false;
let activeOperatorButton = null;
let last_operation = null;
let last_operation_index = null;
let operation_array = [];

function updateDisplay() {
  // When an operator has just been clicked, show "previousValue operator"
  if (previousValue !== null && operator !== null) {
    if (operatorClicked) {
      display.value = previousValue + " " + operator;
    } else {
      display.value = previousValue + " " + operator + " " + currentValue;
    }
  } else {
    display.value = currentValue;
  }
}

function handleNumber(num) {
  if (operatorClicked) {
    // Start fresh if an operator was just clicked
    currentValue = num;
    operatorClicked = false;
  } else {
    // Prevent multiple decimal points
    if (num === '.' && currentValue.includes('.')) return;

    // Append the number or decimal point
    currentValue = currentValue === "0" && num !== "." ? num : currentValue + num;
  }
  updateDisplay();
}
function handleOperator(op, button) {
  if (previousValue === null) {
    previousValue = currentValue;
  } else if (operator && !operatorClicked) {
    currentValue = calculate(previousValue, currentValue, operator);
    previousValue = currentValue;
  }

  operatorClicked = true;
  operator = op;

  // Highlight the active operator button
  if (activeOperatorButton) {
    activeOperatorButton.classList.remove("active");
  }
  if (button) {
    button.classList.add("active");
    activeOperatorButton = button;
  }
}
function DeleteNumber() {
  if (currentValue.length > 1) {
    currentValue = currentValue.slice(0, -1);
  } else {
    currentValue = "0";
  }
  updateDisplay();
}

function calculate(a, b, operator) {
  const num1 = parseFloat(a);
  const num2 = parseFloat(b);
  switch (operator) {
    case "+":
      return (num1 + num2).toString();
    case "-":
      return (num1 - num2).toString();
    case "*":
      return (num1 * num2).toString();
    case "/":
      return (num1 / num2).toString();
    case "%":
      return ((num1 * num2) / 100).toString();
    case "√":
      return Math.sqrt(num1).toString();
    default:
      return b;
  }
}
function clearCalculator() {
  currentValue = "0";
  previousValue = null;
  operator = null;
  operatorClicked = false;
  if (activeOperatorButton) {
    activeOperatorButton.classList.remove("active");
    activeOperatorButton = null;
  }
  updateDisplay();
}
function handleEqual() {
  if (previousValue !== null && operator !== null) {
    last_operation = previousValue + " " + operator + " " + currentValue;
    operation_array.push(last_operation);
    last_operation_index = operation_array.length - 1;
    currentValue = calculate(previousValue, currentValue, operator);
    previousValue = null;
    operator = null;
    operatorClicked = false;

    // Remove operator highlight
    if (activeOperatorButton) {
      activeOperatorButton.classList.remove("active");
      activeOperatorButton = null;
    }

    updateDisplay();
  }
}
function previousOperation() {
    if (last_operation !== null ) {
        display.value = operation_array[last_operation_index];
        if (last_operation_index > 0) {
            last_operation_index--
            previousValue = operation_array[last_operation_index].split(" ")[0];
            operator = operation_array[last_operation_index].split(" ")[1];
            currentValue = operation_array[last_operation_index].split(" ")[2] || "0";
            updateDisplay();
        }
    } else {
        return
    }
}
function nextOperation() {
    if (last_operation !== null && last_operation_index < operation_array.length - 1) {
        last_operation_index++;
        display.value = operation_array[last_operation_index];
        previousValue = operation_array[last_operation_index].split(" ")[0];
        operator = operation_array[last_operation_index].split(" ")[1];
        currentValue = operation_array[last_operation_index].split(" ")[2] || "0";
        updateDisplay();
    } else {
        return;
    }
}
function toggleSign() {
  currentValue = (parseFloat(currentValue) * -1).toString();
  updateDisplay();
}
function handleBackspace() {
  if (operatorClicked) return; // Do nothing if an operator was just clicked
  if (currentValue.length > 1) {
    currentValue = currentValue.slice(0, -1);
  } else {
    currentValue = "0";
  }
  updateDisplay();
}
document.addEventListener("keydown", (e) => {
  let key = e.key;

  // Map keys to calculator functions
  if (key === "Enter") key = "=";
  if (key === "Escape") key = "ac";
  if (key === "Backspace") {
    e.preventDefault(); // Prevent default browser action
    handleInput("backspace");
    return;
  }
  if (key === "Delete") {
    e.preventDefault();
    handleInput("ac");
    return;
  }

  if (["+", "-", "*", "/", "%", ".", "="].includes(key) || (!isNaN(key) && key !== " ")) {
    e.preventDefault();
    handleInput(key);
  }
});
function handleInput(input) {
  if (input === "ac") {
    clearCalculator();
  } else if (input === "plus-minus") {
    toggleSign();
  } else if (input === "=") {
    handleEqual();
  } else if (input === "√") {
    // Use calculate with the sqrt operator; b value is not used here.
    currentValue = calculate(currentValue, "", "√");
    updateDisplay();
  } else if (["+", "-", "*", "/", "%"].includes(input)) {
    const operatorButton = document.querySelector(`.operator[data-action="${input}"]`);
    handleOperator(input, operatorButton);
  } else if (input === "backspace") {
    handleBackspace();
  } else if (!isNaN(input) || input === ".") {
    handleNumber(input);
  }
}
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const { id } = e.target;
    if (id === "ac") return handleInput("ac");
    if (id === "plus-minus") return handleInput("plus-minus");
    if (id === "equals") return handleInput("=");
    if (id === "prev") return previousOperation();
    if (id === "next") return nextOperation();
    if (id === "delete") return DeleteNumber();
    if (id === "sqrt") return handleInput("√"); // Process the sqrt operator
    
    if (e.target.classList.contains("operator")) {
      const op = e.target.getAttribute("data-action");
      handleInput(op);
    } else {
      handleInput(e.target.textContent);
    }
  });
});