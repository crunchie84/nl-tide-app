# Dutch Astronomical Tide information

This API + App allow you to retrieve the tide information for a given location at a certain date in the year. 

## Disclaimer

- The information is based on https://getij.rws.nl/ and ingests this datasource to present it in a more easily retrievable way. 
- The presented data is in no way manipulated other then to present the data in a more easily readable format. 
- The tide information is based on the astronimical tide; no local weather conditions will be applied.

## Architecture

This application consists of a few components:

- Async background process to download tide information when not available in our local cache
- Restfull API to retrieve tide info from cache XOR trigger background process to fetch data
- Demo App to render data accessible

## Api spec

- [GET] `/get/location`

Response:

- 200 OK
```
{
    "location": {
        "code": "ROTTDM",
        "name": "Rotterdam"
    },
    "elevationReferencePoint": "NAP",
    "tides": [
        {
        "at": "2020-01-01T03:26:00Z",
        "tide": "LW",
        "elevation": -9
        },
        {
        "at": "2020-01-01T07:36:00Z",
        "tide": "HW",
        "elevation": 117
        },
        {
        "at": "2020-01-01T13:19:00Z",
        "tide": "LW",
        "elevation": -51
        },
        {
        "at": "2020-01-01T20:04:00Z",
        "tide": "HW",
        "elevation": 130
        }
    ]
}
```

- [GET] `/api/tide/{locationcode}/{date}`

response:

200 OK

```
  {
    location: {
      code: 'ROTTDM',
      name: 'Rotterdam'
    },
    elevationReferencePoint: 'NAP',
    tides: [
      {
        at: '2020-01-01T03:26:00Z'
        tide: 'LW'
        elevation: -9
      },
      {
        at: '2020-01-01T03:26:00Z'
        tide: 'LW'
        elevation: -9
      },
      {
        at: '2020-01-01T03:26:00Z'
        tide: 'LW'
        elevation: -9
      }
    ]
  }
```

201 Created

When no data is present in our database for the given `location` but the location code is known we will trigger the async download process. Please retry retrieval of the tides in a few minutes.

404 Not Found

The given `location` is not known.

