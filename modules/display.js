//toutes les fonctions d'affichage des données JSON

export function displayCity(ville){
    let ville_data = document.createElement("h1");
    ville_data.innerHTML=ville;
    
    return ville_data;
}

export function displayHour(data_hour){
    let heure = document.createElement("p");
    heure.innerHTML=data_hour;
    return heure;
}

export function displayCondition(condition_data){
    let condition = document.createElement("p");
    condition.innerHTML=condition_data;

    return condition;
}

export function displayConditionImg(img_data){
    let img = document.createElement("img");
    img.src=img_data;

    return img;
}

export function displayTemperature(tmp_data){
    let temperature = document.createElement("p");
    temperature.innerHTML=tmp_data.toString()+"°C";

    return temperature;
}

export function displayWind(data_wind){
    let vent = document.createElement("p");
    vent.innerHTML="Vent : "+data_wind.toString()+"km/h";

    return vent;
}

export function displayWindDirection(data_wind_dir){
    let direction = document.createElement("p");
    direction.innerHTML=" Direction : "+data_wind_dir;
    return direction;
}

export function displayHumidity(data_humidity){
    let humidite = document.createElement("p");
    humidite.innerHTML="Humidité : "+data_humidity.toString()+"%";

    return humidite;
}

export function displayPressure(data_pressure){
    let pression = document.createElement("p");
    pression.innerHTML="Pression : "+data_pressure.toString()+"Pa";

    return pression
}

export function displayTempMinMax(min,max){
    let min_max = document.createElement("p"); 
    min_max.innerHTML=min.toString()+"°C / "+max.toString()+"°C";

    return min_max;
}

export function displayDay(data_day){
    let day = document.createElement("p"); 
    day.innerHTML=data_day;

    return day;
}