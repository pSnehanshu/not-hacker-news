import { AxiosError } from 'axios';
import express from 'express';
import type { IItem } from 'hacker-news-api-types';
import path from 'path';
import axios from './hn-axios';

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => res.sendStatus(200));

app.get('/hn/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: post } = await axios.get<IItem>(`/item/${id}.json`);

    if (!post) {
      return res.sendStatus(404);
    }

    const protocol = 'https';

    res.render('redirect', {
      post,
      host: protocol + '://' + req.get('host'),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Hacker News API error');
  }
});

export default app;
