const crypto = require("crypto");

const TrelloSource = require("./trello-source.js");

export const getDigest = type => {
  return crypto
    .createHash(`md5`)
    .update(JSON.stringify(type))
    .digest(`hex`);
};

export const sourceNodes = async (
  { boundActionCreators },
  { apiKey, apiToken, verboseOutput = false }
) => {
  const { createNode } = boundActionCreators;

  try {
    const source = new TrelloSource(apiKey, apiToken);
    const { data } = await source.getTeam();
    const boardIDs = data.idBoards;

    const promises = boardIDs.map(id => source.getBoard(id));

    Promise.all(promises).then(async boards => {
      boards.map(board => {
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
    console.log(verboseOutput);
    process.exit(1);
  }
};
