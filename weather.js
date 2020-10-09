let btn = document.querySelector("#btn");
let ville = "";
let setup = document.querySelector("#ville");
setup.value="Bordeaux";

btn.addEventListener("click", function() {
    getCity();
});

setUpMap();

function setUpMap(){
    // On initialise la latitude et la longitude de Paris (centre de la carte)
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
        getWeatherLatLong(e.latlng.lat,e.latlng.lng);
    }
    
    macarte.on('click', onMapClick);

}

function getCity(){
    let input = document.querySelector("#ville");
    if(input.value!=""){
        ville = input.value;
    }
    console.log(ville);
    getWeather(ville);
}

function getWeather(ville){
    fetch("https://www.prevision-meteo.ch/services/json/"+ville)
        .then(resp => resp.json())
        .then(json => displayWeather(json));

}

function getWeatherLatLong(lat,lng){
    fetch("https://www.prevision-meteo.ch/services/json/lat="+lat+"lng="+lng)
        .then(resp => resp.json())
        .then(json => displayWeather(json));

}

function displayCityAndHour(data){
    let line1 = document.createElement("div");
    let ville = document.createElement("h1");

    if(data.city_info.name=="NA"){
        ville.innerText=data.city_info.latitude+","+data.city_info.longitude;
    }else{
        ville.innerText=data.city_info.name;
    }

    line1.className="row d-flex justify-content-center align-middle";
    line1.appendChild(ville);
    
    return line1;
}

function displayHour(data_hour){
    let heure = document.createElement("p");
    heure.innerHTML=data_hour;
    return heure;
}

function displayCondition(condition_data){
    let line2 = document.createElement("div");
    line2.className="row d-flex justify-content-center align-middle";
    let condition = document.createElement("p");
    condition.innerHTML=condition_data;
    line2.appendChild(condition);

    return line2;
}

function displayConditionImg(img_data){
    let lineimg = document.createElement("div");
    lineimg.className="row d-flex justify-content-center align-middle";
    let img = document.createElement("img");
    img.src=img_data;
    lineimg.appendChild(img);

    return lineimg;
}

function displayTemperature(tmp_data){
    let line3 = document.createElement("div");
    line3.className="row d-flex justify-content-center align-middle";
    let temperature = document.createElement("p");
    temperature.innerHTML=tmp_data.toString()+"°C";
    line3.appendChild(temperature);

    return line3;
}

function displayWind(data_wind){
    let line4 = document.createElement("div");
    line4.className="row d-flex justify-content-center align-middle";
    let vent = document.createElement("p");
    vent.innerHTML="Vent : "+data_wind.toString()+"km/h";
    line4.appendChild(vent);

    return line4;
}

function displayWindDirection(data_wind_dir){
    let direction = document.createElement("p");
    direction.innerHTML=" Direction : "+data_wind_dir;
    return direction;
}

function displayHumidity(data_humidity){
    let line5 = document.createElement("div");
    line5.className="row d-flex justify-content-center align-middle";
    let humidite = document.createElement("p");
    humidite.innerHTML="Humidité : "+data_humidity.toString()+"%";
    line5.appendChild(humidite);

    return line5;
}

function displayPressure(data_pressure){
    let line6 = document.createElement("div");
    line6.className="row d-flex justify-content-center align-middle";
    let pression = document.createElement("p");
    pression.innerHTML="Pression : "+data_pressure.toString()+"Pa";
    line6.appendChild(pression);

    return line6
}


function displayWeather(data){

    let div = document.createElement("div");
    div.id="data";

    div.appendChild(displayCityAndHour(data));

    div.appendChild(displayHour(data.current_condition.hour));

    div.appendChild(displayCondition(data.current_condition.condition));

    div.appendChild(displayConditionImg(data.current_condition.icon_big));

    div.appendChild(displayTemperature(data.current_condition.tmp));

    div.appendChild(displayWind(data.current_condition.wnd_spd));

    div.appendChild(displayWindDirection(data.current_condition.wnd_dir));

    div.appendChild(displayHumidity(data.current_condition.humidity));

    div.appendChild(displayPressure(data.current_condition.pressure));


    let res = document.createElement("div");
    res.className="flex-col d-flex justify-content-center";
    res.id="res";
    res.appendChild(div);

    let put = document.querySelector("#put");
    if(put.childElementCount>1){
        put.removeChild(put.lastChild);
    }
    put.appendChild(res);
}