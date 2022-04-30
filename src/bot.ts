import type { IItem } from 'hacker-news-api-types';
import { CreateTweetParams, TwitterClient } from 'twitter-api-client';
import axios from './hn-axios';

const wait = (ms = 0) =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

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
    (post, index) =>
      `${index === 0 ? 'Trending on Hacker News:\n\n' : ''}${post.title} (${
        post.score
      } pt) https://not-hacker-news.fly.dev/hn/${post.id}`,
  );

  return tweets;
}

async function postTweetsAsThread(tweets: string[]) {
  let lastTweetId: string = '';

  for (const tweet of tweets) {
    try {
      const params: CreateTweetParams = {
        text: tweet,
      };

      if (lastTweetId) {
        params.reply = {
          in_reply_to_tweet_id: lastTweetId,
        };
      }

      const { data } = await twitter.tweetsV2.createTweet(params);

      lastTweetId = data.id;

      console.log('Tweet created', data.id, data.text);
    } catch (error) {
      console.error('Error while tweeting', tweet, error);
    }

    await wait(5000);
  }
}

export default async function main() {
  const hnPosts = await fetchTopContent();
  const tweets = generateTweets(hnPosts);
  await postTweetsAsThread(tweets);
}
