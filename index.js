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
btnClicks();
function btnClicks() {
    for (let i = 0; i < numKey.length; i++) {
        numKey[i].on("click", () => {
            addToInput(i);
        });
    }
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
}
function addToInput(i, pos) {
    let x = input.value;
    let abc = /(\+|\-|\*|\/|\.)/g;
    if (i == "+" || i == "-" || i == "*" || i == "/" || i == ".") {
        if (abc.test(x.charAt(x.length - 1))) {
            input.value = x.substring(0, x.length - 1) + i;
            return;
        }
    }
    if (x == "" && /(\+|\*|\/|\.)/g.test(i)) {
        return;
    }
    input.setSelectionRange(pos, pos);
    input.value = x + i;
}

function doCalc() {
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
    //localestring
    input.value = calc;
    console.log(numValue, operations, calc);
}
input.oninput = () => {
    let x = input.value;
    let abc = /([^0-9])/g;
    if (abc.test(x)) {
        input.value = x.split(abc).join("");
    }
};
document.onkeydown = (e) => {
    keyClicks(e);
};
input.onkeypress = (e) => {
    e.preventDefault();
    keyClicks(e);
};
// $("#displayInput").keypress((e) => {
//     e.preventDefault();
// });
function keyClicks(e) {
    e.preventDefault();
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
    let abc = /([a-z]|\`|\~|\!|\@|\#|\$|\%|\^|\&|\_|\[|\]|\{|\}|\'|\"|\;|\:|\<|\>|\?|\=|\\)/g;
    if (abc.test(e.key)) {
        return;
    }
}
