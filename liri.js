// Initial config and node require
require("dotenv").config();
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var apiKeys = require("./keys.js");
var spotify = new Spotify(apiKeys.spotify);
var client = new Twitter(apiKeys.twitter);
var fs = require("fs");

// User command keyword variable
var command = process.argv[2];

// Twitter search parameters
var params = {
    screen_name: 'davidlatuno'
}

// Movie name code to handle multiple words
var userArr = process.argv;
userArr.splice(0, 3);
var searchName = userArr.join(" ");

switch (command) {
    case "spotify-this-song":
        userSpotify();
        break;

    case "movie-this":
        userMovie();
        break;

    case "my-tweets":
        userTweet();
        break;

    case "history":
        history();
        break;

    case "do-what-it-says":
        dwis();
        break;
}

// Spotify Request
function userSpotify() {
    fs.appendFile("log.txt", "\n\nSpotify Search:", function (err) {
        if (err) {
            console.log(err);
        }
    })
    // Empty User input
    if (searchName === "") {
        spotify
            .request('https://api.spotify.com/v1/tracks/3DYVWvPh3kGwPasp7yjahc')
            .then(function (data) {
                console.log("Artist(s): " + data.artists[0].name);
                console.log("Song Name: " + data.name);
                console.log("Preview Link: " + data.external_urls.spotify);
                console.log("Album from: " + data.album.name);
                fs.appendFile("log.txt", `\n\nArtists(s): ${data.artists[0].name}\nSong Name: ${data.name}\nPreview Link: ${data.external_urls.spotify}\nAlbum from: ${data.album.name}`, function (err) {
                    if (err) {
                        console.log(err);
                    }
                })
            })
            .catch(function (err) {
                console.error('Error occurred: ' + err);
            });
    } else {
        // Handle User Input
        spotify.search({ type: 'track', query: searchName }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            if (data.tracks.total === 0) {
                console.log("Sorry, could not find any songs matching " + searchName);
                fs.appendFile("log.txt", `\n\nSorry, could not find any songs matching ${searchName}`, function (err) {
                    if (err) {
                        console.log(err);
                    }
                })
            } else {
                for (var i = 0; i < data.tracks.items.length; i++) {
                    console.log("Artist(s): " + data.tracks.items[i].artists[0].name);
                    console.log("Song Name: " + data.tracks.items[i].name);
                    console.log("Preview Link: " + data.tracks.items[i].external_urls.spotify);
                    console.log("Album from: " + data.tracks.items[i].album.name);
                    console.log("");
                    fs.appendFile("log.txt", `\n\nArtists(s): ${data.tracks.items[i].artists[0].name}\nSong Name: ${data.tracks.items[i].name}\nPreview Link: ${data.tracks.items[i].external_urls.spotify}\nAlbum from: ${data.tracks.items[i].album.name}`, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    })
                }
            }
        });
    }
}

// OMDB Request
function userMovie() {
    // OMDB url
    var queryUrl = "http://www.omdbapi.com/?t=" + searchName + "&y=&plot=short&apikey=trilogy";
    fs.appendFile("log.txt", "\n\nMovie Search:", function (err) {
        if (err) {
            console.log(err);
        }
    })
    // Empty User Input
    if (searchName === "") {
        request("http://www.omdbapi.com/?t=Mr. Nobody&y=&plot=short&apikey=trilogy", function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var result = JSON.parse(body)
                console.log("Title: " + result.Title);
                console.log("Year: " + result.Year);
                console.log(`${result.Ratings[0].Source}: ${result.Ratings[0].Value}`);
                console.log(`${result.Ratings[1].Source}: ${result.Ratings[1].Value}`);
                console.log("Country: " + result.Country);
                console.log("Language(s): " + result.Language);
                console.log("Plot: " + result.Plot);
                console.log("Actors: " + result.Actors);
                fs.appendFile("log.txt", `\n\nTitle: ${result.Title}\nYear: ${result.Year}\n${result.Ratings[0].Source}: ${result.Ratings[0].Value}\n${result.Ratings[1].Source}: ${result.Ratings[1].Value}\nCountry: ${result.Country}\nLanguage(s): ${result.Language}\nPlot: ${result.Plot}\nActors: ${result.Actors}`, function (err) {
                    if (err) {
                        console.log(err);
                    }
                })
            }
        })
    } else {
        request(queryUrl, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                if (JSON.parse(body).Error === "Movie not found!") {
                    console.log("Movie not found");
                    fs.appendFile("log.txt", "\n\nMovie not found!", function (err) {
                        if (err) {
                            console.log(err);
                        }
                    })
                } else {
                    var result = JSON.parse(body);
                    console.log("Title: " + result.Title);
                    console.log("Year: " + result.Year);
                    console.log(`${result.Ratings[0].Source}: ${result.Ratings[0].Value}`);
                    console.log(`${result.Ratings[1].Source}: ${result.Ratings[1].Value}`);
                    console.log("Country: " + result.Country);
                    console.log("Language(s): " + result.Language);
                    console.log("Plot: " + result.Plot);
                    console.log("Actors: " + result.Actors);
                    fs.appendFile("log.txt", `\n\nTitle: ${result.Title}\nYear: ${result.Year}\n${result.Ratings[0].Source}: ${result.Ratings[0].Value}\n${result.Ratings[1].Source}: ${result.Ratings[1].Value}\nCountry: ${result.Country}\nLanguage(s): ${result.Language}\nPlot: ${result.Plot}\nActors: ${result.Actors}`, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    })
                }
            } else {
                console.log("Something went wrong");
            }
        })
    }
}

// Twitter Request
function userTweet() {
    client.get('statuses/user_timeline', params, function searchedData(err, data, response) {
        if (err) {
            return console.log(err);
        }
        fs.appendFile("log.txt", "\n\nTweets:", function (err) {
            if (err) {
                console.log(err);
            }
        })
        for (var i = 0; i < data.length; i++) {
            console.log(data[i].text);
            console.log(data[i].created_at);
            console.log("");
            fs.appendFile("log.txt", `\n\n${data[i].text}\n${data[i].created_at}`, function (err) {
                if (err) {
                    console.log(err);
                }
            })
        }
    });
}

// History Function
function history() {
    fs.readFile("log.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        if (data === "") {
            console.log("\nNothing to Show\n");
        } else {
            console.log("User History:" + data + "\n\n");
        }
    })
}

// Do what it says input
function dwis() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(", ");
        command = dataArr[0];
        searchName = dataArr[1];
        switch (command) {
            case "spotify-this-song":
                userSpotify();
                break;

            case "movie-this":
                userMovie();
                break;

            case "my-tweets":
                userTweet();
                break;

            case "history":
                history();
                break;
        }
    })
}