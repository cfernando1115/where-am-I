const locationBtn=document.getElementById('location-btn');
const countryContainer=document.getElementById('countries-container');

locationBtn.addEventListener('click',function(){
    navigator.geolocation.getCurrentPosition((pos)=>{
        const [lat,long]=[pos.coords.latitude, pos.coords.longitude];

        //Get country using lat long (geolocation api)
        locateCountry(lat, long)
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
                console.log(error);
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
    return fetch(`https://restcountries.eu/rest/v2/alpha/${country}`)
        .then(response=>{
            if(!response.ok){
                throw new Error(`Error fetching country data`);
            }
            return response.json();
        })
}

const renderCountry=function(data, className=''){
    console.log(data);
    let html=`
    <div class="country ${className}">
        <img class="flag" src="${data.flag}">

        </img>
        <div class="country-info">
            <div>
                <h2>${data.name}</h2>
                <h3>${data.region}</h3>
            <div>
            <p>🧍‍♀️ ${(data.population/1000000).toFixed(2)} million people</p>
            <p>🗣 ${data.languages[0].name}</p>
            <p>💰 ${data.currencies[0].name}</p>
        </div>
    </div>`
    countryContainer.insertAdjacentHTML('beforeend',html);

}