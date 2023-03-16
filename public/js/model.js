const make = document.getElementById("make");
const modelList = document.getElementById("modelList");
const dropDownButton = document.getElementById("dropdownMenuButtonModel");

function filterModels(modelsWithMake) {
    modelList.innerHTML = "";
    if (make.value == 'all') {
        dropDownButton.setAttribute("disabled", "disabled");
    } else {
        dropDownButton.removeAttribute("disabled");
        modelsWithMake.forEach(function (item) {
            if (item.id == make.value) {
                modelList.innerHTML += `<li>
            <span class="dropdown-item">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="`+item.modell+`" name="model" onchange="showSelected('`+item.modell+`', 'model')"/>
                    <label class="form-check-label">`+ item.modell + `</label>
                </div>
            </span>
        </li>`
            }
        });
    }
}