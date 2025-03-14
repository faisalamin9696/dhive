/**
 * @file Steem operation type definitions.
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
/// <reference types="node" />
import { PublicKey } from "../crypto";
import { AuthorityType } from "./account";
import { Asset, PriceType } from "./asset";
import { SignedBlockHeader } from "./block";
import { BeneficiaryRoute } from "./comment";
import { ChainProperties, HexBuffer } from "./misc";
/**
 * Operation name.
 */
export declare type OperationName = "account_create" | "account_create_with_delegation" | "account_update" | "account_update2" | "account_witness_proxy" | "account_witness_vote" | "cancel_transfer_from_savings" | "change_recovery_account" | "claim_account" | "claim_reward_balance" | "create_proposal" | "comment" | "comment_options" | "convert" | "create_claimed_account" | "custom" | "custom_binary" | "custom_json" | "decline_voting_rights" | "delegate_vesting_shares" | "delete_comment" | "escrow_approve" | "escrow_dispute" | "escrow_release" | "escrow_transfer" | "feed_publish" | "limit_order_cancel" | "limit_order_create" | "limit_order_create2" | "pow" | "pow2" | "recover_account" | "remove_proposal" | "report_over_production" | "request_account_recovery" | "reset_account" | "set_reset_account" | "set_withdraw_vesting_route" | "transfer" | "transfer_from_savings" | "transfer_to_savings" | "transfer_to_vesting" | "update_proposal_votes" | "vote" | "withdraw_vesting" | "witness_set_properties" | "witness_update" | "update_proposal";
/**
 * Virtual operation name.
 */
export declare type VirtualOperationName = "author_reward" | "comment_benefactor_reward" | "comment_payout_update" | "comment_reward" | "curation_reward" | "fill_convert_request" | "fill_order" | "fill_transfer_from_savings" | "fill_vesting_withdraw" | "hardfork" | "interest" | "liquidity_reward" | "return_vesting_delegation" | "shutdown_witness";
/**
 * Generic operation.
 */
export interface Operation {
    0: OperationName | VirtualOperationName;
    1: {
        [key: string]: any;
    };
}
export interface AppliedOperation {
    trx_id: string;
    block: number;
    trx_in_block: number;
    op_in_trx: number;
    virtual_op: number;
    timestamp: string;
    op: Operation;
}
export interface AccountCreateOperation extends Operation {
    0: "account_create";
    1: {
        fee: string | Asset;
        creator: string;
        new_account_name: string;
        owner: AuthorityType;
        active: AuthorityType;
        posting: AuthorityType;
        memo_key: string | PublicKey;
        json_metadata: string;
    };
}
export interface AccountCreateWithDelegationOperation extends Operation {
    0: "account_create_with_delegation";
    1: {
        fee: string | Asset;
        delegation: string | Asset;
        creator: string;
        new_account_name: string;
        owner: AuthorityType;
        active: AuthorityType;
        posting: AuthorityType;
        memo_key: string | PublicKey;
        json_metadata: string;
        /**
         * Extensions. Not currently used.
         */
        extensions: any[];
    };
}
export interface AccountUpdateOperation extends Operation {
    0: "account_update";
    1: {
        account: string;
        owner?: AuthorityType;
        active?: AuthorityType;
        posting?: AuthorityType;
        memo_key: string | PublicKey;
        json_metadata: string;
    };
}
export interface AccountWitnessProxyOperation extends Operation {
    0: "account_witness_proxy";
    1: {
        account: string;
        proxy: string;
    };
}
export interface AccountWitnessVoteOperation extends Operation {
    0: "account_witness_vote";
    1: {
        account: string;
        witness: string;
        approve: boolean;
    };
}
export interface CancelTransferFromSavingsOperation extends Operation {
    0: "cancel_transfer_from_savings";
    1: {
        from: string;
        request_id: number;
    };
}
/**
 * Each account lists another account as their recovery account.
 * The recovery account has the ability to create account_recovery_requests
 * for the account to recover. An account can change their recovery account
 * at any time with a 30 day delay. This delay is to prevent
 * an attacker from changing the recovery account to a malicious account
 * during an attack. These 30 days match the 30 days that an
 * owner authority is valid for recovery purposes.
 *
 * On account creation the recovery account is set either to the creator of
 * the account (The account that pays the creation fee and is a signer on the transaction)
 * or to the empty string if the account was mined. An account with no recovery
 * has the top voted witness as a recovery account, at the time the recover
 * request is created. Note: This does mean the effective recovery account
 * of an account with no listed recovery account can change at any time as
 * witness vote weights. The top voted witness is explicitly the most trusted
 * witness according to stake.
 */
export interface ChangeRecoveryAccountOperation extends Operation {
    0: "change_recovery_account";
    1: {
        /**
         * The account that would be recovered in case of compromise.
         */
        account_to_recover: string;
        /**
         * The account that creates the recover request.
         */
        new_recovery_account: string;
        /**
         * Extensions. Not currently used.
         */
        extensions: any[];
    };
}
export interface ClaimRewardBalanceOperation extends Operation {
    0: "claim_reward_balance";
    1: {
        account: string;
        reward_steem: string | Asset;
        reward_sbd: string | Asset;
        reward_vests: string | Asset;
    };
}
export interface ClaimAccountOperation extends Operation {
    0: "claim_account";
    1: {
        creator: string;
        fee: string | Asset;
        /**
         * Extensions. Not currently used.
         */
        extensions: any[];
    };
}
export interface CommentOperation extends Operation {
    0: "comment";
    1: {
        parent_author: string;
        parent_permlink: string;
        author: string;
        permlink: string;
        title: string;
        body: string;
        json_metadata: string;
    };
}
export interface CommentOptionsOperation extends Operation {
    0: "comment_options";
    1: {
        author: string;
        permlink: string;
        /** HBD value of the maximum payout this post will receive. */
        max_accepted_payout: Asset | string;
        /** The percent of STEEM Dollars to key, unkept amounts will be received as Steem Power. */
        percent_steem_dollars: number;
        /** Whether to allow post to receive votes. */
        allow_votes: boolean;
        /** Whether to allow post to recieve curation rewards. */
        allow_curation_rewards: boolean;
        extensions: [0, {
            beneficiaries: BeneficiaryRoute[];
        }][];
    };
}
export interface ConvertOperation extends Operation {
    0: "convert";
    1: {
        owner: string;
        requestid: number;
        amount: Asset | string;
    };
}
export interface CreateClaimedAccountOperation extends Operation {
    0: "create_claimed_account";
    1: {
        creator: string;
        new_account_name: string;
        owner: AuthorityType;
        active: AuthorityType;
        posting: AuthorityType;
        memo_key: string | PublicKey;
        json_metadata: string;
        /**
         * Extensions. Not currently used.
         */
        extensions: any[];
    };
}
export interface CustomOperation extends Operation {
    0: "custom";
    1: {
        required_auths: string[];
        id: number;
        data: Buffer | HexBuffer | number[];
    };
}
export interface CustomBinaryOperation extends Operation {
    0: "custom_binary";
    1: {
        required_owner_auths: string[];
        required_active_auths: string[];
        required_posting_auths: string[];
        required_auths: AuthorityType[];
        /**
         * ID string, must be less than 32 characters long.
         */
        id: string;
        data: Buffer | HexBuffer | number[];
    };
}
export interface CustomJsonOperation extends Operation {
    0: "custom_json";
    1: {
        required_auths: string[];
        required_posting_auths: string[];
        /**
         * ID string, must be less than 32 characters long.
         */
        id: string;
        /**
         * JSON encoded string, must be valid JSON.
         */
        json: string;
    };
}
export interface DeclineVotingRightsOperation extends Operation {
    0: "decline_voting_rights";
    1: {
        account: string;
        decline: boolean;
    };
}
export interface DelegateVestingSharesOperation extends Operation {
    0: "delegate_vesting_shares";
    1: {
        /**
         * The account delegating vesting shares.
         */
        delegator: string;
        /**
         * The account receiving vesting shares.
         */
        delegatee: string;
        /**
         * The amount of vesting shares delegated.
         */
        vesting_shares: string | Asset;
    };
}
export interface DeleteCommentOperation extends Operation {
    0: "delete_comment";
    1: {
        author: string;
        permlink: string;
    };
}
/**
 * The agent and to accounts must approve an escrow transaction for it to be valid on
 * the blockchain. Once a part approves the escrow, the cannot revoke their approval.
 * Subsequent escrow approve operations, regardless of the approval, will be rejected.
 */
export interface EscrowApproveOperation extends Operation {
    0: "escrow_approve";
    1: {
        from: string;
        to: string;
        agent: string;
        /**
         * Either to or agent.
         */
        who: string;
        escrow_id: number;
        approve: boolean;
    };
}
/**
 * If either the sender or receiver of an escrow payment has an issue, they can
 * raise it for dispute. Once a payment is in dispute, the agent has authority over
 * who gets what.
 */
export interface EscrowDisputeOperation extends Operation {
    0: "escrow_dispute";
    1: {
        from: string;
        to: string;
        agent: string;
        who: string;
        escrow_id: number;
    };
}
/**
 * This operation can be used by anyone associated with the escrow transfer to
 * release funds if they have permission.
 *
 * The permission scheme is as follows:
 * If there is no dispute and escrow has not expired, either party can release funds to the other.
 * If escrow expires and there is no dispute, either party can release funds to either party.
 * If there is a dispute regardless of expiration, the agent can release funds to either party
 *    following whichever agreement was in place between the parties.
 */
export interface EscrowReleaseOperation extends Operation {
    0: "escrow_release";
    1: {
        from: string;
        /**
         * The original 'to'.
         */
        to: string;
        agent: string;
        /**
         * The account that is attempting to release the funds, determines valid 'receiver'.
         */
        who: string;
        /**
         * The account that should receive funds (might be from, might be to).
         */
        receiver: string;
        escrow_id: number;
        /**
         * The amount of sbd to release.
         */
        sbd_amount: Asset | string;
        /**
         * The amount of steem to release.
         */
        steem_amount: Asset | string;
    };
}
/**
 * The purpose of this operation is to enable someone to send money contingently to
 * another individual. The funds leave the *from* account and go into a temporary balance
 * where they are held until *from* releases it to *to* or *to* refunds it to *from*.
 *
 * In the event of a dispute the *agent* can divide the funds between the to/from account.
 * Disputes can be raised any time before or on the dispute deadline time, after the escrow
 * has been approved by all parties.
 *
 * This operation only creates a proposed escrow transfer. Both the *agent* and *to* must
 * agree to the terms of the arrangement by approving the escrow.
 *
 * The escrow agent is paid the fee on approval of all parties. It is up to the escrow agent
 * to determine the fee.
 *
 * Escrow transactions are uniquely identified by 'from' and 'escrow_id', the 'escrow_id' is defined
 * by the sender.
 */
export interface EscrowTransferOperation extends Operation {
    0: "escrow_transfer";
    1: {
        from: string;
        to: string;
        agent: string;
        escrow_id: number;
        sbd_amount: Asset | string;
        steem_amount: Asset | string;
        fee: Asset | string;
        ratification_deadline: string;
        escrow_expiration: string;
        json_meta: string;
    };
}
export interface FeedPublishOperation extends Operation {
    0: "feed_publish";
    1: {
        publisher: string;
        exchange_rate: PriceType;
    };
}
/**
 * Cancels an order and returns the balance to owner.
 */
export interface LimitOrderCancelOperation extends Operation {
    0: "limit_order_cancel";
    1: {
        owner: string;
        orderid: number;
    };
}
/**
 * This operation creates a limit order and matches it against existing open orders.
 */
export interface LimitOrderCreateOperation extends Operation {
    0: "limit_order_create";
    1: {
        owner: string;
        orderid: number;
        amount_to_sell: Asset | string;
        min_to_receive: Asset | string;
        fill_or_kill: boolean;
        expiration: string;
    };
}
/**
 * This operation is identical to limit_order_create except it serializes the price rather
 * than calculating it from other fields.
 */
export interface LimitOrderCreate2Operation extends Operation {
    0: "limit_order_create2";
    1: {
        owner: string;
        orderid: number;
        amount_to_sell: Asset | string;
        fill_or_kill: boolean;
        exchange_rate: PriceType;
        expiration: string;
    };
}
/**
 * Legacy proof of work operation.
 */
export interface PowOperation extends Operation {
    0: "pow";
    1: {
        worker_account: string;
        block_id: any;
        nonce: number;
        work: any;
        props: any;
    };
}
/**
 * Legacy equihash proof of work operation.
 */
export interface Pow2Operation extends Operation {
    0: "pow2";
    1: {
        work: any;
        new_owner_key?: string | PublicKey;
        props: any;
    };
}
/**
 * Recover an account to a new authority using a previous authority and verification
 * of the recovery account as proof of identity. This operation can only succeed
 * if there was a recovery request sent by the account's recover account.
 *
 * In order to recover the account, the account holder must provide proof
 * of past ownership and proof of identity to the recovery account. Being able
 * to satisfy an owner authority that was used in the past 30 days is sufficient
 * to prove past ownership. The get_owner_history function in the database API
 * returns past owner authorities that are valid for account recovery.
 *
 * Proving identity is an off chain contract between the account holder and
 * the recovery account. The recovery request contains a new authority which
 * must be satisfied by the account holder to regain control. The actual process
 * of verifying authority may become complicated, but that is an application
 * level concern, not a blockchain concern.
 *
 * This operation requires both the past and future owner authorities in the
 * operation because neither of them can be derived from the current chain state.
 * The operation must be signed by keys that satisfy both the new owner authority
 * and the recent owner authority. Failing either fails the operation entirely.
 *
 * If a recovery request was made inadvertantly, the account holder should
 * contact the recovery account to have the request deleted.
 *
 * The two setp combination of the account recovery request and recover is
 * safe because the recovery account never has access to secrets of the account
 * to recover. They simply act as an on chain endorsement of off chain identity.
 * In other systems, a fork would be required to enforce such off chain state.
 * Additionally, an account cannot be permanently recovered to the wrong account.
 * While any owner authority from the past 30 days can be used, including a compromised
 * authority, the account can be continually recovered until the recovery account
 * is confident a combination of uncompromised authorities were used to
 * recover the account. The actual process of verifying authority may become
 * complicated, but that is an application level concern, not the blockchain's
 * concern.
 */
export interface RecoverAccountOperation extends Operation {
    0: "recover_account";
    1: {
        /**
         * The account to be recovered.
         */
        account_to_recover: string;
        /**
         * The new owner authority as specified in the request account recovery operation.
         */
        new_owner_authority: AuthorityType;
        /**
         * A previous owner authority that the account holder will use to prove
         * past ownership of the account to be recovered.
         */
        recent_owner_authority: AuthorityType;
        /**
         * Extensions. Not currently used.
         */
        extensions: any[];
    };
}
/**
 * This operation is used to report a miner who signs two blocks
 * at the same time. To be valid, the violation must be reported within
 * MAX_WITNESSES blocks of the head block (1 round) and the
 * producer must be in the ACTIVE witness set.
 *
 * Users not in the ACTIVE witness set should not have to worry about their
 * key getting compromised and being used to produced multiple blocks so
 * the attacker can report it and steel their vesting steem.
 *
 * The result of the operation is to transfer the full VESTING STEEM balance
 * of the block producer to the reporter.
 */
export interface ReportOverProductionOperation extends Operation {
    0: "report_over_production";
    1: {
        reporter: string;
        first_block: SignedBlockHeader;
        second_block: SignedBlockHeader;
    };
}
/**
 * All account recovery requests come from a listed recovery account. This
 * is secure based on the assumption that only a trusted account should be
 * a recovery account. It is the responsibility of the recovery account to
 * verify the identity of the account holder of the account to recover by
 * whichever means they have agreed upon. The blockchain assumes identity
 * has been verified when this operation is broadcast.
 *
 * This operation creates an account recovery request which the account to
 * recover has 24 hours to respond to before the request expires and is
 * invalidated.
 *
 * There can only be one active recovery request per account at any one time.
 * Pushing this operation for an account to recover when it already has
 * an active request will either update the request to a new new owner authority
 * and extend the request expiration to 24 hours from the current head block
 * time or it will delete the request. To cancel a request, simply set the
 * weight threshold of the new owner authority to 0, making it an open authority.
 *
 * Additionally, the new owner authority must be satisfiable. In other words,
 * the sum of the key weights must be greater than or equal to the weight
 * threshold.
 *
 * This operation only needs to be signed by the the recovery account.
 * The account to recover confirms its identity to the blockchain in
 * the recover account operation.
 */
export interface RequestAccountRecoveryOperation extends Operation {
    0: "request_account_recovery";
    1: {
        /**
         * The recovery account is listed as the recovery account on the account to recover.
         */
        recovery_account: string;
        /**
         * The account to recover. This is likely due to a compromised owner authority.
         */
        account_to_recover: string;
        /**
         * The new owner authority the account to recover wishes to have. This is secret
         * known by the account to recover and will be confirmed in a recover_account_operation.
         */
        new_owner_authority: AuthorityType;
        /**
         * Extensions. Not currently used.
         */
        extensions: any[];
    };
}
/**
 * This operation allows recovery_account to change account_to_reset's owner authority to
 * new_owner_authority after 60 days of inactivity.
 */
export interface ResetAccountOperation extends Operation {
    0: "reset_account";
    1: {
        reset_account: string;
        account_to_reset: string;
        new_owner_authority: AuthorityType;
    };
}
/**
 * This operation allows 'account' owner to control which account has the power
 * to execute the 'reset_account_operation' after 60 days.
 */
export interface SetResetAccountOperation extends Operation {
    0: "set_reset_account";
    1: {
        account: string;
        current_reset_account: string;
        reset_account: string;
    };
}
/**
 * Allows an account to setup a vesting withdraw but with the additional
 * request for the funds to be transferred directly to another account's
 * balance rather than the withdrawing account. In addition, those funds
 * can be immediately vested again, circumventing the conversion from
 * vests to steem and back, guaranteeing they maintain their value.
 */
export interface SetWithdrawVestingRouteOperation extends Operation {
    0: "set_withdraw_vesting_route";
    1: {
        from_account: string;
        to_account: string;
        percent: number;
        auto_vest: boolean;
    };
}
/**
 * Transfers asset from one account to another.
 */
export interface TransferOperation extends Operation {
    0: "transfer";
    1: {
        /**
         * Sending account name.
         */
        from: string;
        /**
         * Receiving account name.
         */
        to: string;
        /**
         * Amount of STEEM or SBD to send.
         */
        amount: string | Asset;
        /**
         * Plain-text note attached to transaction.
         */
        memo: string;
    };
}
export interface TransferFromSavingsOperation extends Operation {
    0: "transfer_from_savings";
    1: {
        from: string;
        request_id: number;
        to: string;
        amount: string | Asset;
        memo: string;
    };
}
export interface TransferToSavingsOperation extends Operation {
    0: "transfer_to_savings";
    1: {
        amount: string | Asset;
        from: string;
        memo: string;
        request_id: number;
        to: string;
    };
}
/**
 * This operation converts STEEM into VFS (Vesting Fund Shares) at
 * the current exchange rate. With this operation it is possible to
 * give another account vesting shares so that faucets can
 * pre-fund new accounts with vesting shares.
 * (A.k.a. Powering Up)
 */
export interface TransferToVestingOperation extends Operation {
    0: "transfer_to_vesting";
    1: {
        from: string;
        to: string;
        /**
         * Amount to power up, must be STEEM
         */
        amount: string | Asset;
    };
}
export interface VoteOperation extends Operation {
    0: "vote";
    1: {
        voter: string;
        author: string;
        permlink: string;
        /**
         * Voting weight, 100% = 10000 (100_PERCENT).
         */
        weight: number;
    };
}
/**
 * At any given point in time an account can be withdrawing from their
 * vesting shares. A user may change the number of shares they wish to
 * cash out at any time between 0 and their total vesting stake.
 *
 * After applying this operation, vesting_shares will be withdrawn
 * at a rate of vesting_shares/104 per week for two years starting
 * one week after this operation is included in the blockchain.
 *
 * This operation is not valid if the user has no vesting shares.
 * (A.k.a. Powering Down)
 */
export interface WithdrawVestingOperation extends Operation {
    0: "withdraw_vesting";
    1: {
        account: string;
        /**
         * Amount to power down, must be VESTS.
         */
        vesting_shares: string | Asset;
    };
}
/**
 * Users who wish to become a witness must pay a fee acceptable to
 * the current witnesses to apply for the position and allow voting
 * to begin.
 *
 * If the owner isn't a witness they will become a witness.  Witnesses
 * are charged a fee equal to 1 weeks worth of witness pay which in
 * turn is derived from the current share supply.  The fee is
 * only applied if the owner is not already a witness.
 *
 * If the block_signing_key is null then the witness is removed from
 * contention.  The network will pick the top 21 witnesses for
 * producing blocks.
 */
export interface WitnessUpdateOperation extends Operation {
    0: "witness_update";
    1: {
        owner: string;
        /**
         * URL for witness, usually a link to a post in the witness-category tag.
         */
        url: string;
        block_signing_key: string | PublicKey | null;
        props: ChainProperties;
        /**
         * The fee paid to register a new witness, should be 10x current block production pay.
         */
        fee: string | Asset;
    };
}
export interface WitnessSetPropertiesOperation extends Operation {
    0: "witness_set_properties";
    1: {
        owner: string;
        props: [string, string][];
        extensions: any[];
    };
}
export interface AccountUpdate2Operation extends Operation {
    0: "account_update2";
    1: {
        account: string;
        owner?: AuthorityType;
        active?: AuthorityType;
        posting?: AuthorityType;
        memo_key?: string | PublicKey;
        json_metadata: string;
        posting_json_metadata: string;
        extensions: any[];
    };
}
export interface CreateProposalOperation extends Operation {
    0: "create_proposal";
    1: {
        creator: string;
        receiver: string;
        start_date: string;
        end_date: string;
        daily_pay: Asset | string;
        subject: string;
        permlink: string;
        extensions: any[];
    };
}
export interface UpdateProposalVotesOperation extends Operation {
    0: "update_proposal_votes";
    1: {
        voter: string;
        proposal_ids: number[];
        approve: boolean;
        extensions: any[];
    };
}
export interface RemoveProposalOperation extends Operation {
    0: "remove_proposal";
    1: {
        proposal_owner: string;
        proposal_ids: number[];
        extensions: any[];
    };
}
