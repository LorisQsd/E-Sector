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
let cityJSON = "goussainville";
let city = "Goussainville";
const negos = {
    pinkSector: "José",
    greenSector: "Mélodie",
    orangeSector: "A attribuer",
    yellowSector: "Julian"
};

labels.forEach(label => {
    label.addEventListener("click", handleSector);

    function handleSector() {
        inputs.forEach(input => {
            setTimeout(() => {

                if (input.checked) {
                    if (label.getAttribute("id") === "fontenay") {
                        cityJSON = "fontenay";
                        city = "Fontenay-en-Parisis";
                    } else if (label.getAttribute("id") === "gouss") {
                        cityJSON = "goussainville";
                        city = "Goussainville";
                    } else if (label.getAttribute("id") === "thillay") {
                        cityJSON = "thillay";
                        city = "Le Thillay";
                    } else if (label.getAttribute("id") === "louvres") {
                        cityJSON = "louvres";
                        city = "Louvres";
                    }
                    const labelIndex = input.getAttribute("data-index");
                    labels.forEach(label => { label.classList.remove("active");});
                    // labels[labelIndex].style.background = "linear-gradient(to right, #0f0c29, #302b63, #24243e)";
                    // labels[labelIndex].style.color = "white";
                    labels[labelIndex].classList.add("active");

                    if(searchInput.value.length >= 3) {
                        filterData(cityJSON);
                    } else {
                        clearTable();
                    }
                }
            }, 10);// Je mets un settimeout pour éviter de récupérer l'input check trop vite. Ca permet de valider le check et ensuite de le récupérer. Sinon ça exec trop vite.
        });

    }
});

searchInput.addEventListener("input", () => {filterData(cityJSON);});

async function filterData(cityName) {
    const searchedString = searchInput.value.toLowerCase();
    if (searchedString.length >= 3){
        try {
            const response = await fetch('./data/'+ cityName +'.json');
            if (!response.ok) {
                throw new Error('Erreur lors du chargement du fichier JSON');
            }
            const data = await response.json();
            const result = data.filter(city => city.streetName.includes(searchedString));

            if(result.length){
                resultMsg.textContent = "Nombre de" + result.length > 1 ? "résultats:" : "résultat:" + result.length;
                resultMsg.textContent = `Nombre de ${result.length > 1 ? "résultats" : "résultat"}: ${result.length}`;
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
    const isInterval = obj.map(el => el.streetInfo.interval).join("").length;
    // Je map à travers les interval de mon objet. Je rassemble tout et je compte le nombre de caractère.
    // Permet de vérifier s'il y a au moins un interval pour afficher ou non <th> et <td>

    thead.insertAdjacentHTML("afterbegin", `
        <tr>
            ${isInterval ? `<th class="th--interval">Interval</th>`: ""}
            <th class="th--street">Rue</th>
            <th class="th--city">Ville</th>
            <th class="th--sector">Secteur</th>
            <th class="th--nego">Négociateur</th>
            <th class="th--gmap">Google Map</th>
        </tr>
        `);
    obj.forEach(result => {
        tbody.insertAdjacentHTML("afterbegin", `
        <tr>
            ${isInterval ? `<td class="td--interval">${result.streetInfo.interval}</td>`: ""}
            <td class="td--street">${result.streetName}</td>
            <td class="td--interval">${city}</td>
            <td class="td--sector" id="sector-color" data-color="${result.streetInfo.sector.toLowerCase()}"></td>
            <td class="td--nego">${negos[result.streetInfo.nego]}</td>
            <td><a title="Cliquez pour voir la géolocalisation" class="td--gmap" href="https://www.google.fr/maps/place/${result.streetName}+${city}" target="_blank"><i class="bi bi-geo-alt-fill"></i> Visualiser</a></td>
        </tr>
        `);
    });
}

function clearTable(){
    thead.textContent = "";
    tbody.textContent = "";
    resultMsg.textContent = "";
    table.style.opacity = "0";
}

document.querySelector("form").addEventListener("submit", function (e) {e.preventDefault();});
