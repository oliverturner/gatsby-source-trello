const TrelloSource = require("./fetch.js");
const crypto = require("crypto");

export const getDigest = type => {
  return crypto
    .createHash(`md5`)
    .update(JSON.stringify(type))
    .digest(`hex`);
};

export const sourceNodes = async (
  { boundActionCreators },
  { apiKey, secret, teamId, verboseOutput = false }
) => {
  const { createNode } = boundActionCreators;
  const _verbose = verboseOutput;
  const _apiKey = apiKey;
  const _secret = secret;
  const _teamId = teamId;

  try {
    const fetcher = new TrelloSource(_apiKey, _secret);
    const raw = await fetcher.getTeam(_teamId);
    const data = JSON.parse(raw);
    const boardIDs = data.idBoards;

    const promiseArray = [];

    boardIDs.map(async id => {
      promiseArray.push(fetcher.getBoards(id));
    });

    await Promise.all(promiseArray).then(async boards => {
      boards.map(rawBoard => {
        const board = JSON.parse(rawBoard);
        const { cards, lists } = board;

        const boardNode = Object.assign(board, {
          children: [],
          parent: `root`,
          lists___NODE: lists.map(list => list.id),
          internal: {
            type: `TrelloBoard`,
            contentDigest: getDigest(board)
          }
        });

        // Create Node for each Card
        cards.map(card => {
          const cardNode = Object.assign(card, {
            children: [],
            parent: `root`,
            internal: {
              content: card.desc,
              mediaType: `text/markdown`,
              type: `TrelloCard`,
              contentDigest: getDigest(card)
            }
          });

          createNode(cardNode);
        });

        // Create Node for each list
        lists.map(list => {
          const ownedCards = cards
            .filter(card => card.idList === list.id)
            .map(card => card.id);

          const listNode = Object.assign(list, {
            children: [],
            parent: `root`,
            cards___NODE: ownedCards,
            internal: {
              type: `TrelloList`,
              contentDigest: getDigest(list)
            }
          });

          createNode(listNode);
        });

        createNode(boardNode);
      });
    });
  } catch (error) {
    console.error(error);
    console.log(_verbose);
    process.exit(1);
  }
};
