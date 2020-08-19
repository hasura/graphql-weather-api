const fetch = require("node-fetch");
const { ApolloServer } = require("apollo-server");
const schema = require("./schema");

// const METAWEATHER_API_URL = "https://www.metaweather.com/api/location/";

// const typeDefs = gql`;
//   type CityWeather {
//     temp: String
//     min_temp: String
//     max_temp: String
//     city_name: String!
//     applicable_date: String!
//   }

//   type Query {
//     cityWeather(city_name: String!, applicable_date: String): CityWeather
//   }
// `;

// get weather data using woeid
// function getWeather(data) {
//   return fetch(METAWEATHER_API_URL + data.woeid).then((response) =>
//     response.json()
//   );
// }

// get woeid (where on earth id) using city name
// function getWoeid(place) {
//   return fetch(`${METAWEATHER_API_URL}search/?query=${place}`)
//     .then((response) => response.json())
//     .then((jsonResponse) => jsonResponse[0]);
// }

// resolvers -> get where on earth id -> get consolidated_weather data and return
// const resolvers = {
//   Query: {
//     cityWeather: (root, args, context, info) => {
//       return getWoeid(args.city_name).then(function (response) {
//         if (!response) {
//           return null;
//         }
//         return getWeather(response).then(function (weather) {
//           if (!weather) {
//             return null;
//           }
//           let consolidated_weather = weather.consolidated_weather;
//           // check for args applicable_date to apply filter
//           consolidated_weather = args.applicable_date
//             ? consolidated_weather.find(
//                 (item) => item.applicable_date == args.applicable_date
//               )
//             : consolidated_weather[0];
//           const respObj = {
//             temp: consolidated_weather.the_temp.toString(),
//             min_temp: consolidated_weather.min_temp.toString(),
//             max_temp: consolidated_weather.max_temp.toString(),
//             city_name: weather.title,
//             applicable_date: consolidated_weather.applicable_date,
//           };
//           return respObj;
//         });
//       });
//     },
//   },
// };

const server = new ApolloServer({
  schema,
  introspection: true,
  playground: true,
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
