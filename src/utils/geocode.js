const request = require('request')

// the callback function is the function we are going to call, once we have the longitude and latitude
const geocode = (address, callback) =>{
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoiZGllZ296bWVuZGV6IiwiYSI6ImNrODU4cHQ3bjAzYjczbGxuazdqYjhuczQifQ.jGMenOS3Y15xlIb-IxTPKA&limit=1`

    request({url, json: true}, (error, response)=>{
        if(error){
            callback('Unable to connect to location services', undefined)
        }

        else if(response.body.features.length == 0){
            callback('Unable to find location. Try another search', undefined)
        }
        else{
            callback(undefined, {
                latitude: response.body.features[0].center[1],
                longitude: response.body.features[0].center[0],
                location: response.body.features[0].place_name
            })
        }
    })
}

module.exports = geocode