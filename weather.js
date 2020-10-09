let ville = "";
let setup = document.querySelector("#ville");
setup.value="Bordeaux";

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

function getCity(time){
    let input = document.querySelector("#ville");
    if(input.value!=""){
        ville = input.value;
    }
    console.log(ville);
    if(ville!=""){
        getWeather(ville,time);
    }
}

function getWeather(ville,time){
    fetch("https://www.prevision-meteo.ch/services/json/"+ville)
        .then(resp => resp.json())
        .then(json => {
            if(time=="current"){
                displayWeather(json)
            }
            else if(time=="J+1"){
                displayPrevision(json.fcst_day_1);
                console.log(json.fcst_day_1);
            }
            else if(time=="J+2"){
                displayPrevision(json.fcst_day_2);
                console.log(json.fcst_day_2);
            }
            else{
                displayPrevision(json.fcst_day_3);
                console.log(json.fcst_day_3);
            }
        });

}

function getWeatherLatLong(lat,lng){
    fetch("https://www.prevision-meteo.ch/services/json/lat="+lat+"lng="+lng)
        .then(resp => resp.json())
        .then(json => displayWeather(json));

}

function displayCityAndHour(data){
    let ville = document.createElement("h1");

    if(data.city_info.name=="NA"){
        ville.innerText=data.city_info.latitude+","+data.city_info.longitude;
    }else{
        ville.innerText=data.city_info.name;
    }
    
    return ville;
}

function displayHour(data_hour){
    let heure = document.createElement("p");
    heure.innerHTML=data_hour;
    return heure;
}

function displayCondition(condition_data){
    let condition = document.createElement("p");
    condition.innerHTML=condition_data;

    return condition;
}

function displayConditionImg(img_data){
    let img = document.createElement("img");
    img.src=img_data;

    return img;
}

function displayTemperature(tmp_data){
    let temperature = document.createElement("p");
    temperature.innerHTML=tmp_data.toString()+"°C";

    return temperature;
}

function displayWind(data_wind){
    let vent = document.createElement("p");
    vent.innerHTML="Vent : "+data_wind.toString()+"km/h";

    return vent;
}

function displayWindDirection(data_wind_dir){
    let direction = document.createElement("p");
    direction.innerHTML=" Direction : "+data_wind_dir;
    return direction;
}

function displayHumidity(data_humidity){
    let humidite = document.createElement("p");
    humidite.innerHTML="Humidité : "+data_humidity.toString()+"%";

    return humidite;
}

function displayPressure(data_pressure){
    let pression = document.createElement("p");
    pression.innerHTML="Pression : "+data_pressure.toString()+"Pa";

    return pression
}


function displayWeather(data){

    let res = document.createElement("div");
    res.className="d-flex align-items-center flex-column";
    res.id="res";

    res.appendChild(displayCityAndHour(data));

    res.appendChild(displayHour(data.current_condition.hour));

    res.appendChild(displayCondition(data.current_condition.condition));

    res.appendChild(displayConditionImg(data.current_condition.icon_big));

    res.appendChild(displayTemperature(data.current_condition.tmp));

    res.appendChild(displayWind(data.current_condition.wnd_spd));

    res.appendChild(displayWindDirection(data.current_condition.wnd_dir));

    res.appendChild(displayHumidity(data.current_condition.humidity));

    res.appendChild(displayPressure(data.current_condition.pressure));

    let put = document.querySelector("#put");
    if(put.childElementCount>1){
        put.removeChild(put.lastChild);
    }
    put.appendChild(res);
}


function displayPrevision(data){

    let res = document.createElement("div");
    res.className="d-flex align-items-center flex-column";
    res.id="res";

    //res.appendChild(displayCityAndHour(data));



    res.appendChild(displayCondition(data.condition));

    res.appendChild(displayConditionImg(data.icon_big));

    let put = document.querySelector("#put");
    if(put.childElementCount>1){
        put.removeChild(put.lastChild);
    }
    put.appendChild(res);
}

