const locationBtn=document.getElementById('location-btn');
const countryContainer=document.getElementById('countries-container');
const inputContainer=document.getElementById('input-container');
const countryLocator=document.getElementById('location');
const findBtn=document.getElementById('find-btn');
const form=document.getElementById('latlong-input');
let latInput;
let longInput;


findBtn.addEventListener('click', function(e){
    e.preventDefault();
    whereAmI();
})

locationBtn.addEventListener('click',function(){
    whereAmI();
});

const getlatLong=function(){
    latInput=document.getElementById('lat').value;
    longInput=document.getElementById('long').value;
    if(countryLocator.style.opacity==0){
        return getPosition()
            .then(position=>{
                const lat=position.coords.latitude
                const long= position.coords.longitude;
                //Get country using lat long (geolocation api)
                return locateCountry(lat, long)
            })
    }
    return locateCountry(latInput, longInput);
}

const whereAmI=function(){
    getlatLong()
    //Get data on country and neighbor, render html
    .then(data=>{
        return getCountryData(data.countryCode);
    })
    .then(data=>{
        renderCountry(data);
        return getCountryData(data.borders[0])
    })
    .then(data=>{
        renderCountry(data, 'neighbor');
    })
    .catch(error=>{
        renderError(error.message);
        console.error(error);
    })
    .finally(x=>{
        //Set opacity of country and geolocation container
        countryContainer.style.opacity=1;
        if(countryLocator.style.opacity==0){
            inputContainer.style.opacity=1;
        }
        //Hide where am i button
        locationBtn.style.opacity=0;
        //Display lat/long search heading and form
        countryLocator.style.opacity=1;
        //Clear form
        document.getElementById('lat').value='';
        document.getElementById('long').value='';
    })
}

const getPosition=function(){
    //returns current location data
    return new Promise(function(resolve, reject){
        navigator.geolocation.getCurrentPosition(resolve,reject)
    })
}

const locateCountry=function(lat, long){
    //Get country using lat long
    return fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`)
        .then(response=>{
            if(!response.ok){
                throw new Error(`Error with reverse geocoding`);
            }
            return response.json();
        })
}

const getCountryData=function(country){
    //Get country data
    return fetch(`https://restcountries.eu/rest/v2/alpha/${country}`)
        .then(response=>{
            if(!response.ok){
                throw new Error(`Error fetching country data`);
            }
            return response.json();
        })
}

const renderCountry=function(data, className=''){
    //Render and insert the country
    let html=`
    <div class="country ${className}">
        <img class="flag" src="${data.flag}">

        </img>
        <div class="country-info">
            <div>
                <h2>${data.name}</h2>
                <h3>${data.region}</h3>
            <div>
            <p><ion-icon class="icon" name="people"></ion-icon> ${(data.population/1000000).toFixed(2)} million people</p>
            <p><ion-icon class="icon" name="mic"></ion-icon> ${data.languages[0].name}</p>
            <p><ion-icon class="icon" name="cash"></ion-icon> ${data.currencies[0].name}</p>
        </div>
    </div>`
    //Determine container to render country
    if(countryLocator.style.opacity==0){
        countryContainer.insertAdjacentHTML('beforeend',html);
    }
    else{
        inputContainer.insertAdjacentHTML('beforeend',html);
    }
}

const renderError=function(error){

    //Error html
    let html=`<h2 style="color:red;"><ion-icon name="alert"></ion-icon> ${error}</h2>`;
    //Determine container to render error
    if(countryLocator.style.opacity==1){
        inputContainer.insertAdjacentHTML('beforeend', html);
    }
    else{
        countryContainer.insertAdjacentHTML('beforeend', html);
    }
}



