class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement, memo) {
      this.previousOperandTextElement = previousOperandTextElement;
      this.currentOperandTextElement = currentOperandTextElement;
      this.memo = memo;
      this.clear();
    }
  
    clear() {
      this.currentOperand = '';
      this.previousOperand = '';
      this.operation = undefined;
    }
  
    delete() {
      this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }
  
    appendNumber(number) {
      if (number === '.' && this.currentOperand.includes('.')) return;
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
  
    chooseOperation(operation) {
      if (this.currentOperand === '') return;
      if (this.currentOperand !== '' && this.previousOperand !== '') {
        this.compute();
      }
      if (operation === 'ROOT') {
          this.previousOperand = 0.5;
      }
      if (operation === 'xy') {
          this.operation = '^';
      } else {
          this.operation = operation;
      }
      if (operation !== 'ROOT') {
          this.previousOperand = this.currentOperand;
          this.currentOperand = '';
      }
    }
  
    compute() {
      let computation;
      const prev = parseFloat(this.previousOperand);
      const current = parseFloat(this.currentOperand);
      if (isNaN(prev) || isNaN(current)) return;
      switch (this.operation) {
        case '+':
          computation = prev + current;
          break
        case '-':
          computation = prev - current;
          break
        case '*':
          computation = prev * current;
          break
        case '÷':
          computation = prev / current;
          break
        case '^':
          computation = Math.pow(prev, current);
          break
        case 'ROOT':
          if (current < 0) {
              computation = 'Error';
          } else {
              computation = Math.sqrt(current);
          }
          break
        default:
          return;
      }
      if (computation === 'Error') {
          this.currentOperand = 'Error';
      } else {
          this.currentOperand = +computation.toFixed(10);
      }
      this.operation = undefined;
      this.previousOperand = '';
    }
  
    getDisplayNumber(number) {
      if (number === '-') return '-';
      if (number === 'Error') return number;
      const stringNumber = number.toString()
      const integerDigits = parseFloat(stringNumber.split('.')[0])
      const decimalDigits = stringNumber.split('.')[1]
      let integerDisplay
      if (isNaN(integerDigits)) {
        integerDisplay = ''
      } else {
        integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
      }
      if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`
      } else {
        return integerDisplay
      }
    }
  
    updateDisplay() {
      isNeg = false;
      this.currentOperandTextElement.innerText =
        this.getDisplayNumber(this.currentOperand)
      if (this.operation != null && this.previousOperand === 0.5) {
        this.previousOperandTextElement.innerText =
          `${this.operation}`;
      } else if (this.operation != null) {
        this.previousOperandTextElement.innerText =
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
      } else {
        this.previousOperandTextElement.innerText = ''
      }
    }
  }
  
  let isNeg = false;
  const numberButtons = document.querySelectorAll('[data-number]');
  const operationButtons = document.querySelectorAll('[data-operation]');
  const equalsButton = document.querySelector('[data-equals]');
  const deleteButton = document.querySelector('[data-delete]');
  const allClearButton = document.querySelector('[data-all-clear]');
  const previousOperandTextElement = document.querySelector('[data-previous-operand]');
  const currentOperandTextElement = document.querySelector('[data-current-operand]');
  const subtractButton = document.querySelector('.subtract');
  
  const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)
  
  numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        if(calculator.memo === true) {
            calculator.clear();
            calculator.memo = false;
        }
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay();
    })
  })
  
  operationButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (calculator.currentOperand === 'Error') {
          calculator.clear();
      } else if (calculator.currentOperand !== '-') {
          calculator.memo = false;
          calculator.chooseOperation(button.innerText);
          calculator.updateDisplay();
      }
    })
  })
  
  equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
    calculator.memo = true;
  })
  
  allClearButton.addEventListener('click', button => {
    calculator.clear();
    calculator.updateDisplay();
  })
  
  deleteButton.addEventListener('click', button => {
    calculator.delete();
    calculator.updateDisplay();
  })

  subtractButton.addEventListener('click', button => {
    if (calculator.currentOperand === '' && calculator.operation !== '-' && !isNeg) {
        calculator.currentOperand = '-';
        isNeg = true;
        calculator.updateDisplay();
    } 
  })