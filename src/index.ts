import cron from "node-cron";
import axios from "./hn-axios";
import type { IItem } from "hacker-news-api-types";

async function fetchTopContent(): Promise<IItem[]> {
  const { data: topIds } = await axios.get<number[]>("/topstories.json");

  const top5 = topIds.slice(0, 5);

  const top5items = await Promise.all(
    top5.map((itemId) => {
      return axios.get<IItem>(`/item/${itemId}.json`).then((res) => res.data);
    })
  );

  return top5items;
}

function generateTweets(posts: IItem[]) {
  const tweets = posts.map(
    (post) =>
      `(${post.score} pt) ${post.title} - https://news.ycombinator.com/item?id=${post.id}`
  );

  return tweets;
}

async function postTweetsAsThread(tweets: string[]) {
  console.log(tweets);
}

async function main() {
  const hnPosts = await fetchTopContent();
  const tweets = generateTweets(hnPosts);
  await postTweetsAsThread(tweets);
}

cron.schedule("0 * * * *", function () {
  main();
});
