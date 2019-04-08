# Weather Forecast

An API service built in Node.js that retrieves today's forecast in three-hourly periods for a specified city. The API returns a JSON response of, at least, the temperature (in Celsius and Fahrenheit), wind (degrees and direction), precipitation, weather icons, and the times of the sunrise and sunset.

The demo project can be found here: https://polar-wave-53959.herokuapp.com/ (It's hosted on the free-tier of Heroku so it'll take a while to warm up on the first request!)

## Requirements

The API is built in Node.js and PostgreSQL, chosen for the relational data.

To install the app locally, [Docker Compose](https://docs.docker.com/compose/install/) (~> v.1.23) is needed.

The API fetches weather data from a third-party. Right now, the service of choice is [World Weather Online](https://www.worldweatheronline.com/developer/). An API key (free for 60 days) is required and should be defined in the _.env_ file.

## Installation

Clone the repository, and once in — define your environment variables in _.env.sample_ and then rename it to _.env_ without the _.sample_ at the end.

Then:

```
docker-compose build
docker-compose up
```

Set up the database and migrations:
```
docker-compose run app npx sequelize db:create
docker-compose run app npx sequelize db:migrate
```

The local site will be available on port 3000: [localhost:3000](localhost:3000)

It is possible to launch the app without Docker, by instantiating a local PostgreSQL instance and running:

```
npm install
npm start
```

### Tests


```
docker-compose run app npm test
```

## Usage

| ROUTE | METHOD | REQUEST                       | RESPONSE FORMAT  |
|-------|--------|-------------------------------|------------------|
| /     | GET    | city={city}&country={country} | JSON             |

e.g. https://polar-wave-53959.herokuapp.com/?city=Amsterdam&Country=Netherlands

#### Responses

**200 OK**

Request parameters:
* City: Amsterdam
* Country: Netherlands

```
{
    "data": {
        "date": "2019-04-12T00:00:00+02:00",
        "sunrise": "2019-04-12T06:50:00+02:00",
        "sunset": "2019-04-12T20:32:00+02:00",
        "maxTempCelsius": 9,
        "minTempCelsius": 3,
        "maxTempFahrenheit": 48,
        "minTempFahrenheit": 38,
        "Location": {
            "city": "Amsterdam",
            "country": "Netherlands",
            "timezone": "Europe/Amsterdam",
            "latitude": 52.374,
            "longitude": 4.89
        },
        "PeriodicForecasts": [
            {
                "startDate": "2019-04-12T00:00:00+02:00",
                "endDate": "2019-04-12T03:00:00+02:00",
                "tempCelsius": 6,
                "tempFahrenheit": 42,
                "tempFeelsLikeCelsius": 3,
                "tempFeelsLikeFahrenheit": 37,
                "windSpeedMiles": 8,
                "windSpeedKmph": 12,
                "windDegrees": 52,
                "precipitation": 0,
                "chanceOfRain": 0,
                "chanceOfWind": 0,
                "chanceOfSnow": 0,
                "weatherIconId": "116",
                "weatherIconUrl": "http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png",
                "weatherDescription": "Partly cloudy",
                "textToSpeech": "It's going to be partly cloudy with a temperature of 6 degrees. It will feel like 3."
            },

            ...
        ]
    }
}
```

**400 Bad Request**

Request parameters:
* City: [blank]
* Country: [blank]

```
{
    "message": "Need `city` and `country` parameter."
}
```

**400 Bad Request**

Request parameters:
* City: Tokyo
* Country: Netherlands

```
{
    "message": "Sorry. We couldn't find that city and country combination!"
}
```

**500 Internal Server Error**

```
{
  "message": "We couldn't fetch the forecast from the external weather service."
}
```

## Flow

The user is based in Amsterdam, Netherlands. They ask their phone app what the weather is like. The phone app calls this API to retrieve the current day's forecast for Amsterdam. The API first looks for _Amsterdam, Netherlands_ in the database (using the _Location_ model). If it doesn't find it, it creates it.

Then the API searches for today's forecast for Amsterdam (using the _DayForecast_ model). If it finds it, it fetches it and sends it to the phone app in a clear JSON-formatted response with data relating to the day forecast (e.g. sunrise and sunset, the maximum and minimum temperature) and an array of much more comprehensive periodic forecasts in three-hourly intervals (the _PeriodicForecasts_ model).

Each periodic forecast has a `textToSpeech` field which is an English-language sentence (or two) about the weather during that period. This is for the mobile app to read off in response to the verbal command: "Can you give me the forecast for the next three hours?"

If the API doesn't find the day's forecast in the database, however, then it starts working on fetching it from an external weather API. Once data has been obtained, the API parses it so it can be standardised and sent to the database. When the forecast has been uploaded, the API then returns the forecast with the above content.

Response time from the very first request for a specific city, from any user, will be a little slower than requests that follow. [Postman](https://www.getpostman.com/) calculated the first request for a forecast to be 254ms. The second request was 62ms.

## Decisions and future improvements

The API could be a lot simpler by cutting out the middle layer of parsing, but I chose to do this for a couple of reasons. Firstly, I wanted to standardise the forecast data so the receiving mobile apps would know the data format coming through.

Secondly, I didn't want to be reliant on one weather API service. On researching, for example, I saw that the _Yahoo! Weather API_ had been retired earlier this year. I think it's important that if a couple of mobiles apps and hundreds of thousands of users are depending on this API, then it makes sense to try to de-couple it as much as you can from an external service. This way, if a service retires, it is only this API that needs to update code, not the other mobile apps.

Relatedly — the weather codes and icon URLs are different for each external weather service, and right now, the parser saves them as-is from the service. To build this out, I would map the codes/URLs locally. This gives an advantage of being able to use company-specific icons and URLs.

The `textToSpeech()` function only spits out basic information, based on the three-hour interval, in English. For really great user experience, it should be easily translated/multilingual.

On the forecast fetching front -- it's possible with World Weather Online to fetch up to fifteen days of forecasts. I chose to fetch per day because, I'm no meteorologist, I think it's better to try to get as-accurate weather information as possible.

In addition, as the very first forecast request, resulting in calling the third party service, takes a little bit of time to complete, it could be worth a background job that runs through all the locations saved in the database and fetches the day's forecasts pre-emptively in the early morning. Then when a user requests the forecast, the response is quicker, querying only the local database.

Regarding the stack: I realised too late that Redis might have been a nicer option, especially with regards to caching and mobile latency. I chose not to implement it for time reasons, but I would recommend myself to explore that in the future. In addition, Express might not have been entirely necessary for this little project, but it was quick to initially setup so I stuck with it.

Effectively, having only dabbled a little in Node.js and JavaScript previously, I had to learn a lot for this project. I'm certain there are better ways for me to structure this app -- and I'm eager to learn -- and Node.js/Express applications in general!
