import * as display from "./modules/display.js";

let ville = "";
let marker;

//On lie le input au bouton de recherche
let input = document.querySelector("#ville");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.querySelector("#btn").click();
    }
});

let btn = document.querySelector("#btn");
btn.addEventListener("click", function() {
    getCity("current");
});

let prev1 = document.querySelector("#prev1");
prev1.addEventListener("click", function() {
    getCity("J+1");
});


let prev2 = document.querySelector("#prev2");
prev2.addEventListener("click", function() {
    getCity("J+2");
});

let prev3 = document.querySelector("#prev3");
prev3.addEventListener("click", function() {
    getCity("J+3");
});

setUpMap();

function setUpMap(){
    // On initialise la latitude et la longitude de Bordeaux (centre de la carte)
    var lat = 44.830703;
    var lon = -0.578981;
    // Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "map"
    var macarte = L.map('mapid').setView([lat, lon], 11);
    // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        // Il est toujours bien de laisser le lien vers la source des données
        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20
    }).addTo(macarte);

    function onMapClick(e) {
        //On remet à zero l'input et la ville en mémoire pour ne pas interférer
        ville="";
        let input = document.querySelector("#ville");
        input.value="";
        //Si il y a déjà un marker on l'enlève de la carte
        if(marker!=undefined){
            macarte.removeLayer(marker);
        }
        //On ajoute un marker à l'endroit du click
        marker = L.marker(e.latlng);
        marker.addTo(macarte);
        //On récupère la météo en fonction de la latitude et longitude
        getWeatherLatLong(e.latlng.lat,e.latlng.lng);
    }
    
    macarte.on('click', onMapClick);

}

function getCity(time){
    let input = document.querySelector("#ville");
    //Si l'input n'est pas vide on récupère la ville
    if(input.value!=""){
        ville=convertCity(input.value);
    }
    //Si il y a une ville en mémoire on cherche sa météo
    if(ville!=""){
        getWeather(ville,time);
    }
}

//Cette fonction gère les villes avec un nom composé
// Ex : La Rochelle -> Rochelle (nom dans l'api)
// Mais malgré cette fonctionnalité la récupération de la météo échoue
function convertCity(city){
    let tab = city.split(" ");
    if(tab.length>1){
        return tab[tab.length-1];
    }else{
        return city;
    }
}

//On récupère la météo en fonction de la ville et du moment voulu 
function getWeather(ville,time){
    fetch("https://www.prevision-meteo.ch/services/json/"+ville)
        .then(resp => resp.json())
        .then(json => {
            if(time=="current"){
                displayWeather(json)
            }
            else if(time=="J+1"){
                displayPrevision(json.fcst_day_1);
            }
            else if(time=="J+2"){
                displayPrevision(json.fcst_day_2);
            }
            else{
                displayPrevision(json.fcst_day_3);
            }
        })
        .catch(() => alert("La ville n'est pas reconnue"));
}

//Récupère la météo en fonction de la latitude et longitude
function getWeatherLatLong(lat,lng){
    //Avec une api on convertit les coordonnées en ville
    //Il faut regarder tous les types de ville possible : city, town ou village
    //On récupère ensuite la météo de cette ville
    fetch("https://nominatim.openstreetmap.org/reverse?format=json&lat="+lat+"&lon="+lng)
        .then(resp => resp.json())
        .then(json => {
            if(json.address.city!=undefined){
                ville=json.address.city;
                getWeather(ville,"current");
            }else if(json.address.town!=undefined){
                ville=json.address.town;
                getWeather(ville,"current");
            }else if(json.address.village!=undefined){
                ville=json.address.village;
                getWeather(ville,"current");
            }else{
                alert("Impossible de trouver la ville");
            }
        });

}

//Affiche la météo actuelle de la ville sélectionnée
function displayWeather(data){

    let res = document.createElement("div");
    res.className="d-flex align-items-center flex-column";
    res.id="res";

    res.appendChild(display.displayCity(ville));

    res.appendChild(display.displayHour(data.current_condition.hour));

    res.appendChild(display.displayCondition(data.current_condition.condition));

    res.appendChild(display.displayConditionImg(data.current_condition.icon_big));

    res.appendChild(display.displayTemperature(data.current_condition.tmp));

    res.appendChild(display.displayWind(data.current_condition.wnd_spd));

    res.appendChild(display.displayWindDirection(data.current_condition.wnd_dir));

    res.appendChild(display.displayHumidity(data.current_condition.humidity));

    res.appendChild(display.displayPressure(data.current_condition.pressure));

    //Si une météo est déjà affichée on la remplace
    let put = document.querySelector("#put");
    if(put.childElementCount>1){
        put.removeChild(put.lastChild);
    }
    put.appendChild(res);
}

//Affiche une prévision de la météo pour la ville sélectionnée
function displayPrevision(data){

    let res = document.createElement("div");
    res.className="d-flex align-items-center flex-column";
    res.id="res";

    let ville_data = document.createElement("h1");
    ville_data.innerText=ville;
    res.appendChild(ville_data);

    res.appendChild(display.displayDay(data.day_long));

    res.appendChild(display.displayConditionImg(data.icon_big));

    res.appendChild(display.displayCondition(data.condition));

    res.appendChild(display.displayTempMinMax(data.tmin,data.tmax));

    //Si une météo est déjà affichée on la remplace
    let put = document.querySelector("#put");
    if(put.childElementCount>1){
        put.removeChild(put.lastChild);
    }
    put.appendChild(res);
}

