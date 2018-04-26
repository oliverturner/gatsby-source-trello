require("dotenv").config();

import TrelloSource from "../trello-source.js";

describe("Source", () => {
  it("warns on missing config", () => {
    let outputData = "";
    const storeLog = inputs => (outputData += inputs);
    console["error"] = jest.fn(storeLog);
    new TrelloSource();
    expect(outputData).toBe(`missing "key"missing "token"`);
  });

  it("fetches member boards", async () => {
    const src = new TrelloSource(
      process.env.TRELLO_KEY,
      process.env.TRELLO_TOKEN
    );
    const team = await src.getBoards();
    // console.log("team", team.data);
    expect(true).toBe(true);
  });

  it("fetches board", async () => {
    const src = new TrelloSource(
      process.env.TRELLO_KEY,
      process.env.TRELLO_TOKEN
    );
    const boardId = "58bffe965415a2a276e91a2f"
    const board = await src.getBoard(boardId);
    // console.log("board", board.data);
    expect(true).toBe(true);
  });
});
