"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postResolvers = void 0;
var canUserMutatePost_1 = require("../utils/canUserMutatePost");
exports.postResolvers = {
    postCreate: function (_, _a, _b) {
        var post = _a.post;
        var prisma = _b.prisma, userInfo = _b.userInfo;
        return __awaiter(void 0, void 0, void 0, function () {
            var title, content;
            return __generator(this, function (_c) {
                if (!userInfo) {
                    return [2, {
                            userErrors: [{
                                    message: 'You must be logged in to create a post'
                                }],
                            post: null
                        }];
                }
                title = post.title, content = post.content;
                if (!title || !content) {
                    return [2, {
                            userErrors: [{
                                    message: 'Title and content are required'
                                }],
                            post: null
                        }];
                }
                return [2, {
                        userErrors: [],
                        post: prisma.post.create({
                            data: {
                                title: title,
                                content: content,
                                authorId: userInfo.userId
                            }
                        })
                    }];
            });
        });
    },
    postUpdate: function (_, _a, _b) {
        var post = _a.post, postId = _a.postId;
        var prisma = _b.prisma, userInfo = _b.userInfo;
        return __awaiter(void 0, void 0, void 0, function () {
            var error, title, content, existingPost, payloadToUpdate;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!userInfo) {
                            return [2, {
                                    userErrors: [{
                                            message: 'You must be logged in to create a post'
                                        }],
                                    post: null
                                }];
                        }
                        return [4, (0, canUserMutatePost_1.canUserMutatePost)({ userId: userInfo.userId, postId: Number(postId), prisma: prisma })];
                    case 1:
                        error = _c.sent();
                        if (error) {
                            return [2, error];
                        }
                        ;
                        title = post.title, content = post.content;
                        if (!title && !content) {
                            return [2, {
                                    userErrors: [{
                                            message: 'Need yo have al least one field to update'
                                        }],
                                    post: null
                                }];
                        }
                        return [4, prisma.post.findUnique({
                                where: {
                                    id: Number(postId)
                                }
                            })];
                    case 2:
                        existingPost = _c.sent();
                        if (!existingPost) {
                            return [2, {
                                    userErrors: [{
                                            message: 'Post not found'
                                        }],
                                    post: null
                                }];
                        }
                        payloadToUpdate = {
                            title: title,
                            content: content
                        };
                        if (!title)
                            delete payloadToUpdate.title;
                        if (!content)
                            delete payloadToUpdate.content;
                        return [2, {
                                userErrors: [],
                                post: prisma.post.update({
                                    where: {
                                        id: Number(postId)
                                    },
                                    data: __assign({}, payloadToUpdate)
                                })
                            }];
                }
            });
        });
    },
    postDelete: function (_, _a, _b) {
        var postId = _a.postId;
        var prisma = _b.prisma, userInfo = _b.userInfo;
        return __awaiter(void 0, void 0, void 0, function () {
            var error, post;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!userInfo) {
                            return [2, {
                                    userErrors: [{
                                            message: 'You must be logged in to create a post'
                                        }],
                                    post: null
                                }];
                        }
                        return [4, (0, canUserMutatePost_1.canUserMutatePost)({ userId: userInfo.userId, postId: Number(postId), prisma: prisma })];
                    case 1:
                        error = _c.sent();
                        if (error) {
                            return [2, error];
                        }
                        ;
                        return [4, prisma.post.findUnique({
                                where: {
                                    id: Number(postId)
                                }
                            })];
                    case 2:
                        post = _c.sent();
                        if (!post) {
                            return [2, {
                                    userErrors: [{
                                            message: 'Post not found'
                                        }],
                                    post: null
                                }];
                        }
                        return [4, prisma.post.delete({
                                where: {
                                    id: Number(postId)
                                }
                            })];
                    case 3:
                        _c.sent();
                        return [2, {
                                userErrors: [],
                                post: post
                            }];
                }
            });
        });
    },
    postPublish: function (_, _a, _b) {
        var postId = _a.postId;
        var prisma = _b.prisma, userInfo = _b.userInfo;
        return __awaiter(void 0, void 0, void 0, function () {
            var error, post;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!userInfo) {
                            return [2, {
                                    userErrors: [{
                                            message: 'You must be logged in to create a post'
                                        }],
                                    post: null
                                }];
                        }
                        return [4, (0, canUserMutatePost_1.canUserMutatePost)({ userId: userInfo.userId, postId: Number(postId), prisma: prisma })];
                    case 1:
                        error = _c.sent();
                        if (error) {
                            return [2, error];
                        }
                        ;
                        return [4, prisma.post.findUnique({
                                where: {
                                    id: Number(postId)
                                }
                            })];
                    case 2:
                        post = _c.sent();
                        if (!post) {
                            return [2, {
                                    userErrors: [{
                                            message: 'Post not found'
                                        }],
                                    post: null
                                }];
                        }
                        return [2, {
                                userErrors: [],
                                post: prisma.post.update({
                                    where: {
                                        id: Number(postId)
                                    },
                                    data: {
                                        published: true
                                    }
                                })
                            }];
                }
            });
        });
    },
    postUnpublish: function (_, _a, _b) {
        var postId = _a.postId;
        var prisma = _b.prisma, userInfo = _b.userInfo;
        return __awaiter(void 0, void 0, void 0, function () {
            var error, post;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!userInfo) {
                            return [2, {
                                    userErrors: [{
                                            message: 'You must be logged in to create a post'
                                        }],
                                    post: null
                                }];
                        }
                        return [4, (0, canUserMutatePost_1.canUserMutatePost)({ userId: userInfo.userId, postId: Number(postId), prisma: prisma })];
                    case 1:
                        error = _c.sent();
                        if (error) {
                            return [2, error];
                        }
                        ;
                        return [4, prisma.post.findUnique({
                                where: {
                                    id: Number(postId)
                                }
                            })];
                    case 2:
                        post = _c.sent();
                        if (!post) {
                            return [2, {
                                    userErrors: [{
                                            message: 'Post not found'
                                        }],
                                    post: null
                                }];
                        }
                        return [2, {
                                userErrors: [],
                                post: prisma.post.update({
                                    where: {
                                        id: Number(postId)
                                    },
                                    data: {
                                        published: false
                                    }
                                })
                            }];
                }
            });
        });
    },
    changePublishState: function (_, _a, _b) {
        var postId = _a.postId;
        var prisma = _b.prisma, userInfo = _b.userInfo;
        return __awaiter(void 0, void 0, void 0, function () {
            var error, post;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!userInfo) {
                            return [2, {
                                    userErrors: [{
                                            message: 'You must be logged in to create a post'
                                        }],
                                    post: null
                                }];
                        }
                        return [4, (0, canUserMutatePost_1.canUserMutatePost)({ userId: userInfo.userId, postId: Number(postId), prisma: prisma })];
                    case 1:
                        error = _c.sent();
                        if (error) {
                            return [2, error];
                        }
                        ;
                        return [4, prisma.post.findUnique({
                                where: {
                                    id: Number(postId)
                                }
                            })];
                    case 2:
                        post = _c.sent();
                        if (!post) {
                            return [2, {
                                    userErrors: [{
                                            message: 'Post not found'
                                        }],
                                    post: null
                                }];
                        }
                        return [2, {
                                userErrors: [],
                                post: prisma.post.update({
                                    where: {
                                        id: Number(postId)
                                    },
                                    data: {
                                        published: !post.published
                                    }
                                })
                            }];
                }
            });
        });
    },
};
