///////////////////Évjárat szűrés
const yearStartRange = document.getElementById("yearStartRange");
const yearEndRange = document.getElementById("yearEndRange");

const yearStartInput = document.getElementById("yearStartInput");
const yearEndInput = document.getElementById("yearEndInput");
const yearStartText = document.getElementById("yearStartText");

yearStartRange.addEventListener('change', function () {
    if (Number(yearStartRange.value) > Number(yearEndInput.value)) {
        yearStartRange.value = yearEndInput.value;
    }
    yearStartInput.value = yearStartRange.value;
    if ((yearStartInput.value).slice(-3) == '000') {
        yearStartText.innerHTML = " -től";
    } else {
        if ((yearStartInput.value).slice(-1) == '9' || (yearStartInput.value).slice(-1) == '7' || (yearStartInput.value).slice(-1) == '5' || (yearStartInput.value).slice(-1) == '4' || (yearStartInput.value).slice(-1) == '2' || (yearStartInput.value).slice(-1) == '1') {
            yearStartText.innerHTML = " -től";
        } else {
            if ((yearStartInput.value).slice(-1) == '0') {
                if ((yearStartInput.value).slice(-2) == '00' || (yearStartInput.value).slice(-2) == '20' || (yearStartInput.value).slice(-2) == '30' || (yearStartInput.value).slice(-2) == '60' || (yearStartInput.value).slice(-2) == '80') {
                    yearStartText.innerHTML = " -tól";
                } else {
                    yearStartText.innerHTML = " -től";
                }
            } else {
                yearStartText.innerHTML = " -tól";
            }
        }
    }
});
yearEndRange.addEventListener('change', function () {
    if (Number(yearEndRange.value) < Number(yearStartInput.value)) {
        yearEndRange.value = yearStartInput.value;
    }
    yearEndInput.value = yearEndRange.value;
});
yearStartInput.addEventListener('change', function () {
    if (Number(yearStartInput.value) > Number(yearEndInput.value)) {
        yearStartInput.value = yearEndInput.value;
    }
    if(Number(yearStartInput.value) > Number(yearStartInput.max)){
        yearStartInput.value = yearStartInput.max;
    }
    if(Number(yearStartInput.value) < Number(yearStartInput.min)){
        yearStartInput.value = yearStartInput.min;
    }
    yearStartRange.value = yearStartInput.value;
});
yearEndInput.addEventListener('change', function () {
    if (Number(yearEndInput.value) < Number(yearStartInput.value)) {
        yearEndInput.value = yearStartInput.value;
    }
    if(Number(yearEndInput.value) > Number(yearEndInput.max)){
        yearEndInput.value = yearEndInput.max;
    }
    if(Number(yearEndInput.value) < Number(yearEndInput.min)){
        yearEndInput.value = yearEndInput.min;
    }
    yearEndRange.value = yearEndInput.value;
});


/////////////////////Ár szűrés
const priceStartRange = document.getElementById("priceStartRange");
const priceEndRange = document.getElementById("priceEndRange");
const priceStartInput = document.getElementById("priceStartInput");
const priceEndInput = document.getElementById("priceEndInput");

priceStartRange.addEventListener('change', function () {
    if (Number(priceStartRange.value) > Number(priceEndInput.value)) {
        priceStartRange.value = priceEndInput.value;
    }
    priceStartInput.value = priceStartRange.value;
});
priceEndRange.addEventListener('change', function () {
    if (Number(priceEndRange.value) < Number(priceStartInput.value)) {
        priceEndRange.value = priceStartInput.value;
    }
    priceEndInput.value = priceEndRange.value;
});
priceStartInput.addEventListener('change', function () {
    if (Number(priceStartInput.value) > Number(priceEndInput.value)) {
        priceStartInput.value = priceEndInput.value;
    }
    if(Number(priceStartInput.value) > Number(priceStartInput.max)){
        priceStartInput.value = priceStartInput.max;
    }
    if(Number(priceStartInput.value) < Number(priceStartInput.min)){
        priceStartInput.value = priceStartInput.min;
    }
    priceStartRange.value = priceStartInput.value;
});
priceEndInput.addEventListener('change', function () {
    if (Number(priceEndInput.value) < Number(priceStartInput.value)) {
        priceEndInput.value = priceStartInput.value;
    }
    if(Number(priceEndInput.value) > Number(priceEndInput.max)){
        priceEndInput.value = priceEndInput.max;
    }
    if(Number(priceEndInput.value) < Number(priceEndInput.min)){
        priceEndInput.value = priceEndInput.min;
    }
    priceEndRange.value = priceEndInput.value;
});