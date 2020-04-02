const request = require('request')


const forecast = (latitude, longitude, callback)=>{
    const url = `https://api.darksky.net/forecast/eca2bf289219e7d45f1959ecd47d0bed/${latitude},${longitude}` // 37.8267,-122.4233


    request({url, json: true}, (error, response)=>{
        if(error){
            callback('Unable to connect to weather service', undefined)
        }
        else if(response.body.error){
            callback('Unable to find location', undefined)
        }
        else{
            const temperature = response.body.currently.temperature
            const rainProb = response.body.currently.precipProbability
            const summary = response.body.daily.data[0].summary
            callback(undefined,`${summary}. It is currently ${temperature} degrees out. There is ${rainProb}% chance of rain.`)
        }
    })
}



module.exports = forecast