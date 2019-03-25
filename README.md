## To-do list

- Set up development environment (Docker, Node, PostgreSQL)
- Set up  models (PeriodicForecast, DayForecast, Location)
- Write tests (API calls, and fetching from external API)
- Set up background job for populating weather info
- API calls (/today?location=<x>)
- Clean up

## Flow

Q. Is there a forecast for today in this location?

A. YES - fetch from database

A.  NO - fetch from external API
a) save data to database and parse
b) respond parsed data from external fetch (no waiting)


---

Weather icons - different for each weather API. Map to own weather icon service.

---

Run the application:

```
docker-compose up
```

Run the tests:

```
docker-compose run app npm test
```
