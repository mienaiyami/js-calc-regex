const input = document.querySelector("#displayInput");
input.value = "";
const Zero = $("#calc-zero");
const One = $("#calc-one");
const Two = $("#calc-two");
const Three = $("#calc-three");
const Four = $("#calc-four");
const Five = $("#calc-five");
const Six = $("#calc-six");
const Seven = $("#calc-seven");
const Eight = $("#calc-eight");
const Nine = $("#calc-nine");
const Plus = $("#calc-plus");
const Minus = $("#calc-minus");
const Div = $("#calc-divide");
const Mult = $("#calc-multiply");
const Dec = $("#calc-decimal");
const Del = $("#calc-del");
const Reset = $("#calc-reset");
const Enter = $("#calc-enter");

const solArray = [];

const numKey = [Zero, One, Two, Three, Four, Five, Six, Seven, Eight, Nine];

const doCalc = () => {
    let calc = 0;
    let rawValue = input.value;
    let numValue = rawValue
        .split(/\,/g)
        .join("")
        .split(/(\+|\-|\*|\/)/g)
        .filter(function (value, index, arr) {
            if (!/(\+|\-|\*|\/|\,)/g.test(value)) {
                return value;
            }
        });
    let operations = rawValue
        .match(/(\+|\-|\*|\/)/g)
        .filter(function (value, index, arr) {
            return value != "";
        });
    calc = parseFloat(numValue[0]);
    for (let i = 1; i < numValue.length; i++) {
        switch (operations[i - 1]) {
            case "+":
                calc += parseFloat(numValue[i]);
                break;
            case "-":
                calc -= parseFloat(numValue[i]);
                break;
            case "*":
                calc *= parseFloat(numValue[i]);
                break;
            case "/":
                calc /= parseFloat(numValue[i]);
        }
    }
    calc = calc.toString();
    input.value = calc;
    console.log(numValue, operations, calc);
};
const addToInput = (i, pos) => {
    let x = input.value;
    let regex = /(\+|\-|\*|\/|\.)/g;
    if (i === "+" || i === "-" || i === "*" || i === "/" || i === ".") {
        if (x.includes(".")) return;
        if (regex.test(x.charAt(x.length - 1))) {
            input.value = x.substring(0, x.length - 1) + i;
            return;
        }
    }
    if (x == "" && /(\+|\*|\/|\.)/g.test(i)) {
        return;
    }
    input.setSelectionRange(pos, pos);
    input.value = x + i;
};
const btnClicks = () => {
    numKey.forEach((e) => {
        e.on("click", () => {
            addToInput(e.attr("data-value"));
        });
    });
    Dec.on("click", () => {
        addToInput(".");
    });
    Plus.on("click", () => {
        addToInput("+");
    });
    Minus.on("click", () => {
        addToInput("-");
    });
    Div.on("click", () => {
        addToInput("/");
    });
    Mult.on("click", () => {
        addToInput("*");
    });
    Del.on("click", () => {
        let x = input.value;
        input.value = x.substring(0, x.length - 1);
    });
    Reset.on("click", () => {
        input.value = "";
    });
    Enter.on("click", () => {
        doCalc();
    });
};
btnClicks();
input.oninput = () => {
    let x = input.value;
    let regex = /([^0-9])/g;
    if (regex.test(x)) {
        input.value = x.split(regex).join("");
    }
};
// $("#displayInput").keypress((e) => {
//     e.preventDefault();
// });
const keyClicks = (e) => {
    let pos = input.selectionStart || "end";
    console.log(pos);
    if (e.key == "Backspace") {
        Del.click();
        return;
    }
    if (e.key == "Enter") {
        if (
            /(\*|\/|\-|\+|\.)/g.test(
                input.value.substring(0, input.value.length - 1)
            )
        ) {
            Enter.click();
            return;
        }
        return;
    }
    if (/(?=^[F1-F12]|0)(?=([0-9]|\*|\/|\-|\+|\.|\,))/g.test(e.key)) {
        console.log(e.key);
        addToInput(e.key, pos);
        return;
    }
    let regex =
        /([a-z]|\`|\~|\!|\@|\#|\$|\%|\^|\&|\_|\[|\]|\{|\}|\'|\"|\;|\:|\<|\>|\?|\=|\\)/g;
    if (regex.test(e.key)) {
        return;
    }
};

document.onkeydown = (e) => {
    if (document.activeElement !== input) {
        keyClicks(e);
    }
};
input.onkeypress = (e) => {
    e.preventDefault();
    keyClicks(e);
};
