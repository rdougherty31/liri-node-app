require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var fs = require("fs");
// var bands = require("bandsintown");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var song;
var title;
var artist = "khalid";

if (command === "spotify-this-song") {
    song = process.argv[3];
    searchSpotify();
} else if (command === "concert-this") {
    // artist = process.argv[3];
    concertThis();
} else if (command === "movie-this") {
    title = process.argv[3];
    movieThis();
} else if (command === "do-what-it-says") {
    doWhatItSays();
} else {
    console.log("That is not a function we can do.");
}
function concertThis() {
    console.log("concert this");
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(function(events) {
        // console.log(events);
        for (var i=0;i<events.data.length;i++) {
            console.log("Date: "+events.data[i].datetime);
            console.log("Venue: "+events.data[i].venue.name);
            console.log("City: "+events.data[i].venue.city+", "+events.data[i].venue.city);
            console.log("----------------------------------");
        }
    });
}
function searchSpotify() {
    spotify.search({type: 'track', query: song} , function(err, data) {
        if (err) {
            console.log('error occurred: '+err);      
        } else {
        // console.log(data.tracks.items[0]);
            console.log("Artist: "+data.tracks.items[0].album.artists[0].name);
            console.log("Song Name: "+data.tracks.items[0].name);
            console.log("Preview: "+data.tracks.items[0].preview);
            console.log("Album: "+data.tracks.items[0].album.name);
        }
    });
}
function movieThis() {
    console.log("movie this");
    axios.get("http://www.omdbapi.com/?t="+title+"&y=&plot=short&apikey=trilogy").then(
  function(response) {
    // console.log(response);
    console.log("Title: "+response.data.Title);
    console.log("Year: "+response.data.Year);
    console.log("IMDB Rating: " + response.data.imdbRating);
    console.log("Rotten Tomatoes Rating: "+response.data.Ratings[0].Value);
    console.log("Country produced in: "+response.data.Country);
    console.log("Language of Movie: "+response.data.Language);
    console.log("Plot: "+response.data.Plot);
    console.log("Actors: "+response.data.Actors);
  });
  //error shows mr. nobody
}
function doWhatItSays() {
    console.log("do what it says");
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        console.log(data);
    });
}