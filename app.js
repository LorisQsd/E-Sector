//RADIO BUTTONS
const labels = document.querySelectorAll(".radio-group label");
const inputs = document.querySelectorAll(".radio-group input");
let dataArray = goussainville;
let city = "Goussainville";

labels.forEach(label => {
    label.addEventListener("click", handleSector)

    function handleSector(e) {
        inputs.forEach(input => {
            setTimeout(() => {

                if (input.checked) {
                    if (label.getAttribute("id") === "fontenay") {
                        dataArray = fontenay
                        city = "Fontenay-en-Parisis"
                    } else if (label.getAttribute("id") === "gouss") {
                        dataArray = goussainville
                        city = "Goussainville"
                    } else if (label.getAttribute("id") === "thillay") {
                        dataArray = thillay
                        city = "Le Thillay"
                    } else if (label.getAttribute("id") === "louvres") {
                        dataArray = louvres
                        city = "Louvres"
                    }
                    const labelIndex = input.getAttribute("data-index")
                    labels.forEach(label => { label.style.background = "none"; label.style.color = "black" })
                    labels[labelIndex].style.background = "linear-gradient(to right, #0f0c29, #302b63, #24243e)"
                    labels[labelIndex].style.color = "white"

                    filterData();
                }
            }, 10)// Je mets un settimeout pour éviter de récupérer l'input check trop vite. Ca permet de valider le check et ensuite de le récupérer. Sinon ça exec trop vite.
        })

    }
})

//SEARCH INPUT
const searchInput = document.querySelector("#search");
const tbody = document.querySelector("tbody");
const thead = document.querySelector("thead")
const table = document.querySelector("table")
const resultMsg = document.querySelector("#search-result");

searchInput.addEventListener("input", filterData)
let streetInterval = [];
let street = [];
let sectorColor = [];
let negoName = [];

function filterData() {
    const searchedString = searchInput.value.toLowerCase()
    if (searchInput.value.length >= 3) {
        for (i = 0; i < dataArray.length; i++) {
            if (dataArray[i].streetName.match(searchedString)) {
                streetInterval.push(dataArray[i].streetInfo.interval)
                street.push(dataArray[i].streetName)
                sectorColor.push(dataArray[i].streetInfo.sector)
                negoName.push(dataArray[i].streetInfo.nego)
            }
        }
        
        if (street.length) {
            resultMsg.textContent = "Nombre de résultat : " + streetInterval.length;
            table.style.opacity = "1";
            thead.textContent = "";
            tbody.textContent = "";
            createTr(streetInterval, street, sectorColor, negoName);
        } else {
            resultMsg.textContent = "Aucun résultat"
            table.style.opacity = "0";
            thead.textContent = "";
            tbody.textContent = ""
        }
    
        streetInterval = [];
        street = [];
        sectorColor = [];
        negoName = [];
    
    } else {
        thead.textContent = "";
        tbody.textContent = "";
        resultMsg.textContent = "";
        table.style.opacity = "0";
    }
}

//FILL TABLE
function createTr(streetInterval, street, sectorColor, negoName) {
    thead.insertAdjacentHTML("afterbegin", `
        <tr>
            <th>Interval</th>
            <th>Rue</th>
            <th>Ville</th>
            <th>Secteur</th>
            <th>Négociateur</th>
            <th>Google Map</th>
        </tr>
        `)

    for (i = 0; i<street.length; i++){
        tbody.insertAdjacentHTML("afterbegin", `
        <tr>
            <td>${streetInterval[i]}</td>
            <td>${street[i]}</td>
            <td>${city}</td>
            <td id="sector-color">${sectorColor[i]}</td>
            <td>${negoName[i]}</td>
            <td><a href="https://www.google.fr/maps/place/${street[i]}+${city}" target="_blank">Visualiser</a></td>
        </tr>
        `)

        const changeSectorColor = document.querySelector("#sector-color")
        if (sectorColor[i] === "Vert") {
            changeSectorColor.style.background = "rgb(6, 163, 6)"
        } else if (sectorColor[i] === "Jaune") {
            changeSectorColor.style.background = "rgb(223, 223, 22)"
            changeSectorColor.style.color = "black"
        } else if (sectorColor[i] === "Rose") {
            changeSectorColor.style.background = "rgb(207, 144, 154)"
        } else if (sectorColor[i] === "Orange"){
            changeSectorColor.style.background = "orange"
        }
    }
}

// https://www.google.fr/maps/place/5+Av.+Ch%C3%A2teaubriand,+95190+Goussainville/
