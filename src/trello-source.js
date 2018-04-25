const axios = require("axios");
const qs = require("query-string");

class TrelloSource {
  trelloURL = "https://api.trello.com/1";

  constructor(key = "", token = "") {
    if (key.length === 0) console.error(`key must be supplied`);
    if (token.length === 0) console.error(`token must be supplied`);

    this.credentials = { key, token };
  }

  getBoard(id) {
    const params = {
      fields: "all",
      lists: "all",
      cards: "visible",
      customFields: true
    };
    const query = qs.stringify(...params, ...this.credentials);
    const url = `${this.trelloURL}/boards/${id}?${query}`;

    return axios.get(url);
  }

  getTeam() {
    const params = {
      fields: "all"
    };
    const query = qs.stringify(...params, ...this.credentials);
    const url = `${this.trelloURL}/members/me?${query}`;

    return axios.get(url);
  }
}

export default TrelloSource;
