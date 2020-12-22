const locationBtn=document.getElementById('location-btn');
const countryContainer=document.getElementById('countries-container');

locationBtn.addEventListener('click',function(){
    navigator.geolocation.getCurrentPosition((pos)=>{
        const [lat,long]=[pos.coords.latitude, pos.coords.longitude];

        //Get country using lat long (geolocation api)

        //Hide button
        locationBtn.style.opacity=0;
    });
})

const locateCountry=function(lat, long){
    //Get country using lat long
}

const getCountryData=function(country){
    //Get data of country
}

const renderCountry=function(data){

}