function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return "Nice try, but you can't divide by zero!";
    }
    return a / b;
}

function operate(operator, a, b) {
    switch (operator) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            return divide(a, b);
        default:
            return null;
    }
}

function roundResult(num) {
    if (typeof num === 'string') {
        return num;
    }
    return Math.round(num * 10000000000) / 10000000000;
}

let firstNumber = null;
let currentOperator = null;
let secondNumber = null;
let shouldResetDisplay = false;
let waitingForNewOperand = false;

let display = null;

function updateDisplay(value) {
    if (display) {
        const roundedValue = typeof value === 'number' ? roundResult(value) : value;
        display.textContent = roundedValue;
    }
}

function handleNumberClick(number) {
    const currentDisplay = display.textContent;
    
    if (waitingForNewOperand) {
        updateDisplay(number);
        firstNumber = null;
        currentOperator = null;
        secondNumber = null;
        waitingForNewOperand = false;
        shouldResetDisplay = false;
        return;
    }
    
    if (shouldResetDisplay) {
        updateDisplay(number);
        shouldResetDisplay = false;
    } else {
        if (currentDisplay === '0' || currentDisplay === 'Nice try, but you can\'t divide by zero!') {
            updateDisplay(number);
        } else {
            if (number === '.' && currentDisplay.includes('.')) {
                return;
            }
            updateDisplay(currentDisplay + number);
        }
    }
}

function handleOperatorClick(op) {
    const currentDisplay = display.textContent;
    
    if (currentDisplay.includes('Nice try')) {
        return;
    }
    
    const currentValue = parseFloat(currentDisplay);
    
    if (waitingForNewOperand) {
        firstNumber = currentValue;
        waitingForNewOperand = false;
    }
    else if (firstNumber === null) {
        firstNumber = currentValue;
    }
    else if (currentOperator && !shouldResetDisplay) {
        secondNumber = currentValue;
        const result = operate(currentOperator, firstNumber, secondNumber);
        updateDisplay(result);
        if (typeof result === 'string') {
            firstNumber = null;
            currentOperator = null;
            waitingForNewOperand = true;
            shouldResetDisplay = true;
            return;
        }
        firstNumber = roundResult(result);
    }
    
    currentOperator = op;
    shouldResetDisplay = true;
    waitingForNewOperand = false;
}

function handleEqualsClick() {
    if (firstNumber !== null && currentOperator && !shouldResetDisplay && !waitingForNewOperand) {
        secondNumber = parseFloat(display.textContent);
        const result = operate(currentOperator, firstNumber, secondNumber);
        updateDisplay(result);
        
        if (typeof result === 'string') {
            firstNumber = null;
            currentOperator = null;
            secondNumber = null;
        } else {
            firstNumber = roundResult(result);
        }
        waitingForNewOperand = true;
        shouldResetDisplay = true;
    }
}

function handleClearClick() {
    firstNumber = null;
    currentOperator = null;
    secondNumber = null;
    shouldResetDisplay = false;
    waitingForNewOperand = false;
    updateDisplay('0');
}

document.addEventListener('DOMContentLoaded', () => {
    display = document.querySelector('.display');
    const numberButtons = document.querySelectorAll('.number');
    const operatorButtons = document.querySelectorAll('.operator');
    const equalsButton = document.querySelector('.equals');
    const clearButton = document.querySelector('.clear');

    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            handleNumberClick(button.textContent);
        });
    });

    operatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            handleOperatorClick(button.textContent);
        });
    });

    equalsButton.addEventListener('click', handleEqualsClick);

    clearButton.addEventListener('click', handleClearClick);
});
