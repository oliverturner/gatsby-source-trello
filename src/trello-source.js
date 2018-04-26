import axios from "axios";
import qs from "query-string";

class TrelloSource {
  constructor(key = "", token = "") {
    if (key.length === 0) console.error(`missing "key"`);
    if (token.length === 0) console.error(`missing "token"`);

    this.credentials = { key, token };
    this.trelloURL = "https://api.trello.com/1";
  }

  getBoards() {
    const params = {
      fields: "all"
    };
    const query = qs.stringify({...params, ...this.credentials});
    const url = `${this.trelloURL}/members/me?${query}`;

    return axios.get(url);
  }

  getBoard(id) {
    const params = {
      fields: "all",
      lists: "all",
      cards: "visible",
      customFields: true
    };
    const query = qs.stringify({...params, ...this.credentials});
    const url = `${this.trelloURL}/boards/${id}?${query}`;

    console.log(url)

    return axios.get(url);
  }
}

export default TrelloSource;
