"use strict";
/**
 * @file Database API helpers.
 * @author Johan Nordberg <code@johan-nordberg.com>
 * @license
 * Copyright (c) 2017 Johan Nordberg. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 *  1. Redistribution of source code must retain the above copyright notice, this
 *     list of conditions and the following disclaimer.
 *
 *  2. Redistribution in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 *
 *  3. Neither the name of the copyright holder nor the names of its contributors
 *     may be used to endorse or promote products derived from this software without
 *     specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
 * OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * You acknowledge that this software is not designed, licensed or intended for use
 * in the design, construction, operation or maintenance of any military facility.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const asset_1 = require("../chain/asset");
class DatabaseAPI {
    constructor(client) {
        this.client = client;
    }
    /**
     * Convenience for calling `database_api`.
     */
    call(method, params) {
        return this.client.call2("condenser_api", method, params);
    }
    /**
     * Return state of server.
     */
    getDynamicGlobalProperties() {
        return this.call("get_dynamic_global_properties");
    }
    /**
     * Return median chain properties decided by witness.
     */
    getChainProperties() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.call("get_chain_properties");
        });
    }
    /**
     * Return all of the state required for a particular url path.
     * @param path Path component of url conforming to condenser's scheme
     *             e.g. `@almost-digital` or `trending/travel`
     */
    getState(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.call("get_state", [path]);
        });
    }
    /**
     * Return median price in HBD for 1 HIVE as reported by the witnesses.
     */
    getCurrentMedianHistoryPrice() {
        return __awaiter(this, void 0, void 0, function* () {
            return asset_1.Price.from(yield this.call("get_current_median_history_price"));
        });
    }
    /**
     * Get list of delegations made by account.
     * @param account Account delegating
     * @param from Delegatee start offset, used for paging.
     * @param limit Number of results, max 1000.
     */
    getVestingDelegations(account, from = "", limit = 1000) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.call("get_vesting_delegations", [account, from, limit]);
        });
    }
    /**
     * Return server config. See:
     * https://github.com/steemit/steem/blob/master/libraries/protocol/include/steemit/protocol/config.hpp
     */
    getConfig() {
        return this.call("get_config");
    }
    /**
     * Return header for *blockNum*.
     */
    getBlockHeader(blockNum) {
        return this.call("get_block_header", [blockNum]);
    }
    /**
     * Return block *blockNum*.
     */
    getBlock(blockNum) {
        return this.call("get_block", [blockNum]);
    }
    /**
     * Return all applied operations in *blockNum*.
     */
    getOperations(blockNum, onlyVirtual = false) {
        return this.call("get_ops_in_block", [blockNum, onlyVirtual]);
    }
    /**
     * Return array of discussions (a.k.a. posts).
     * @param by The type of sorting for the discussions, valid options are:
     *           `active` `blog` `cashout` `children` `comments` `created`
     *           `feed` `hot` `promoted` `trending` `votes`. Note that
     *           for `blog` and `feed` the tag is set to a username.
     */
    getDiscussions(by, query) {
        return this.call(`get_discussions_by_${by}`, [query]);
    }
    /**
     * Return array of account info objects for the usernames passed.
     * @param usernames The accounts to fetch.
     */
    getAccounts(usernames) {
        return this.call("get_accounts", [usernames]);
    }
    /**
     * Returns the details of a transaction based on a transaction id.
     */
    getTransaction(txId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.call("get_transaction", [txId]);
        });
    }
    /**
     * Returns one or more account history objects for account operations
     *
     * @param account The account to fetch
     * @param from The starting index
     * @param limit The maximum number of results to return
     * @param operations_bitmask Generated by dhive.utils.makeBitMaskFilter() - see example below
     * @example
     * const op = dhive.utils.operationOrders
     * const operationsBitmask = dhive.utils.makeBitMaskFilter([
     *   op.transfer,
     *   op.transfer_to_vesting,
     *   op.withdraw_vesting,
     *   op.interest,
     *   op.liquidity_reward,
     *   op.transfer_to_savings,
     *   op.transfer_from_savings,
     *   op.escrow_transfer,
     *   op.cancel_transfer_from_savings,
     *   op.escrow_approve,
     *   op.escrow_dispute,
     *   op.escrow_release,
     *   op.fill_convert_request,
     *   op.fill_order,
     *   op.claim_reward_balance,
     * ])
     */
    getAccountHistory(account, from, limit, operation_bitmask) {
        let params = [account, from, limit];
        if (operation_bitmask && Array.isArray(operation_bitmask)) {
            if (operation_bitmask.length !== 2) {
                throw Error('operation_bitmask should be generated by the helper function');
                console.error("operation_bitmask should be generated by the helper function");
                // process.exit(1);
            }
            params = params.concat(operation_bitmask);
        }
        return this.call("get_account_history", params);
    }
    /**
     * Verify signed transaction.
     */
    verifyAuthority(stx) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.call("verify_authority", [stx]);
        });
    }
    /** return rpc node version */
    getVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.call("get_version", []);
        });
    }
}
exports.DatabaseAPI = DatabaseAPI;
