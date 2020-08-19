const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLFloat,
} = require("graphql");

const weatherForecastType = new GraphQLObjectType({
  name: "WeatherForecast",
  description: "Fields and iterable objects with weather data",
  fields: () => ({
    cod: { type: GraphQLString, description: "`code` Internal parameter" },
    message: { type: GraphQLInt, description: "`message` Internal parameter " },
    cnt: {
      type: GraphQLInt,
      description: "Number of lines returned by this API call ",
    },
    city: {
      type: cityType,
      description: "Object with city/location information.",
    },
    list: { type: new GraphQLList(listType) },
    tempFAvg: {
      type: GraphQLFloat,
      resolve: (obj) => {
        const avgTemp =
          obj.list
            .map((weather) => weather.main.temp)
            .reduce((a, b) => a + b, 0) / obj.list.length;
        return _to_farenheit(avgTemp);
      },
    },
    tempCAvg: {
      type: GraphQLFloat,
      resolve: (obj) => {
        const avgTemp =
          obj.list
            .map((weather) => weather.main.temp)
            .reduce((a, b) => a + b, 0) / obj.list.length;
        return _to_celsius(avgTemp);
      },
    },
    pressureAvg: {
      type: GraphQLFloat,
      resolve: (obj) => {
        const avgPressure =
          obj.list
            .map((weather) => weather.main.pressure)
            .reduce((a, b) => a + b, 0) / obj.list.length;
        return avgPressure.toFixed(2);
      },
    },
    humidityAvg: {
      type: GraphQLFloat,
      resolve: (obj) => {
        const avghumidity =
          obj.list
            .map((weather) => weather.main.humidity)
            .reduce((a, b) => a + b, 0) / obj.list.length;
        return avghumidity.toFixed(2);
      },
    },
    pressureData: {
      type: new GraphQLList(GraphQLFloat),
      description: "Atmospheric pressure on the sea level by default, hPa",
      resolve: (obj) => {
        return obj.list.map((weather) => weather.main.pressure);
      },
    },
    humidityData: {
      type: new GraphQLList(GraphQLFloat),
      description: "Humidity, %",
      resolve: (obj) => {
        return obj.list.map((weather) => weather.main.humidity);
      },
    },
    tempFData: {
      type: new GraphQLList(GraphQLFloat),
      resolve: (obj) => {
        return obj.list.map((weather) => _to_farenheit(weather.main.temp));
      },
    },
  }),
});

const _to_farenheit = (temp) => {
  return ((temp * 9) / 5 - 459.67).toFixed(2);
};

const _to_celsius = (temp) => {
  return (temp - 273.15).toFixed(2);
};

const cityType = new GraphQLObjectType({
  name: "City",
  fields: () => ({
    id: { type: GraphQLID, description: "City ID" },
    name: { type: GraphQLString, description: "City name" },
    country: { type: GraphQLString, description: "Country code (GB, JP etc.)" },
    timezone: { type: GraphQLInt, description: "Shift in seconds from UTC" },
    coord: { type: coordType, description: "City coordinate object" },
  }),
});

const coordType = new GraphQLObjectType({
  name: "Coordinates",
  fields: () => ({
    lon: { type: GraphQLFloat, description: "City geo location, longitude" },
    lat: { type: GraphQLFloat, description: "City geo location, latitude" },
  }),
});

const listType = new GraphQLObjectType({
  name: "List",
  description: "list of 5 day weather information",
  fields: () => ({
    date: {
      type: GraphQLInt,
      description: "Time of data forecasted, unix, UTC",
      resolve: (obj) => {
        return obj.dt;
      },
    },
    dateText: {
      type: GraphQLString,
      description: "Time of data forecasted, ISO, UTC",
      resolve: (obj) => {
        return obj.dt_txt;
      },
    },
    main: { type: mainType },
    weather: {
      type: new GraphQLList(weatherListType),
    },
    wind: { type: windType },
    clouds: { type: cloudsType },
    precipProbability: {
      type: GraphQLFloat,
      description: "Probability of precipitation in %",
      resolve: (obj) => {
        return obj.pop * 100;
      },
    },
    visibility: {
      type: GraphQLInt,
      description: "Average visibility, metres",
    },
  }),
});

const mainType = new GraphQLObjectType({
  name: "Main",
  description: "Main Weather Information",
  fields: () => ({
    temp: {
      type: GraphQLFloat,
      description:
        "Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.",
    },
    feelsLikeF: {
      type: GraphQLFloat,
      description:
        "Temperature in farenheit. This temperature parameter accounts for the human perception of weather.",
      resolve: (obj) => {
        return _to_farenheit(obj.feels_like);
      },
    },
    feelsLikeC: {
      type: GraphQLFloat,
      description:
        "Temperature in celsius. This temperature parameter accounts for the human perception of weather.",
      resolve: (obj) => {
        return _to_celsius(obj.feels_like);
      },
    },
    minTempF: {
      type: GraphQLFloat,
      description: "Minimum temperature in farenheit",
      resolve: (obj) => {
        return _to_farenheit(obj.temp_min);
      },
    },
    minTempC: {
      type: GraphQLFloat,
      description: "Minimum temperature in celsius",
      resolve: (obj) => {
        return _to_celsius(obj.temp_min);
      },
    },
    maxTempF: {
      type: GraphQLFloat,
      description: "Maximum temperature in farenheit",
      resolve: (obj) => {
        return _to_farenheit(obj.temp_max);
      },
    },
    maxTempC: {
      type: GraphQLFloat,
      description: "Maximum temperature in celsius",
      resolve: (obj) => {
        return _to_celsius(obj.temp_max);
      },
    },
    seaLevel: {
      type: GraphQLFloat,
      description: "Atmospheric pressure on the sea level, hPa",
      resolve: (obj) => {
        return obj.sea_level;
      },
    },
    groundLevel: {
      type: GraphQLFloat,
      description: " Atmospheric pressure on the ground level, hPa",
      resolve: (obj) => {
        return obj.grnd_level;
      },
    },
    pressure: {
      type: GraphQLInt,
      description: "Atmospheric pressure on the sea level by default, hPa",
    },
    humidity: {
      type: GraphQLInt,
      description: "Humidity, %",
    },
    temp_kf: { type: GraphQLFloat, description: "Internal parameter" },
    tempF: {
      type: GraphQLFloat,
      description: "Temperature in Fahrenheit",
      resolve: (obj) => {
        return _to_farenheit(obj.temp);
      },
    },
    tempC: {
      type: GraphQLFloat,
      description: "Temperature in Celsius",
      resolve: (obj) => {
        return _to_celsius(obj.temp);
      },
    },
  }),
});

const weatherListType = new GraphQLObjectType({
  name: "WeatherList",
  description: "Weather information for that day",
  fields: () => ({
    id: { type: GraphQLID, description: "Weather condition id" },
    main: {
      type: GraphQLString,
      description: "Group of weather parameters (Rain, Snow, Extreme etc.)",
    },
    description: {
      type: GraphQLString,
      description:
        "Weather condition within the group. You can get the output in your language. https://openweathermap.org/forecast5#multi",
    },
    icon: { type: GraphQLString, description: "Weather icon id" },
  }),
});

const windType = new GraphQLObjectType({
  name: "Wind",
  fields: () => ({
    speed: {
      type: GraphQLFloat,
      description:
        "Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour.",
    },
    deg: {
      type: GraphQLFloat,
      description: "Wind direction, degrees (meteorological)",
    },
  }),
});

const cloudsType = new GraphQLObjectType({
  name: "Clouds",
  fields: () => ({
    all: { type: GraphQLInt, description: "Cloudiness, %" },
  }),
});

module.exports = weatherForecastType;
