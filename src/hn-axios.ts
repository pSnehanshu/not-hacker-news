import Axios from "axios";

const axios = Axios.create({
  baseURL: "https://hacker-news.firebaseio.com/v0/",
});

export default axios;
