import fire from "./firebase";
const functions = fire.functions();
const fetchTweets = functions.httpsCallable("fetchTweets");

export async function fetchMedia(token?: string): Promise<any | undefined> {
  try {
    const tweets = await fetchTweets({ pageToken: token ? token : undefined });
    if (tweets !== null) return tweets;
    else throw Error("No response from cloud function");
  } catch (e) {
    console.log("Error fetching tweets", e);
  }
}
