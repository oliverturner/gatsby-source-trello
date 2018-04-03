"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sourceNodes = void 0;

var _assign = _interopRequireDefault(require("@babel/runtime/core-js/object/assign"));

var _stringify = _interopRequireDefault(require("@babel/runtime/core-js/json/stringify"));

var _promise = _interopRequireDefault(require("@babel/runtime/core-js/promise"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const TrelloSource = require("./fetch.js");

const crypto = require("crypto");

let _verbose;

let _apiKey;

let _secret;

let _teamId;

const sourceNodes =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* ({
    boundActionCreators
  }, {
    apiKey,
    secret,
    teamId,
    verboseOutput = false
  }) {
    const createNode = boundActionCreators.createNode;
    _verbose = verboseOutput;
    _apiKey = apiKey;
    _secret = secret;
    _teamId = teamId;

    try {
      const fetcher = new TrelloSource(_apiKey, _secret);
      const raw = yield fetcher.getTeam(_teamId);
      const data = JSON.parse(raw);
      const boardIDs = data.idBoards;
      const promiseArray = [];
      boardIDs.map(
      /*#__PURE__*/
      function () {
        var _ref2 = (0, _asyncToGenerator2.default)(function* (id) {
          promiseArray.push(fetcher.getBoards(id));
        });

        return function (_x3) {
          return _ref2.apply(this, arguments);
        };
      }());
      yield _promise.default.all(promiseArray).then(
      /*#__PURE__*/
      function () {
        var _ref3 = (0, _asyncToGenerator2.default)(function* (boards) {
          boards.map(rawBoard => {
            const board = JSON.parse(rawBoard);
            const cards = board.cards;
            const lists = board.lists;
            const boardDigest = crypto.createHash(`md5`).update((0, _stringify.default)(board)).digest(`hex`);
            const boardNode = (0, _assign.default)(board, {
              children: [],
              parent: `root`,
              lists___NODE: lists.map(list => list.id),
              internal: {
                type: `TrelloBoard`,
                contentDigest: boardDigest
              }
            }); // Create Node for each Card

            cards.map(card => {
              const cardDigest = crypto.createHash(`md5`).update((0, _stringify.default)(card)).digest(`hex`);
              const cardNode = (0, _assign.default)(card, {
                children: [],
                parent: `root`,
                internal: {
                  content: card.desc,
                  mediaType: `text/markdown`,
                  type: `TrelloCard`,
                  contentDigest: cardDigest
                }
              });
              createNode(cardNode);
            }); // Create Node for each list

            lists.map(list => {
              const ownedCards = cards.filter(card => {
                return card.idList === list.id;
              }).map(card => {
                return card.id;
              });
              const listDigest = crypto.createHash(`md5`).update((0, _stringify.default)(list)).digest(`hex`);
              const listNode = (0, _assign.default)(list, {
                children: [],
                parent: `root`,
                cards___NODE: ownedCards,
                internal: {
                  type: `TrelloList`,
                  contentDigest: listDigest
                }
              });
              createNode(listNode);
            });
            createNode(boardNode);
          });
        });

        return function (_x4) {
          return _ref3.apply(this, arguments);
        };
      }());
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });

  return function sourceNodes(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.sourceNodes = sourceNodes;