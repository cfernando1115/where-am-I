const locationBtn=document.getElementById('location-btn');
const countryContainer=document.getElementById('countries-container');

locationBtn.addEventListener('click',function(){
    navigator.geolocation.getCurrentPosition((pos)=>{
        const [lat,long]=[pos.coords.latitude, pos.coords.longitude];

        //Get country using lat long (geolocation api)
        locateCountry(lat, long)
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
            //Set opacity of country container
            .finally(x=>{
                countryContainer.style.opacity=1;
            })
        //Hide button
        locationBtn.style.opacity=0;
    });
})

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
    countryContainer.insertAdjacentHTML('beforeend',html);

}

const renderError=function(error){
    //Error html
    let html=`<h2 style="color:red;"><ion-icon name="alert"></ion-icon> ${error}</h2>`;
    countryContainer.insertAdjacentHTML('beforeend', html);
}