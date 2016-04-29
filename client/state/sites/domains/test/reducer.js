/**
 * External dependencies
 */
import { expect } from 'chai';
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */
import { domains as domainsReducer} from '../reducer';
import {
	SITE_DOMAINS_FETCH,
	SITE_DOMAINS_FETCH_COMPLETED,
	SITE_DOMAINS_FETCH_FAILED,
	SERIALIZE,
	DESERIALIZE
} from 'state/action-types';

/**
 * Make a generic expect test comparing states before and after
 * to execute the domains reducer function.
 *
 * @param {Object} before - state before instance
 * @param {Object} action - reducer action
 * @param {Object} after - state after instance
 */

const expectBeforeEqualToAfter = ( before, action, after ) => {
	expect( domainsReducer( before, action ) ).to.eql( after );
};

describe( 'reducer', () => {
	describe( '#domainsReducer()', () => {
		it( 'should return an empty state when original state is undefined and action is empty', () => {
			expectBeforeEqualToAfter( undefined, {}, {} );
		} );

		it( 'should return an empty state when original state and action are empty {}', () => {
			const domainsBefore = {};
			deepFreeze( domainsBefore );

			expectBeforeEqualToAfter( domainsBefore, {}, {} );
		} );

		it( 'should return an empty state when original state is undefined and action is unknown', () => {
			const action = {
				type: 'SAY_HELLO',
				siteId: 77203074
			};

			deepFreeze( action );

			expectBeforeEqualToAfter( undefined, action, {} );
		} );

		it( 'should return the original state when action is unknown', () => {
			const domainsBefore = {
				77203074: {
					data: [],
					error: null,
					hasLoadedFromServer: true,
					isRequesting: false
				}
			};
			const action = {
				type: 'UNKNOWN_ACTION_TYPE',
				siteId: 77203074
			};

			const domainsAfter = domainsBefore;

			deepFreeze( domainsBefore );
			deepFreeze( action );

			expectBeforeEqualToAfter( domainsBefore, action, domainsAfter );
		} );

		it( 'should return the initial state with requesting enabled when fetching is triggered', () => {
			const action = {
				type: SITE_DOMAINS_FETCH,
				siteId: 77203074
			};
			const domainsAfter = {
				77203074: {
					data: null,
					error: null,
					hasLoadedFromServer: false,
					isRequesting: true
				}
			};

			deepFreeze( action );

			expectBeforeEqualToAfter( undefined, action, domainsAfter );
		} );

		it( 'should return the original state with an error and requesting disabled when fetching failed', () => {
			const domainsBefore = {
				77203074: {
					data: [],
					error: null,
					hasLoadedFromServer: true,
					isRequesting: true
				}
			};
			const action = {
				type: SITE_DOMAINS_FETCH_FAILED,
				siteId: 77203074,
				error: 'Unable to fetch site domains'
			};

			const domainsAfter = {
				77203074: {
					data: [],
					error: 'Unable to fetch site domains',
					hasLoadedFromServer: true,
					isRequesting: false
				}
			};

			deepFreeze( domainsBefore );
			deepFreeze( action );

			expectBeforeEqualToAfter( domainsBefore, action, domainsAfter );
		} );

		it( 'should return a list of domains with loaded from server enabled and requesting disabled when fetching completed', () => {
			const action = {
				type: SITE_DOMAINS_FETCH_COMPLETED,
				siteId: 77203074,
				domains: []
			};
			const domainsAfter = {
				77203074: {
					data: [],
					error: null,
					hasLoadedFromServer: true,
					isRequesting: false
				}
			};

			deepFreeze( action );

			expectBeforeEqualToAfter( undefined, action, domainsAfter );
		} );

		it( 'should accumulate domains for different sites', () => {
			const domainsBefore = {
				77203074: {
					data: [],
					error: null,
					hasLoadedFromServer: true,
					isRequesting: false
				}
			};
			const action = {
				type: SITE_DOMAINS_FETCH,
				siteId: 2916284
			};
			const domainsAfter = {
				77203074: {
					data: [],
					error: null,
					hasLoadedFromServer: true,
					isRequesting: false
				},
				2916284: {
					data: null,
					error: null,
					hasLoadedFromServer: false,
					isRequesting: true
				}
			};

			deepFreeze( domainsBefore );
			deepFreeze( action );

			expectBeforeEqualToAfter( domainsBefore, action, domainsAfter );
		} );

		it( 'should override previous domains of the same site', () => {
			const domainsBefore = {
				77203074: {
					data: null,
					error: 'Unable to fetch site domains',
					hasLoadedFromServer: false,
					isRequesting: false
				}
			};
			const action = {
				type: SITE_DOMAINS_FETCH,
				siteId: 77203074
			};
			const domainsAfter = {
				77203074: {
					data: null,
					error: null,
					hasLoadedFromServer: false,
					isRequesting: true
				}
			};

			deepFreeze( domainsBefore );
			deepFreeze( action );

			expectBeforeEqualToAfter( domainsBefore, action, domainsAfter );
		} );

		it( 'never persists state because this is not implemented', () => {
			const domainsBefore = {
				77203074: {
					data: null,
					error: 'Unable to fetch site domains',
					hasLoadedFromServer: false,
					isRequesting: false
				}
			};
			const action = { type: SERIALIZE };

			deepFreeze( domainsBefore );
			deepFreeze( action );

			expectBeforeEqualToAfter( domainsBefore, action, {} );
		} );

		it( 'never loads persisted state because this is not implemented', () => {
			const domainsBefore = {
				77203074: {
					data: null,
					error: null,
					hasLoadedFromServer: false,
					isRequesting: false
				},
				2916284: {
					data: [],
					error: null,
					hasLoadedFromServer: true,
					isRequesting: false
				}
			};
			const action = { type: DESERIALIZE };

			deepFreeze( domainsBefore );
			deepFreeze( action );

			expectBeforeEqualToAfter( domainsBefore, action, {} );
		} );
	} );
} );
