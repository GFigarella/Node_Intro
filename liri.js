require("dotenv").config();


//import key.js, spotify, twitter, fs and request npm packages and assign it to variables
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require("request");
var myTweets = [];

var spotify = new Spotify(keys.spotify);
// var spotify = new Spotify({
//     id: "ac592809245247009d5f0949d4996b65",
//     secret: "ccc09ff8e52f4412b992d69207c0a7a8"
//   });
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

    input = "";

  }
}


//Run the main function
main(command, input);

//main function that will run everything based on the user input
function main(command, input){
    switch(command) {
        case "my-tweets":
            runTwitter();
            break;

        case "spotify-this-song":
            if (input === ""){
                input = "The Sign";
            }
            runSpotify(input);
            break;

        case "movie-this":
            if (input === ""){
                input = "Mr.Nobody"
            }
            runOMDB(input);
            break;

        case "do-what-it-says":
            doWhatItSays();
            break;

        default:
            console.log("Error. Please input: my-tweets, spotify-this-song <songname>, movie-this or do-what-it-says. Yes, dashes included.");   
    }
};

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
    console.log(input);
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

};

function runTwitter(){
    //fucntion that runs the twitter package 
    var params = {screen_name: 'GaboFigarella', trim_user:true};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            myTweets = tweets
            //loop to access the tweets object, and extract the tweet itself and the date of creation.
            for(var i = 0; i<myTweets.length; i++){
                var date = myTweets[i].created_at;
                console.log("@GaboFigarella: " + tweets[i].text + "\nCreated At: " + date.substring(0, 19));
                console.log("-----------------------");
            }
        }
    });
}

function runOMDB(movie){
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    // Then create a request to the queryUrl
    request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
        //Parse the body of the site and recover just the Release Year
        //log the info of the movie in this format : 
        //Title of the movie.
        //Year the movie came out.
        //IMDB Rating of the movie.
        //Rotten Tomatoes Rating of the movie.
        //Country where the movie was produced.
        //Language of the movie.
        //Plot of the movie.
        //Actors in the movie.

        console.log("-----------------" + "\nTitle: " + JSON.parse(body).Title + ".\nYear of Release: " + JSON.parse(body).Year + ".\nIMDB Rating: " + JSON.parse(body).imdbRating + ".\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + ".\nCountry/Countries of production: " + JSON.parse(body).Country + ".\nLanguage/Languages of the Movie: " + JSON.parse(body).Language + ".\nPlot: " + JSON.parse(body).Plot + ".\nActors in the Movie: " + JSON.parse(body).Actors + ".\n-----------------");
        }
    });
  
}

function doWhatItSays(){
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
          }

        data = data.split(",");
        main(data[0],data[1]);
    });
}
