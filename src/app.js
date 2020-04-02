const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


// express is a function and we call it to crea a new express application
const app = express()


// Define path for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
// handlebar lets us render dynamic documents
// this line sets npm handlebar. First arg is the key, second is the value
// we use this to create dynamic templates
// handlebars lets us render dynamic templates
// 'view engine' -> es el default engine extension. Osea, es donde express va a buscar los files por default. Ej: horita
// el 'templates' folder se llamaba 'views' y solo teniamos la linea "app.set('view engine', 'hbs')". Con esa linea
// express buscaba los files dentro de ese folder por default. Al cambiar el 'views' folder por 'templates', express
// de por si va a buscar al 'views' folder pq ese fue el que se le puso como default. Como el nombre se cambio a 'templates', 
// pues no va a poder encontrar esos files. Para que express pueda encontrar esos files, se va a necesitar la nueva linea
// "app.set('views', viewsPath)". El arg 'views' lo que quiere decir es que va a ver un directorio en donde express va a buscar esos files. 
// El segundo arg "viewsPath" es ese directorio. viewsPath esta definido en la linea 11. 
// Para esta explicacion puedes ver el pdf guide, pagina 43
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)



// Setup static directory to server
// use -> customize server
// static -> configures our express application. express.static() is a function that we're calling
// and we're passing its return value into use
// I think that this serves up static files
app.use(express.static(publicDirectoryPath))

// render one of our views (handlebar template)
app.get('', (req, res)=>{
    res.render('index', {
        title: 'Weather App',
        name: 'Diego Mendez'
    })
})

app.get('/about', (req,res)=>{
    res.render('about',{
        title: 'About Me',
        name: 'Diego Mendez'
    })
})

app.get('/help', (req, res)=>{
    res.render('help', {
        msg: 'There is no help. Te jodiste ',
        title: 'Help',
        name: 'Diego Mendez'
    })
})

// the annonymous function or the callback, which is the second argument to the get function, is the function
// that describes what we want to do when someone visit a particular route or url (in this case, the first argument of get())
// the req argument -> is an object containing information about the incoming request to the server
// the res argument -> contains a bunch of methods that allow us to customize what are we going to send back to the requester
// This is our http endpoint which sends back our JSON forecast info
app.get('/weather', (req, res)=>{
    if(!req.query.address){
        return res.send({
            error: 'You must provide an address'
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {})=>{
        if(error){
            return res.send({
                error
            })
        }
        
        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({
                    error
                })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })

    })
    
})

// creating an endpoint that sends back products to be displayed in the browser on our ecommerce site
app.get('/products', (req, res)=>{
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res)=>{
    res.render('404',{
        title: '404',
        error: 'Help article not found',
        name: 'Diego Mendez'
    })
})



// el '*' va a correr cuando no hay un match con un link dado por el user
app.get('*', (req, res)=>{
    res.render('404', {
        title: '404',
        error: 'Page not found',
        name: 'Diego Mendez'
    })
})



// starts the server
// the port is the first arg
// second arg -> callback function that runs when the server is up and running
app.listen(3000, ()=>{
    console.log('Server is up on port 3000')
})