"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
class Account {
    constructor(connection, accountId) {
        this.connection = connection;
        this.accountId = accountId;
    }
    async state() {
        return this.connection.provider.status();
    }
}
exports.Account = Account;
