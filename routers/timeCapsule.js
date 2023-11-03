const router = require('express').Router();
const request = require('request');

router.get('/', async (req, res) => {
    var cities = ['london',  'berlin', 'new york', 'delhi', 'paris', 'istanbul', 'bangkok'];
    var longitude;
    var latitude;
    const random = Math.floor(Math.random() * cities.length);
    console.log(cities[random]);
    request.get({
        url: 'https://api.api-ninjas.com/v1/geocoding?city=' + cities[random],
        headers: {
          'X-Api-Key': 'BI6P1DOU6JPGd3+QxwcRpQ==gy7UsCrORfi6bFqf'
        },
      }, function(error, response, body) {
        if(error) return console.error('Request failed:', error);
            else if(response.statusCode != 200) return console.error('Error:', response.statusCode);
            else {
                longitude = JSON.parse(body)[0].longitude;
                latitude = JSON.parse(body)[0].latitude;
                // console.log(JSON.parse(body)[0].latitude, JSON.parse(body)[0].longitude);
            }
        });
    console.log(latitude, longitude)
    res.render('timeCapsule', {latitude: latitude, longitude: longitude});
});

module.exports = router