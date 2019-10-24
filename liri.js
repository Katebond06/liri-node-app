// --1. have API key to grab data from website to see bands and artist in town,
// Name of the venue, venue location, date of the Event (use moment to format this as "MM/DD/YYYY")
// --2. Have API key to grab data from website:
// Title of the movie.
// Year the movie came out.
// IMDB Rating of the movie.
// Rotten Tomatoes Rating of the movie.
// Country where the movie was produced.
// Language of the movie.
// Plot of the movie.
// Actors in the movie.
// --3. Spotify API--
// --4. `node liri.js do-what-it-says`
// Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
// It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
// Edit the text in random.txt to test out the feature for movie-this and concert-this.

// Bonus: * In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.
// Make sure you append each command you run to the `log.txt` file.
// Do not overwrite your file each time you run a command.

require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");

var command = process.argv[2];
var searchTerm = process.argv.slice(3).join(" ");

// This will search the Bands in Town Artist Events API (`"https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"`)
// capture the input from the user with process.argv

switch (command) {
  case "concert-this":
    concertThis();
    break;
  case "spotify-this-song":
    spotifyThis();
    break;
  case "movie-this":
    movieThis();
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
}

// --------------url for bands in town-----------------
function concertThis() {
  var queryUrl =
    "https://rest.bandsintown.com/artists/" +
    searchTerm +
    "/events?app_id=codingbootcamp";

  axios.get(queryUrl).then(function(response) {
    if (response.data.length === 0) {
      console.log("Nothing was found!");
    } else {
      console.log("Name of the venue: " + response.data[0].venue.name);

      console.log(
        "Venue location: " +
          response.data[0].venue.city +
          ", " +
          response.data[0].venue.region +
          ", " +
          response.data[0].venue.country
      );
      console.log(
        "Date of the Event: " +
          moment(response.data.datetime).format("MMM Do YY")
      );
    }
  });
}

//----------- movies----------------

function movieThis() {
  var queryUrl = "http://www.omdbapi.com/?t=" + searchTerm + "&apikey=5e1028d0";

  axios.get(queryUrl).then(function(response) {
    if (response.data.Response === "False") {
      console.log("No information!");
    } else {
      console.log("The title of the movie: " + response.data.Title);
      console.log("The year of the movie: " + response.data.Year);
      console.log("The rate of the movie: " + response.data.Rated);
      console.log("The release of the movie: " + response.data.Released);
      console.log("The actors of the movie: " + response.data.Actors);
      console.log("The plot of the movie: " + response.data.Plot);
      console.log("The language of the movie: " + response.data.Language);
      console.log("The country of the movie: " + response.data.Country);
      console.log(
        "The Rotten Tomatoes of the movie: " + response.data.Ratings[1].Value
      );
    }
  });
}

// if command is spotify-this-song search spotify
// use searchTerm to search spotify
//-----------------

var i;
for (i = 3; i < process.argv.length; i++) {
  searchTerm = searchTerm + process.argv[i] + " ";
  console.log(searchTerm);
}

if (command === "spotify-this-song") {
  spotify.search({ type: "track", query: searchTerm }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }

    console.log(data.tracks.items[0].artists[0].name);
    console.log(data.tracks.items[0].artists[0].external_urls.spotify);
    console.log(data.tracks.items[0].album.name);
    console.log(data.tracks.items[1].name);
  });
}
