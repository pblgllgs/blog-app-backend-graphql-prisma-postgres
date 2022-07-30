"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authResolvers = void 0;
var validator_1 = __importDefault(require("validator"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.authResolvers = {
    signup: function (_, _a, _b) {
        var credentials = _a.credentials, name = _a.name, bio = _a.bio;
        var prisma = _b.prisma;
        return __awaiter(void 0, void 0, void 0, function () {
            var email, password, isEmail, isValidPassword, isValidName, hashedPassword, user, token;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        email = credentials.email, password = credentials.password;
                        isEmail = validator_1.default.isEmail(email);
                        if (!isEmail) {
                            return [2, {
                                    userErrors: [{
                                            message: 'Email is invalid'
                                        }],
                                    token: null
                                }];
                        }
                        isValidPassword = validator_1.default.isLength(password, { min: 6 });
                        if (!isValidPassword) {
                            return [2, {
                                    userErrors: [{
                                            message: 'Password is invalid, password must be at least 6 characters'
                                        }],
                                    token: null
                                }];
                        }
                        isValidName = validator_1.default.isLength(name, { min: 2 });
                        if (!isValidName) {
                            return [2, {
                                    userErrors: [{
                                            message: 'Name is invalid, name must be at least 2 characters'
                                        }],
                                    token: null
                                }];
                        }
                        if (!name || !bio) {
                            return [2, {
                                    userErrors: [{
                                            message: 'Name and bio are invalid'
                                        }],
                                    token: null
                                }];
                        }
                        return [4, bcryptjs_1.default.hash(password, 10)];
                    case 1:
                        hashedPassword = _c.sent();
                        return [4, prisma.user.create({
                                data: {
                                    email: email,
                                    name: name,
                                    password: hashedPassword
                                }
                            })];
                    case 2:
                        user = _c.sent();
                        return [4, prisma.profile.create({
                                data: {
                                    bio: bio,
                                    userId: user.id
                                }
                            })];
                    case 3:
                        _c.sent();
                        return [4, jsonwebtoken_1.default.sign({
                                userId: user.id,
                                email: user.email,
                            }, process.env.JWT_SECRET, {
                                expiresIn: 3600000
                            })];
                    case 4:
                        token = _c.sent();
                        return [2, {
                                userErrors: [],
                                token: token
                            }];
                }
            });
        });
    },
    signin: function (_, _a, _b) {
        var credentials = _a.credentials;
        var prisma = _b.prisma;
        return __awaiter(void 0, void 0, void 0, function () {
            var email, password, user, isValidPassword, token;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        email = credentials.email, password = credentials.password;
                        return [4, prisma.user.findUnique({
                                where: {
                                    email: email
                                }
                            })];
                    case 1:
                        user = _c.sent();
                        if (!user) {
                            return [2, {
                                    userErrors: [{
                                            message: 'credentials are invalid'
                                        }],
                                    token: null
                                }];
                        }
                        return [4, bcryptjs_1.default.compare(password, user.password)];
                    case 2:
                        isValidPassword = _c.sent();
                        if (!isValidPassword) {
                            return [2, {
                                    userErrors: [{
                                            message: 'credentials are invalid'
                                        }],
                                    token: null
                                }];
                        }
                        return [4, jsonwebtoken_1.default.sign({
                                userId: user.id,
                                email: user.email,
                            }, process.env.JWT_SECRET, {
                                expiresIn: 3600000
                            })];
                    case 3:
                        token = _c.sent();
                        return [2, {
                                userErrors: [],
                                token: token
                            }];
                }
            });
        });
    }
};
