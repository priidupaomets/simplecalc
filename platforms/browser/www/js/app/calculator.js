var calc = calc || {};
// Display in this case refers to the input type="text" above the buttons.
// Below we define functions on the Display object that the calculator can do
calc.Display = function () {
    var $displayControl,
        operator,
        operatorSet = false,
        equalsPressed = false,
        accumulator = null,
        add = function (x, y) {
            return x + y;
        },
        divide = function (x, y) {
            if (y == 0) {
                alert("Can't divide by 0");
                return 0;
            }
            return x / y;
        },
        multiply = function (x, y) {
            return x * y;
        },
        subtract = function (x, y) {
            return x - y;
        },
        // This is the function that performs acual calculation based on 
        // the accumulated value and current number
        calculate = function () {
            //If nothing is entered, skip calculation altogether
            if (!operator || accumulator == null) 
                return;
            // Extract current value as it is visible in the text box
            var currNumber = parseFloat($displayControl.value),
                newVal = 0;
            switch (operator) {
                case "+":
                    newVal = add(accumulator, currNumber);
                    break;
                case "-":
                    newVal = subtract(accumulator, currNumber);
                    break;
                case "*":
                    newVal = multiply(accumulator, currNumber);
                    break;
                case "/":
                    newVal = divide(accumulator, currNumber);
                    break;
                case "%":
                    newVal = currNumber / 100;
                    break;
                case "+/-":
                    newVal = -currNumber;
                    break;
            }
            setValue(newVal);
            accumulator = newVal;
        },
        setValue = function (val) {
            $displayControl.value = val;
        },
        getValue = function () {
            return $displayControl.value + "";
        },
        // clears all of the digits
        clearDisplay = function () {
            accumulator = null;
            equalsPressed = operatorSet = false;
            setValue("0");
        },
        // removes the last digit entered in the display
        clearError = function () {
            var display = getValue();
            // if the string is valid, remove the right most character from it
            // remember: to be valid, must have a value and length
            if (display) {
                display = display.slice(0, display.length - 1);
                display = display ? display : "0";
                setValue(display);
            }
        },
        // handles a numeric or decimal point key being entered
        enterDigit = function (buttonValue) {
            var currentlyDisplayed = $displayControl.value;            
            // keep the max digits to a reasonable number
            if (currentlyDisplayed.length < 20) {
                if (operatorSet == true || currentlyDisplayed === "0") {
                    setValue("");
                    operatorSet = false;
                }                
                // already pressed a decimal point
                if (buttonValue === "." && currentlyDisplayed.indexOf(".") >= 0) {
                    return;
                }                
                setValue($displayControl.value + buttonValue);
            }
        },
        setPercent = function(){
            var currentlyDisplayed = $displayControl.value;
            if(currentlyDisplayed) {
                setValue(currentlyDisplayed / 100);
            }
        },
        reverseSign = function(){
            var currentlyDisplayed = $displayControl.value;
            if(currentlyDisplayed) {
                setValue(-currentlyDisplayed);
            }
        },
        setOperator = function (newOperator) {
            if (newOperator === "=") {
                equalsPressed = true;
                calculate();
                return;
            }
            if (!equalsPressed) 
                calculate();
            equalsPressed = false;
            operator = newOperator;
            operatorSet = true;
            accumulator = parseFloat($displayControl.value);
        },
        // set the pointer to the HTML element which displays the text
        init = function (currNumber) {
            $displayControl = currNumber;
        };
    // all of the methods below are public
return {
        clearDisplay: clearDisplay,
        clearError: clearError,
        enterDigit: enterDigit,
        setOperator: setOperator,
        setPercent: setPercent,
        reverseSign: reverseSign,
        init: init
    };
}();
// The main calculator object constructor function
calc.calculator = function () {    
    // Initialize the Display object inside our calc object and point it 
    // to the text input box and get the initial value displayed there
    calc.Display.init($("#displayPanel")[0]);

	window.addEventListener('orientationchange', function(event) {
		console.log("Orientation Changed: " + window.orientation);
	    var currentOrientation = "";

		if (window.orientation == 0) {
			currentOrientation = "portrait";
		} else if (window.orientation == 90) {
			currentOrientation = "landscape";
		} else if (window.orientation == -90) {
			currentOrientation = "landscape";
		} else if (window.orientation == 180) {
			currentOrientation = "portrait";
		}
		$("#header").innerHTML = currentOrientation;

        //event.preventDefault();
        //event.stopPropagation();
	}, true);
	
    // For each HTML element with a class of "key", attach "touchstart" 
    // and "click" for mouse event handlers
    $(".key").on('touchstart mousedown', function (event) {  
	
		var classList = $(event.target).attr('class').split(/\s+/);
		
		$.each(classList, function(index, item) {
			if (item === 'operation-key') {
				$(event.target).addClass('selected-operation-key');
			} else if (item === 'control-key') {
				$(event.target).addClass('selected-control-key');
			} else {
				$(event.target).addClass('selected-key');
			}
		});

        event.preventDefault();
        event.stopPropagation();
		
	}).on('touchend mouseup', function (event) {        
        // Extract key's value that should be added to the calculation; 
        // also get id of the button
        var key = $(this).attr("data-calc-tag"),
            id = this.id;
        console.log("Setting " + id + " with value "+ key);  

		var classList = $(event.target).attr('class').split(/\s+/);
		
		$.each(classList, function(index, item) {
			if (item === 'operation-key') {
				$(event.target).removeClass('selected-operation-key');
			} else if (item === 'control-key') {
				$(event.target).removeClass('selected-control-key');
			} else {
				$(event.target).removeClass('selected-key');
			}
		});
		
        // this is a performance boost where we prevent default 
        // event handling and propagation.
        // it also prevents touch event from rising click event
        event.preventDefault();
        event.stopPropagation();
        switch (id) {
            case "key0":
            case "key1":
            case "key2":
            case "key3":
            case "key4":
            case "key5":
            case "key6":
            case "key7":
            case "key8":
            case "key9":
            case "keyDecimalPoint":
                calc.Display.enterDigit(key);
                break;
            case "keyC":
                calc.Display.clearDisplay();
                break;
            case "keyCe":
                calc.Display.clearError();
                break;
            case "keyAdd":
                calc.Display.setOperator("+");
                break;
            case "keySubtract":
                calc.Display.setOperator("-");
                break;
            case "keyMultiply":
                calc.Display.setOperator("*");
                break;
            case "keyDivide":
                calc.Display.setOperator("/");
                break;
            case "keyEquals":
                calc.Display.setOperator("=");
                break;
            case "keyPercent":
                calc.Display.setPercent();
                break;
            case "keyPlusMinus":
                calc.Display.reverseSign();
                break;
        }
        return false;
    })
	;
}
