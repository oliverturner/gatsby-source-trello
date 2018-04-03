const request = require("request-promise-native");

class TrelloSource {
  constructor(key = "", token = "") {
    if (key.length === 0) console.error(`key must be supplied`);
    if (token.length === 0) console.error(`token must be supplied`);

    this.credentials = `key=${key}&token=${token}`;
    this.trelloURL = "https://api.trello.com/1";
  }

  async getBoards(id) {
    const url = `${
      this.trelloURL
    }/boards/${id}?fields=all&lists=all&cards=all&${this.credentials}`;
    const data = await request.get(url);

    return data;
  }

  async getTeam() {
    const url = `${this.trelloURL}/members/me?fields=all&${this.credentials}`;
    const data = await request.get(url);

    return data;
  }
}

export default TrelloSource;
