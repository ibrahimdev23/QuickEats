
// nodejs libraries in use


const express = require ('express'); //use express
const path = require('path')

require('dotenv').config()

const bodyParser = require('body-parser');
const yelp = require('yelp-fusion');
const app = express();


const API_YELP_KEY = process.env.API_YELP_KEY

const urlencodedParser = bodyParser.urlencoded({ extended: false }) 

app.set('views', path.join(__dirname, '/public/views'))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public/css'))

const client = yelp.client(API_YELP_KEY);

//get request renders the home page using ejs  
app.get('/', function(req, res) { 
    res.sendFile(path.join(__dirname, '/public/views/home'))
    res.render('home')
    
  })


  app.post('/results', urlencodedParser, function(req, res) {
    formData = req.body

    client.search(formData).then(response => {
        let randomNum = Math.floor(Math.random() * 20)

        const randomResult = response.jsonBody.businesses[randomNum];
        const placeLocation = randomResult.location.display_address
        const placeName = randomResult.name
        const placeRating = randomResult.rating
        const img = randomResult.image_url
        const link = randomResult.url
        const phoneNumber = randomResult.display_phone
        
        let resturantData = {
            name: placeName, 
            rating: placeRating, 
            location: placeLocation, 
            image: img, 
            phone: phoneNumber,
            onlineLink: link, 
            
        }


        res.render('result', resturantData)
       
      }).catch(e => {
        console.log(e);
      })
  
    
});


const port = process.env.PORT || 4400

app.listen(port, () => {
    console.log(`server running on ${port}`)
}); 