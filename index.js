/*

JS CALC USING REGEX
I DONT KNOW WHY I DID THIS 

*/

const input = document.querySelector("#displayInput");
input.value = "";
const numBtn = $(".num-btn");
const operatorBtn = $(".ope-btn");

const Del = $("#calc-del");
const Reset = $("#calc-reset");
const Enter = $("#calc-enter");
$(".header .showHide").on("click", () => {
    $(".history").addClass("open");
    $(".history").removeClass("close");
});
$(".history .closeBtn").on("click", () => {
    $(".history").addClass("close");
    input.focus();
    $(".history").removeClass("open");
});
const updateHistory = (history) => {
    history.reverse();
    let list = "";
    history.forEach((e) => {
        list += `<li>${e}</li>`;
    });
    $(".history .list ul").html(list);
};
const solArray = [];

const testBracketAndSolve = (rawValue) => {
    let calc;
    if (/(\(|\))/gi.test(rawValue)) {
        rawValue = rawValue.replace(")(", ")*(");
        rawValue = rawValue.replace(/(\((?<=(\d).))/gi, "*(");
        while (/(\(|\))/gi.test(rawValue)) {
            let endBracket = rawValue.indexOf(")");
            let startBracket = rawValue.substr(0, endBracket).lastIndexOf("(");
            let bracketed = rawValue.substring(startBracket + 1, endBracket);
            // console.log("ddd", bracketed);
            let bracketSolved = solve(bracketed);
            rawValue =
                rawValue.slice(0, startBracket) +
                bracketSolved +
                rawValue.slice(endBracket + 1, rawValue.length);
            // console.log("ddddd", rawValue);
        }
        let calc = solve(rawValue);
        return calc;
    } else return solve(rawValue);
};
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
    // console.log(rawValue, numValues);
    if (numValues.length > 1) {
        let operations = rawValue
            .match(/(\+|\*|\/|\^|\!|\%)/gi)
            .filter(function (value, index, arr) {
                return value != "";
            });
        // console.log(operations);
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
                    if (parseFloat(num1) > 140) return Infinity;
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
                    operatorCaret = operations.indexOf("^");
                if (operatorCaret == -1)
                    operatorCaret = operations.indexOf("%");
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
                // console.log(numValues, operations);
            }
        })();
    }
    calc = numValues[0];
    calc = calc.toString();
    return calc;
};
const history = [];
const doCalc = () => {
    let calc = 0;
    let rawValue = input.value.replace(/ +/gi, "");
    if (rawValue.charAt(0) === "-") rawValue = 0 + rawValue;
    rawValue = rawValue.replace(/-/gi, "+-").replace(/\!/gi, "!0");
    if (/(\+|\-|\*|\/|\.|\^|\%)/gi.test(rawValue[rawValue.length - 1]))
        rawValue = rawValue.substr(0, rawValue.length - 1);
    if (
        rawValue.includes("!") &&
        rawValue[rawValue.length - 2] !== "!" &&
        !/!0(?=(\+|\-|\*|\/|\.|\^|\%|\(|\)))/gi.test(rawValue)
    )
        return;
    // console.log("aaa", rawValue);
    calc = parseFloat(testBracketAndSolve(rawValue));
    if (calc == undefined || isNaN(calc)) calc = 0;
    history.push(input.value + " = " + calc);
    updateHistory(history);
    input.value = calc;
    // console.log("calc", calc);
};
const addToInput = (i, pos) => {
    let x = input.value;
    let regex = /(\+|\-|\*|\/|\.|\^|\%|\!)/gi;
    const countBracket = (string, type) => {
        let count = 0;
        for (let i = 0; i < x.length; i++) {
            if (string[i] === type) count++;
        }
        return count;
    };
    if (
        i === ")" &&
        countBracket(x, "(") < countBracket(x.slice(0, pos), ")") + 1
    ) {
        return;
    }
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
        // console.log(pos);
        if (regex.test(x.charAt(pos - 1)) && x.charAt(pos - 1) !== "!") {
            if (x.length === 1) return;
            input.value = x.substring(0, x.length - 1) + i;
            return;
        }
    }
    // console.log(regex.test(x[0]));
    if (x == "" && /(\+|\*|\/|\.|\^|\%|\!)/gi.test(i)) {
        // console.log("f");
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
        if (/(\*|\/|\-|\+|\.|\^|\!|\%|(\((.*)\)))/gi.test(input.value)) {
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
document.onreadystatechange = () => {
    input.focus();
};
document.onmousedown = (e) => {
    input.focus();
};
document.onkeydown = (e) => {
    if (e.key === "Escape") {
        return $(".history .closeBtn").click();
    }
    if (document.activeElement !== input) {
        keyClicks(e);
    }
};
input.ondrag = (e) => {
    e.preventDefault();
};
input.onkeypress = (e) => {
    e.preventDefault();
    keyClicks(e);
};

input.onblur = () => {
    if ($(".history").hasClass("close")) input.focus();
};
