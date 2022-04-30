import axios from './hn-axios';
import type { IItem } from 'hacker-news-api-types';

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

async function postTweetsAsThread(tweets: string[]) {
  console.log(tweets);
}

export default async function main() {
  const hnPosts = await fetchTopContent();
  const tweets = generateTweets(hnPosts);
  await postTweetsAsThread(tweets);
}
