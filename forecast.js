if (process.argv.length != 3) {
    console.error("You must specify one argument, a zip code!");
    process.exit();
}
var zip = process.argv[2];

var http = require("http");
var fs = require('fs');

var api_key = fs.readFileSync("./api_key.txt", "utf-8");


function printWeatherReport(zipcode, citystate, weather, temperature, feelslike) {
    console.log("\nToday's weather report for " + citystate + " " + zipcode + ":\nWeather: "
        +  weather + "\nTemperature: " + temperature + "\nFeels like: " + feelslike + "\n"
        + "(Powered by http://www.wunderground.com/)\n");
}

function getWeather(zipcode) {
    var req = http.get("http://api.wunderground.com/api/"
        + api_key + "/conditions/q/" + zip + ".json", function(response){
            var weatherInfo = "";
            response.on('data', function(chunk) {
                weatherInfo += chunk;
            });
            response.on('end', function() {
                if(response.statusCode === 200) {
                    try {
                        var report = JSON.parse(weatherInfo);
                        printWeatherReport(zipcode,
                            report.current_observation.display_location.full, 
                            report.current_observation.weather,
                            report.current_observation.temperature_string,
                            report.current_observation.feelslike_string);
                    } catch(error) {
                        console.error(error.message);
                    }
                } else {
                    console.error("There was an error getting the weather for " + zipcode + ": "
                        + http.STATUS_CODES[response.statusCode]);
                }
            });
        });
}


getWeather(zip);