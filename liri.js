require("dotenv").config();


//import key.js, spotify, twitter, fs and request npm packages and assign it to variables
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require("request");
var myTweets = [];

// var spotify = new Spotify(keys.spotify);
var spotify = new Spotify({
    id: "ac592809245247009d5f0949d4996b65",
    secret: "ccc09ff8e52f4412b992d69207c0a7a8"
  });
var client = new Twitter(keys.twitter);


var command = process.argv[2];
// This will receive multiple inputs for the input variable, and concatenate them into one string
var nodeArgs = process.argv;
// Create an empty variable for holding the movie name
var input = "";

// Loop through all the words in the node argument
// And do a little for-loop magic to handle the inclusion of "+"s
for (var i = 3; i < nodeArgs.length; i++) {

  if (i > 3 && i < nodeArgs.length) {

    input = input + " " + nodeArgs[i];

  }

  else {

    input += nodeArgs[i];

  }
}


//main function that will run everything based on the user input
function main(command, input){
    switch(command) {
        case "my-tweets":
            displayTweets();
            break;
        case "spotify-this-song":
            if (input === ""){
                input = "The Sign";
                runSpotify(input);
            }
            runSpotify(input);
            break;
        case "movie-this":

            break;
        case "do-what-it-says":

            break;
        default:
            console.log("Error. Please input: my-tweets, spotify-this-song <songname>, movie-this or do-what-it-says. Yes, dashes included");   
    }
}


runSpotify(input);

// spotify.search({ type: 'track', query: "Give Me A Sign" }, function(err, data) {
//     if (err) {
//       return console.log('Error occurred: ' + err);
//     }
  
//     var song = data.tracks.items[0];

//     console.log(song);
//   });
  
function runSpotify(song){
//function that will run the spotify.search command to search for the song requested by the user.
	if(song === ""){
		song = "The Sign";
	}

	spotify.search({ type: 'track', query: song}, function(err, data) {
    if (err) {
        console.log('Error occurred: ' + err);
        return;
    }

    var song = data.tracks.items[0];
    console.log("------Song Name-----");
    console.log(song.name);

    console.log("------Artists-----");
    // loop to display the possible artists that may have a song with that name
    for(i=0; i<song.artists.length; i++){
    	console.log(song.artists[i].name);
    }

	console.log("-------Preview Link-----");
    console.log(song.preview_url);

    console.log("-------Album-----");
    console.log(song.album.name);

	});

}
