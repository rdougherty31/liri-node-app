require("dotenv").config();
var moment = require('moment');
// moment().format();
var keys = require("./keys.js");
var axios = require("axios");
var fs = require("fs");
// var bands = require("bandsintown");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var song;
var title;
var artist;
var term = process.argv.slice(3).join(" ");
var loopArrayDone = true;

if (command === "spotify-this-song") {
    if (!process.argv[3]) {
        song = "the sign";
        searchSpotify();
    } else {
        song = term;
        searchSpotify();
    }
} else if (command === "concert-this") {
        artist = term;
        concertThis();
} else if (command === "movie-this") {
    if (!process.argv[3]) {
        title = "mr%20nobody";
        movieThis();
    } else {
        title = term;
        movieThis();
    }
} else if (command === "do-what-it-says") {
    doWhatItSays();
} else {
    console.log("That is not a function we can do.");
}
var executionDone = false;
function concertThis() {
    executionDone = false;
    console.log("concert this");
    console.log("concert this");
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(function(events) {
        for (var j=0;j<events.data.length;j++) {
            // var date =events.data[j].datetime.split("T").shift();
            console.log("Date: "+events.data[j].datetime[5]+events.data[j].datetime[6]+"/"+events.data[j].datetime[8]+events.data[j].datetime[9]+"/"+events.data[j].datetime[0]+events.data[j].datetime[1]+events.data[j].datetime[2]+events.data[j].datetime[3]);
            console.log("Venue: "+events.data[j].venue.name);
            console.log("City: "+events.data[j].venue.city+", "+events.data[j].venue.city);
            console.log("----------------------------------");
        }
        executionDone = true;
        if (loopArrayDone === false) {
            doWhatItSays();
        } else {
            return;
        }
    });
}
function searchSpotify() {
    executionDone = false;
    console.log("spotify this song");
    spotify.search({type: 'track', query: song} , function(err, data) {
        if (err) {
            console.log('error occurred: '+err);      
        } else if (song === "the sign") {
            spotify.search({type: 'track', query: song} , function(err, data) {
                if (err) {
                    console.log('error occurred: '+err);      
                } else {
                    console.log("Artist: "+data.tracks.items[8].album.artists[0].name);
                    console.log("Song Name: "+data.tracks.items[8].name);
                    console.log("Preview: "+data.tracks.items[8].preview_url);
                    console.log("Album: "+data.tracks.items[8].album.name);
                }
            });
        } else {
            console.log("Artist: "+data.tracks.items[0].album.artists[0].name);
            console.log("Song Name: "+data.tracks.items[0].name);
            console.log("Preview: "+data.tracks.items[0].preview_url);
            console.log("Album: "+data.tracks.items[0].album.name);
        }
        executionDone = true;
        if (loopArrayDone === false) {
            doWhatItSays();
        } else {
            return;
        }
    });
}
function movieThis() {
    executionDone = false;
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
    executionDone = true;
    if (loopArrayDone === false) {
        doWhatItSays();
    } else {
        return;
    }
  });
  //error shows mr. nobody
}
var i=0;
function doWhatItSays() {
    console.log("do what it says");
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        loopArray();
        function loopArray() {
            console.log("-----------------------------");
            loopArrayDone = false;
            if (dataArr[i]==="spotify-this-song") {
                song = dataArr[i+1];
                searchSpotify();
                console.log(song);
            } else if (dataArr[i]==="movie-this") {
                title = dataArr[i+1];
                movieThis();
            } else if (dataArr[i]==="concert-this") {
                artist = dataArr[i+1];
                concertThis();
            } else {
                console.log("Not an available command.");
            }
            i++;
            if (i%2!==0) {
                i++;
            }
            if (i===dataArr.length) {
                loopArrayDone = true;
                return;
            }
        }
    });
}