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
                console.log(data);
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

const renderCountry=function(data){

}