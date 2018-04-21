const yargs = require('yargs');
const axios = require('axios');
// const geocode = require('./geocode.js');
// const weather= require('./weather.js');
const argv = yargs
.options({
    a:{
      demand: true,
      alias:'address',
      describe: 'Address to fetch weather for',
      string: true
    }

})
.help()
.alias('help','h')
.argv

var geolocationURL= `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(argv.address)}`

axios.get(geolocationURL).then((response)=>{
  if(response.data.status==='ZERO_RESULTS'){
     throw new Error('Unable to find data');
  }
    var address=response.data.results[0].formatted_address;
    var lat= response.data.results[0].geometry.location.lat;
    var lon= response.data.results[0].geometry.location.lng;

    // **********************************************************************************************************************
    // ******************* Register a Dev account at forecast.io and insert your <API KEY> below****************************
    // **********************************************************************************************************************

    var weatherURL=`https://api.darksky.net/forecast/<API KEY>/${lat},${lon}`;

    console.log(`-------------------------\n${address}\n-------------------------`);
    return axios.get(weatherURL);
}).then((response)=>{
  var temperature=response.data.currently.temperature;
  var humidity =response.data.currently.humidity;
  console.log(`Temperature: ${temperature}${decodeURIComponent('%C2%B0')}F\nHumidity: ${humidity}\n----------------`);
}).catch((err)=>{
  if(err.code==="ENOTFOUND"){
      console.log('Unable to connect');
}
  else{
    console.log(err.message);
  }
})
