"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
var userLoader_1 = require("../loaders/userLoader");
exports.Post = {
    user: function (parent, __, _a) {
        var prisma = _a.prisma;
        return userLoader_1.userLoader.load(parent.authorId);
    }
};
