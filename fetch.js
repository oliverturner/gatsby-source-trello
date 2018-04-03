"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const request = require("request-promise-native");

class TrelloSource {
  constructor(key = "", token = "") {
    if (key.length === 0) console.error(`key must be supplied`);
    if (token.length === 0) console.error(`token must be supplied`);
    this.credentials = `key=${key}&token=${token}`;
    this.trelloURL = "https://api.trello.com/1";
  }

  getBoards(id) {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      const url = `${_this.trelloURL}/boards/${id}?fields=all&lists=all&cards=all&${_this.credentials}`;
      const data = yield request.get(url);
      return data;
    })();
  }

  getTeam() {
    var _this2 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      const url = `${_this2.trelloURL}/members/me?fields=all&${_this2.credentials}`;
      const data = yield request.get(url);
      return data;
    })();
  }

}

var _default = TrelloSource;
exports.default = _default;