const submit = document.getElementById('searchButton');
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
    let years  = [document.getElementById('yearStartInput').value, document.getElementById('yearEndInput').value];
    let prices  = [document.getElementById('priceStartInput').value, document.getElementById('priceEndInput').value];
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
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            make: make,
            models: models,
            years : years,
            prices : prices,
            conditions: conditions,
            colors: colors,
            fuels: fuels,
            types: types,
            transmissions: transmissions,
            drives: drives
        }),
    })
        .catch((err) => {
            console.log(err);
        });
})
