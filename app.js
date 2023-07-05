// Sélecteurs
const labels = document.querySelectorAll(".radio-group label");
const inputs = document.querySelectorAll(".radio-group input");
//SEARCH INPUT
const searchInput = document.querySelector("#search");
const tbody = document.querySelector("tbody");
const thead = document.querySelector("thead");
const table = document.querySelector("table");
const resultMsg = document.querySelector("#search-result");

// Variables
let city = "goussainville";

labels.forEach(label => {
    label.addEventListener("click", handleSector);

    function handleSector() {
        inputs.forEach(input => {
            setTimeout(() => {

                if (input.checked) {
                    if (label.getAttribute("id") === "fontenay") {
                        city = "fontenay";
                    } else if (label.getAttribute("id") === "gouss") {
                        city = "goussainville";
                    } else if (label.getAttribute("id") === "thillay") {
                        city = "thillay";
                    } else if (label.getAttribute("id") === "louvres") {
                        city = "louvres";
                    }
                    const labelIndex = input.getAttribute("data-index");
                    labels.forEach(label => { label.style.background = "none"; label.style.color = "black"; });
                    labels[labelIndex].style.background = "linear-gradient(to right, #0f0c29, #302b63, #24243e)";
                    labels[labelIndex].style.color = "white";

                    if(searchInput.value.length >= 3) {
                        filterData(city);
                    } else {
                        thead.textContent = "";
                        tbody.textContent = "";
                        resultMsg.textContent = "";
                        table.style.opacity = "0";
                    }
                }
            }, 10);// Je mets un settimeout pour éviter de récupérer l'input check trop vite. Ca permet de valider le check et ensuite de le récupérer. Sinon ça exec trop vite.
        });

    }
});

searchInput.addEventListener("input", () => {filterData(city);});

async function filterData(cityName) {
    const searchedString = searchInput.value.toLowerCase();
    console.log(searchedString);
    if (searchedString.length >= 3){
        try {
            const response = await fetch('./data/'+ cityName +'.json');
            if (!response.ok) {
                throw new Error('Erreur lors du chargement du fichier JSON');
            }
            const data = await response.json();
            const result = data.filter(city => city.streetName.includes(searchedString));

            if(result.length){
                resultMsg.textContent = "Nombre de résultat : " + result.length;
                table.style.opacity = "1";
                thead.textContent = "";
                tbody.textContent = "";
                createTr(result);
            } else {
                clearTable();
            }
        } catch (error) {
            console.error('Une erreur s\'est produite lors du chargement du fichier JSON', error);
        }

    } else {
        clearTable();
    }
}

//FILL TABLE
function createTr(obj) {
// function createTr(streetInterval, street, sectorColor, negoName) {
    thead.insertAdjacentHTML("afterbegin", `
        <tr>
            <th>Interval</th>
            <th>Rue</th>
            <th>Ville</th>
            <th>Secteur</th>
            <th>Négociateur</th>
            <th>Google Map</th>
        </tr>
        `);
    obj.forEach(result => {



        tbody.insertAdjacentHTML("afterbegin", `
        <tr>
            <td>${result.streetInfo.interval}</td>
            <td>${result.streetName}</td>
            <td>${city}</td>
            <td id="sector-color" data-color="${result.streetInfo.sector}"></td>
            <td>${result.streetInfo.nego}</td>
            <td><a href="https://www.google.fr/maps/place/${result.streetName}+${city}" target="_blank">Visualiser</a></td>
        </tr>
        `);

        const changeSectorColor = document.querySelector("#sector-color");
        if (changeSectorColor.getAttribute("data-color") === "Vert") {
            changeSectorColor.style.background = "rgb(6, 163, 6)";
        } else if (changeSectorColor.getAttribute("data-color") === "Jaune") {
            changeSectorColor.style.background = "rgb(223, 223, 22)";
            changeSectorColor.style.color = "black";
        } else if (changeSectorColor.getAttribute("data-color") === "Rose") {
            changeSectorColor.style.background = "rgb(207, 144, 154)";
        } else if (changeSectorColor.getAttribute("data-color") === "Orange"){
            changeSectorColor.style.background = "orange";
        }
    });
}

function clearTable(){
    thead.textContent = "";
    tbody.textContent = "";
    resultMsg.textContent = "";
    table.style.opacity = "0";
}
