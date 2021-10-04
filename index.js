const input = document.querySelector("#displayInput");
input.value = "";
const numBtn = $(".num-btn");
const operatorBtn = $(".ope-btn");

const Del = $("#calc-del");
const Reset = $("#calc-reset");
const Enter = $("#calc-enter");

const solArray = [];

const solve = (rawValue) => {
    let numValues = rawValue
        .split(/\,/gi)
        .join("")
        .split(/(\+|\*|\/|\^|\!|\%)/gi)
        .filter(function (value, index, arr) {
            if (!/(\+|\*|\/|\,|\^|\!|\%)/gi.test(value)) {
                return value;
            }
        });
    console.log(rawValue, numValues);
    if (numValues.length > 1) {
        let operations = rawValue
            .match(/(\+|\*|\/|\^|\!|\%)/gi)
            .filter(function (value, index, arr) {
                return value != "";
            });
        console.log(operations);
        const doBasicCalc = (num1, num2, operator) => {
            switch (operator) {
                case "+":
                    return parseFloat(num1) + parseFloat(num2);
                case "-":
                    return parseFloat(num1) - parseFloat(num2);
                case "*":
                    return parseFloat(num1) * parseFloat(num2);
                case "/":
                    return parseFloat(num1) / parseFloat(num2);
                case "^":
                    return parseFloat(num1) ** parseFloat(num2);
                case "%":
                    return (parseFloat(num1) * parseFloat(num2)) / 100;
                case "!":
                    if (parseFloat(num1) < 0) return "invalid input";
                    if (parseFloat(num1) === 0) return 1;
                    let fact = 1;
                    for (let i = 1; i <= parseFloat(num1); i++) {
                        fact *= i;
                    }
                    return fact;
                default:
                    break;
            }
        };
        (function bodmas() {
            while (operations.length > 0) {
                let operatorCaret = operations.indexOf("!");
                if (operatorCaret == -1)
                    operatorCaret = operations.indexOf("%");
                if (operatorCaret == -1)
                    operatorCaret = operations.indexOf("^");
                if (operatorCaret == -1)
                    operatorCaret = operations.indexOf("/");
                if (operatorCaret == -1)
                    operatorCaret = operations.indexOf("*");
                if (operatorCaret == -1)
                    operatorCaret = operations.indexOf("+");
                if (operatorCaret == -1)
                    operatorCaret = operations.indexOf("-");
                let num1Caret = operatorCaret;
                let num2Caret = operatorCaret + 1;
                let solved = doBasicCalc(
                    numValues[num1Caret],
                    numValues[num2Caret],
                    operations[operatorCaret]
                );
                if (solved === "invalid input") break;
                numValues = [
                    ...numValues.slice(0, num1Caret),
                    solved,
                    ...numValues.slice(num2Caret + 1, numValues.length),
                ];
                operations =
                    operations.length > 0
                        ? [
                              ...operations.slice(0, operatorCaret),
                              ...operations.slice(
                                  operatorCaret + 1,
                                  operations.length
                              ),
                          ]
                        : [];
                console.log(numValues, operations);
            }
        })();
    }
    calc = numValues[0];
    calc = calc.toString();
    return calc;
};

const doCalc = () => {
    let calc = 0;
    let rawValue = input.value.replace(/ +/gi, "");
    if (rawValue.charAt(0) === "-") rawValue = 0 + rawValue;
    rawValue = rawValue.replace(/-/gi, "+-").replace(/\!/gi, "!0");
    if (/(\+|\-|\*|\/|\.|\^|\%)/gi.test(rawValue[rawValue.length - 1]))
        rawValue = rawValue.substr(0, rawValue.length - 1);
    if (
        rawValue.includes("!") &&
        !/!0(?=(\+|\-|\*|\/|\.|\^|\%))/gi.test(rawValue) &&
        rawValue[rawValue.length - 2] !== "!"
    )
        return;
    if (/(\(|\))/gi.test(rawValue)) {
        while (/(\(|\))/gi.test(rawValue)) {
            let startBracket = rawValue.indexOf("(");
            let endBracket = rawValue.indexOf(")");
            let bracketed = rawValue.slice(startBracket + 1, endBracket);
            let bracketSolved = solve(
                rawValue.slice(startBracket + 1, endBracket)
            );
            rawValue =
                rawValue.slice(0, startBracket) +
                bracketSolved +
                rawValue.slice(endBracket + 1, rawValue.length);
            console.log("ddddd", bracketed, rawValue);
        }
    }
    calc = solve(rawValue);
    input.value = calc;
    console.log("calc", calc);
};
const addToInput = (i, pos) => {
    let x = input.value;
    let regex = /(\+|\-|\*|\/|\.|\^|\%|\!)/gi;
    if (
        i === "+" ||
        i === "-" ||
        i === "*" ||
        i === "/" ||
        i === "." ||
        i === "^" ||
        i === "%" ||
        i === "!"
    ) {
        if (x.includes(".") && i === ".") return;
        if (regex.test(x.charAt(pos))) {
            //!fix
            if (x.length === 1) return;
            input.value = x.substring(0, x.length - 1) + i;
            return;
        }
    }
    console.log(regex.test(x[0]));
    if (x == "" && /(\+|\*|\/|\.|\^|\%|\!)/gi.test(i)) {
        console.log("f");
        return;
    }
    input.setSelectionRange(pos, pos);
    input.value = x.substr(0, pos) + i + x.substr(pos, x.length);
    input.setSelectionRange(pos + 1, pos + 1);
};
const btnClicks = () => {
    numBtn.on("click", (e) => {
        addToInput($(e.target).attr("data-value"), input.selectionStart);
    });

    operatorBtn.on("click", (e) => {
        addToInput($(e.target).attr("data-value"), input.selectionStart);
    });

    Del.on("click", () => {
        let x = input.value;
        input.value = x.substring(0, x.length - 1);
    });
    Reset.on("click", () => {
        input.value = "";
    });
    Enter.on("click", () => {
        if (/(\*|\/|\-|\+|\.|\^|\!|\%)/gi.test(input.value)) {
            doCalc();
        }
    });
};
btnClicks();
input.oninput = () => {
    let x = input.value;
    let regex = /(?!(\d|(\*|\-|\+|\.|\,|\^|\(|\)|\%|\!)))./g;
    if (regex.test(x)) {
        input.value = x.replace(regex, "");
    }
};
const keyClicks = (e) => {
    if (e.key == "Backspace") {
        Del.click();
        return;
    }
    if (input.value.length >= 25) return;
    if (e.ctrlKey && e.key === "a") {
        input.select();
        return;
    }
    let pos = input.selectionStart ?? input.value.length;
    if (e.key == "Enter" || e.key === "=") {
        Enter.click();
        return;
    }
    if (e.key.length === 1) {
        if (/((?<!f)([0-9]|\*|\/|\-|\+|\.|\,|\^|\(|\)|\%|\!))/gi.test(e.key)) {
            if (
                input.selectionEnd - input.selectionStart ===
                input.value.length
            )
                input.value = "";
            addToInput(e.key, pos);
            return;
        }
    }
    // let regex =
    //     /([a-z]|\`|\~|\!|\@|\#|\$|\%|\^|\&|\_|\[|\]|\{|\}|\'|\"|\;|\:|\<|\>|\?|\\)/gi;
    // if (regex.test(e.key)) {
    //     return;
    // }
};

document.onmousedown = (e) => {
    input.focus();
};
document.onkeydown = (e) => {
    input.focus();
    if (document.activeElement !== input) {
        keyClicks(e);
    }
};
input.onkeypress = (e) => {
    e.preventDefault();
    keyClicks(e);
};

input.onblur = () => {
    input.focus();
};
