const submit = document.getElementById('searchButton');
const datadiv = document.getElementById('data');
submit.addEventListener('click', () => {
    let modelCheckboxes = document.getElementsByName('model');
    let conditionCheckboxes = document.getElementsByName('conditions');
    let colorCheckboxes = document.getElementsByName('color');
    let fuelCheckboxes = document.getElementsByName('fuel');
    let typeCheckboxes = document.getElementsByName('type');
    let transmissionCheckboxes = document.getElementsByName('transmission');
    let driveCheckboxes = document.getElementsByName('drive');

    let make = document.getElementById('make').value;
    let models = [];
    let conditions = [];
    let colors = [];
    let fuels = [];
    let types = [];
    let transmissions = [];
    let drives = [];
    let years = [document.getElementById('yearStartInput').value, document.getElementById('yearEndInput').value];
    let prices = [document.getElementById('priceStartInput').value, document.getElementById('priceEndInput').value];
    modelCheckboxes.forEach(element => {
        if (element.checked) {
            models.push(element.value);
        }
    });
    conditionCheckboxes.forEach(element => {
        if (element.checked) {
            conditions.push(element.value);
        }
    });
    colorCheckboxes.forEach(element => {
        if (element.checked) {
            colors.push(element.value);
        }
    });
    fuelCheckboxes.forEach(element => {
        if (element.checked) {
            fuels.push(element.value);
        }
    });
    typeCheckboxes.forEach(element => {
        if (element.checked) {
            types.push(element.value);
        }
    });
    transmissionCheckboxes.forEach(element => {
        if (element.checked) {
            transmissions.push(element.value);
        }
    });
    driveCheckboxes.forEach(element => {
        if (element.checked) {
            drives.push(element.value);
        }
    });
    fetch('/search', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            make: make,
            models: models,
            years: years,
            prices: prices,
            conditions: conditions,
            colors: colors,
            fuels: fuels,
            types: types,
            transmissions: transmissions,
            drives: drives
        }),
    })
        .then(result => result.text())
        .then(result => datadiv.innerHTML = result)
        .catch((err) => {
            console.log(err);
        });
})

const modelsButton = document.getElementById('dropdownMenuButtonModel');
const conditionsButton = document.getElementById('dropdownMenuButtonCondition');
const colorsButton = document.getElementById('dropdownMenuButtonColor');
const fuelsButton = document.getElementById('dropdownMenuButtonFuel');
const typesButton = document.getElementById('dropdownMenuButtonType');
const transmissionsButton = document.getElementById('dropdownMenuButtonTransmission');
const drivesButton = document.getElementById('dropdownMenuButtonDrive');

let models = [];
let conditions = [];
let colors = [];
let fuels = [];
let types = [];
let transmissions = [];
let drives = [];

function showSelected(itemName, type){
    switch(type){
        case 'model':
            if(models.includes(itemName)){
                models.splice(models.indexOf(itemName), 1);
            }else{
                models.push(itemName);
            }
            break;
        case 'condition':
            if(conditions.includes(itemName)){
                conditions.splice(conditions.indexOf(itemName), 1);
            }else{
                conditions.push(itemName);
            }
            break;
        case 'color':
            if(colors.includes(itemName)){
                colors.splice(colors.indexOf(itemName), 1);
            }else{
                colors.push(itemName);
            }
            break;
        case 'fuel':
            if(fuels.includes(itemName)){
                fuels.splice(fuels.indexOf(itemName), 1);
            }else{
                fuels.push(itemName);
            }
            break;
        case 'type':
            if(types.includes(itemName)){
                types.splice(types.indexOf(itemName), 1);
            }else{
                types.push(itemName);
            }
            break;
        case 'transmission':
            if(transmissions.includes(itemName)){
                transmissions.splice(transmissions.indexOf(itemName), 1);
            }else{
                transmissions.push(itemName);
            }
            break;
        case 'drive':
            if(drives.includes(itemName)){
                drives.splice(drives.indexOf(itemName), 1);
            }else{
                drives.push(itemName);
            }
            break;
    }

    if(models.length > 0){
        modelsButton.innerHTML = '';
        for(let i = 0; i < models.length; i++){
            if(i == models.length-1){
                modelsButton.innerHTML += models[i];
            }else{
                modelsButton.innerHTML += models[i] + ', ';
            }
        }
    }else{
        modelsButton.innerHTML = '- Válassz -';
    }
    if(conditions.length > 0){
        conditionsButton.innerHTML = '';
        for(let i = 0; i < conditions.length; i++){
            if(i == conditions.length-1){
                conditionsButton.innerHTML += conditions[i];
            }else{
                conditionsButton.innerHTML += conditions[i] + ', ';
            }
        }
    }else{
        conditionsButton.innerHTML = '- Válassz -';
    }
    if(colors.length > 0){
        colorsButton.innerHTML = '';
        for(let i = 0; i < colors.length; i++){
            if(i == colors.length-1){
                colorsButton.innerHTML += colors[i];
            }else{
                colorsButton.innerHTML += colors[i] + ', ';
            }
        }
    }else{
        colorsButton.innerHTML = '- Válassz -';
    }
    if(fuels.length > 0){
        fuelsButton.innerHTML = '';
        for(let i = 0; i < fuels.length; i++){
            if(i == fuels.length-1){
                fuelsButton.innerHTML += fuels[i];
            }else{
                fuelsButton.innerHTML += fuels[i] + ', ';
            }
        }
    }else{
        fuelsButton.innerHTML = '- Válassz -';
    }
    if(types.length > 0){
        typesButton.innerHTML = '';
        for(let i = 0; i < types.length; i++){
            if(i == types.length-1){
                typesButton.innerHTML += types[i];
            }else{
                typesButton.innerHTML += types[i] + ', ';
            }
        }
    }else{
        typesButton.innerHTML = '- Válassz -';
    }
    if(transmissions.length > 0){
        transmissionsButton.innerHTML = '';
        for(let i = 0; i < transmissions.length; i++){
            if(i == transmissions.length-1){
                transmissionsButton.innerHTML += transmissions[i];
            }else{
                transmissionsButton.innerHTML += transmissions[i] + ', ';
            }
        }
    }else{
        transmissionsButton.innerHTML = '- Válassz -';
    }
    if(drives.length > 0){
        drivesButton.innerHTML = '';
        for(let i = 0; i < drives.length; i++){
            if(i == drives.length-1){
                drivesButton.innerHTML += drives[i];
            }else{
                drivesButton.innerHTML += drives[i] + ', ';
            }
        }
    }else{
        drivesButton.innerHTML = '- Válassz -';
    }
}

function ClearModels(){
    models = [];
    modelsButton.innerHTML = '- Válassz -';
}