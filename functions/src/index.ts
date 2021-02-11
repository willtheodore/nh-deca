/* eslint-disable indent */
/* eslint-disable object-curly-spacing */
import * as functions from "firebase-functions";
import { apiKey, apiSecretKey } from "../../keys";
const Twitter = require("twitter-v2");

export const fetchTweets = functions.https.onCall((data, context) => {
  const client = new Twitter({
    consumer_key: apiKey,
    consumer_secret: apiSecretKey,
  });

  const path = "/2/tweets/search/recent";
  const params = {
    query: `#${data.hashtag}`,
    max_results: "12",
  };
  client
    .get(path, params)
    .then((res: object) => {
      console.log(res);
      return res;
    })
    .catch((e: Error) => {
      console.log("Error getting tweets by hastag", e);
      throw e;
    });
});
