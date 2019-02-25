const env = require("dotenv").config();
var keys = require("./keys.js");
const Spotify = require('node-spotify-api');
// console.log(keys);
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
var axios = require("axios");


// Variables "request" and "value" capture the users request type, and search value
// request type can be either "movie-this", "spotify-this-song", "movie-this", or "do-what-it-says"
let request = process.argv[2];
let value = process.argv.slice(3).join(" ");
run(request, value);

function run(request, value){
switch(request){
// If request = "concert-this", use Bands in Town API to return concert details
    case "concert-this":
    concertThis(value);
    break;

// If request = spotify-this-song, use Spotify API to return song details
    case "spotify-this-song":
    spotifyThis(value || 'The Sign');
    break;

// If request = "movie-this", use OMDB API to return movie details
    case "movie-this":
    movieThis(value);
    break;

// If request = "do-what-it-says", read in the data random.txt file, and use it to search the Spotify API
    case "do-what-it-says":
    doWhatItSays(); 
    }
};


    function concertThis (value){
    let URL = "https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp";
    axios.get(URL)
    .then(function(response){
        for (let index = 0; index < response.data.length; index++) {
            const venue = response.data[index].venue.name;
            // console.log(response.data[index].venue.name);
            const country = response.data[index].venue.country;
            const region = response.data[index].venue.region;
            const city = response.data[index].venue.city;
            const datetime = response.data[index].datetime;
            console.log(`Venue: ${venue}`);
            console.log(`Location: ${city} ${region}, ${country}`);
            console.log(reformatDate(datetime));
        }
       
    });
}

function spotifyThis (value){
    console.log(value);
    spotify.search({ type: 'track', query: value, limit: 1 }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        } else {
            console.log(`Artist: ${data.tracks.items[0].artists[0].name}`);
            console.log(`Track Name: ${data.tracks.items[0].name}`);
            console.log(`Preview Link: ${data.tracks.items[0].href}`);
            console.log(`Album: ${data.tracks.items[0].album.name}`);
        }
    })
}

function movieThis (value){    
// if no movie name input, default to "Mr. Nobody"
    film = value || "Mr. Nobody";
    let URL = "http://www.omdbapi.com/?apikey=trilogy&t=" + film;
    axios.get(URL)
    .then(function(response){
        console.log(`Title: ${response.data.Title}`)
        console.log(`Year: ${response.data.Year}`)
        console.log(`IMDB Rating: ${response.data.imdbRating}`)
        // console.log(`Rotten Tomatoes Rating: ${response.data.Ratings[0][0]}`)
        console.log(`Country: ${response.data.Country}`)
        console.log(`Language: ${response.data.Language}`)
        console.log(`Plot: ${response.data.Plot}`)
        console.log(`Actors: ${response.data.Actors}`)
    })
}
    
function doWhatItSays(){
    fs.readFile("random.txt", "utf8", function(err, data){
        if(err){
            console.log("Error: " + err);
         
        } else {
           // set the value variable equal to the data read in via fs.readFile
           console.log(data);
           request = data.split(',')[0];
           value = data.split(',')[1];
           run(request, value);
    }}
        )
    };
    
     
function reformatDate(dateTime){
    var date = dateTime.split('T')[0];
    var month = date.split('-')[1];
    var day = date.split('-')[2];
    var year = date.split('-')[0];
    return `${month}/${day}/${year} \n\n`;
}