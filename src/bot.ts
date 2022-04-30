import type { IItem } from 'hacker-news-api-types';
import { TwitterClient } from 'twitter-api-client';
import axios from './hn-axios';

const twitter = new TwitterClient({
  apiKey: process.env.TWITTER_API_KEY as string,
  apiSecret: process.env.TWITTER_API_SECRET as string,
  accessToken: process.env.TWITTER_ACCESS_TOKEN as string,
  accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET as string,
});

async function fetchTopContent(): Promise<IItem[]> {
  const { data: topIds } = await axios.get<number[]>('/topstories.json');

  const top5 = topIds.slice(0, 5);

  const top5items = await Promise.all(
    top5.map(itemId =>
      axios
        .get<IItem>(`/item/${itemId}.json`)
        .then(res => res.data)
        .catch<null>(err => {
          console.error(err);
          return null;
        }),
    ),
  );

  return top5items.filter(item => item !== null) as IItem[];
}

function generateTweets(posts: IItem[]) {
  const tweets = posts.map(
    post => `${post.title} https://not-hacker-news.fly.dev/hn/${post.id}`,
  );

  return tweets;
}

function postTweetsAsThread(tweets: string[]) {
  console.log(tweets);

  return Promise.all(
    tweets.map(tweet =>
      twitter.tweetsV2.createTweet({
        text: tweet,
      }),
    ),
  );
}

export default async function main() {
  const hnPosts = await fetchTopContent();
  const tweets = generateTweets(hnPosts);
  await postTweetsAsThread(tweets);
}
