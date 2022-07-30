"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
exports.Profile = {
    user: function (parent, __, _a) {
        var prisma = _a.prisma;
        return prisma.user.findUnique({
            where: {
                id: parent.userId
            }
        });
    }
};
