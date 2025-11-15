const previousElement = document.querySelector('.previous');
const currentElement = document.querySelector('.current');
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-action="calculate"]');
const clearButton = document.querySelector('[data-action="clear"]');
const deleteButton = document.querySelector('[data-action="delete"]');

let currentOperand = '0';
let previousOperand = '';
let operation = null;
let resetScreen = false;

function updateDisplay() {
    currentElement.textContent = currentOperand;
    if (operation) {
        previousElement.textContent = `${previousOperand} ${operation}`;
    } else {
        previousElement.textContent = '';
    }
}

function clear() {
    currentOperand = '0';
    previousOperand = '';
    operation = null;
    resetScreen = false;
}

function deleteDigit() {
    if (currentOperand.length === 1) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
}

function appendNumber(number) {
    if (resetScreen) {
        currentOperand = '';
        resetScreen = false;
    }
    
    if (number === '.' && currentOperand.includes('.')) return;
    
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
    } else {
        currentOperand += number;
    }
}

function chooseOperation(op) {
    if (currentOperand === '') return;
    
    if (previousOperand !== '') {
        calculate();
    }
    
    operation = op;
    previousOperand = currentOperand;
    resetScreen = true;
}

function calculate() {
    let result;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '×':
            result = prev * current;
            break;
        case '÷':
            if (current === 0) {
                alert("Cannot divide by zero!");
                return;
            }
            result = prev / current;
            break;
        case '%':
            result = prev % current;
            break;
        default:
            return;
    }
    
    currentOperand = result.toString();
    operation = null;
    previousOperand = '';
    resetScreen = true;
}

function handleSpecialOperation(op) {
    const current = parseFloat(currentOperand);
    if (isNaN(current)) return;
    
    let result;
    
    switch (op) {
        case '%':
            result = current / 100;
            break;
        default:
            return;
    }
    
    currentOperand = result.toString();
    resetScreen = true;
}

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.textContent);
        updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        const op = button.getAttribute('data-operation');
        
        if (op === '%') {
            handleSpecialOperation(op);
        } else {
            chooseOperation(op);
        }
        
        updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    calculate();
    updateDisplay();
});

clearButton.addEventListener('click', () => {
    clear();
    updateDisplay();
});

deleteButton.addEventListener('click', () => {
    deleteDigit();
    updateDisplay();
});

document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
        updateDisplay();
    }
    
    if (e.key === '.') {
        appendNumber(e.key);
        updateDisplay();
    }
    
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        let op;
        switch (e.key) {
            case '+': op = '+'; break;
            case '-': op = '-'; break;
            case '*': op = '×'; break;
            case '/': op = '÷'; break;
        }
        chooseOperation(op);
        updateDisplay();
    }
    
    if (e.key === 'Enter' || e.key === '=') {
        calculate();
        updateDisplay();
    }
    
    if (e.key === 'Escape') {
        clear();
        updateDisplay();
    }
    
    if (e.key === 'Backspace') {
        deleteDigit();
        updateDisplay();
    }
});

updateDisplay();