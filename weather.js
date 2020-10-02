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


function displayWeather(data){


    let div = document.createElement("div");
    div.id="data";

    let l1 = document.createElement("div");
    let ville = document.createElement("h1");
    if(data.city_info.name=="NA"){
        ville.innerText=data.city_info.latitude+","+data.city_info.longitude;
    }else{
        ville.innerText=data.city_info.name;
    }
    l1.className="row d-flex justify-content-center align-middle";
    l1.appendChild(ville);

    let heure = document.createElement("p");
    heure.innerHTML=data.current_condition.hour;
    l1.appendChild(heure);

    div.appendChild(l1);

    let l2 = document.createElement("div");
    l2.className="row d-flex justify-content-center align-middle";
    let condition = document.createElement("p");
    condition.innerHTML=data.current_condition.condition;
    condition.className="l1"
    l2.appendChild(condition);
    div.appendChild(l2);

    let limg = document.createElement("div");
    limg.className="row d-flex justify-content-center align-middle";
    let img = document.createElement("img");
    img.src=data.current_condition.icon_big;
    img.className="l1"
    limg.appendChild(img);
    div.appendChild(limg);

    let l3 = document.createElement("div");
    l3.className="row d-flex justify-content-center align-middle";
    let temperature = document.createElement("label");
    temperature.innerHTML="Température : "+data.current_condition.tmp.toString()+"°C";
    l3.appendChild(temperature);
    div.appendChild(l3);

    let l4 = document.createElement("div");
    l4.className="row d-flex justify-content-center align-middle";
    let vent = document.createElement("p");
    vent.innerHTML="Vent : "+data.current_condition.wnd_spd.toString()+"km/h";
    vent.className="vent";
    l4.appendChild(vent);

    let direction = document.createElement("p");
    direction.innerHTML=" Direction : "+data.current_condition.wnd_dir;
    direction.className="vent";
    l4.appendChild(direction);
    div.appendChild(l4);

    let l5 = document.createElement("div");
    l5.className="row d-flex justify-content-center align-middle";
    let humidite = document.createElement("p");
    humidite.innerHTML="Humidité : "+data.current_condition.humidity.toString()+"%";
    l5.appendChild(humidite);
    div.appendChild(l5);

    let l6 = document.createElement("div");
    l6.className="row d-flex justify-content-center align-middle";
    let pression = document.createElement("p");
    pression.innerHTML="Humidité : "+data.current_condition.pressure.toString()+"Pa";
    l6.appendChild(pression);
    div.appendChild(l6);


    let res = document.createElement("div");
    res.className="col-auto";
    res.id="res";
    res.appendChild(div);

    let put = document.querySelector("#put");
    if(put.childElementCount>1){
        put.removeChild(put.lastChild);
    }
    put.appendChild(res);
}