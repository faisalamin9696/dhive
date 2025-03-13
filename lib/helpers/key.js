"use strict";


const { PublicKey } = require('../crypto');
const { Client } = require('./../client');

class AccountByKeyAPI {
    constructor(client) {
        this.client = client;
    }

    /**
     * Convenience for calling `account_by_key_api`.
     */
    call(method, params) {
        return this.client.call2('account_by_key_api', method, params);
    }

    /**
     * Returns all accounts that have the key associated with their owner or active authorities.
     */
    async getKeyReferences(keys) {
        return this.call('get_key_references', { keys: keys.map(key => key.toString()) });
    }
}

module.exports = { AccountByKeyAPI };
