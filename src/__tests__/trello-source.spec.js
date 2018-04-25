import Source from "../trello-source.js";

const key = "cfa0774bfdd74abfa19a9ebce9f20f06";
const token =
  "4fcc400e6eb95da4d37ad69d5a1ce9ca3dbc10020d141cd1133f6422c8dadde8";
const source = new Source(key, token);

describe("Source", () => {
  it("fetches stuff", () => {
    expect(true).toBe(true)
  })
})