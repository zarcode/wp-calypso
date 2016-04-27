/**
 * External dependencies
 */
import { expect } from 'chai';
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */
import domainsReducer, {
	items as itemsReducer,
	requesting as requestReducer,
	errors as errorsReducer
} from '../reducer';

/**
 * Action types constantes
 */
import {
	SITE_DOMAINS_RECEIVE,
	SITE_DOMAINS_REQUEST,
	SITE_DOMAINS_REQUEST_SUCCESS,
	SITE_DOMAINS_REQUEST_FAILURE,
} from 'state/action-types';

/**
 * Actions creators functions
 */
import {
	createDomainsRequestAction,
	createDomainsRequestSuccessAction,
	createDomainsRequestFailureAction
} from '../actions';

/**
 * Fixture data
 */
import {
	SITE_ID_FIRST as siteId,
	SITE_ID_FIRST as firstSiteId,
	SITE_ID_SECOND as secondSiteId,
	SITE_FIRST_DOMAINS as siteDomains,
	DOMAIN_PRIMARY as firstDomain,
	DOMAIN_NOT_PRIMARY as secondDomain,
	ERROR_MESSAGE_RESPONSE as errorMessageResponse
} from './fixture';

/**
 * Make a generic expect test comparing states before and after
 * to execute the domains reducer function.
 *
 * @param {Object} before - state before instance
 * @param {Object} action - reducer action
 * @param {Object} after - state after instance
 * @param {Function} [reducer] - reducer to test. domainsReducer as default
 */
const expectBeforeEqualToAfter = ( before, action, after, reducer = domainsReducer ) => {
	expect( reducer( before, action ) ).to.eql( after );
};

describe( 'reducer', () => {
	it( 'should export expected reducer keys', () => {
		expect( domainsReducer( undefined, {} ) ).to.have.keys( [
			'items',
			'requesting',
			'errors'
		] );
	} );

	describe( '#items()', () => {
		it( 'should default to an empty object', () => {
			expectBeforeEqualToAfter( undefined, {}, {}, itemsReducer );
		} );

		it( 'should index items state by site ID', () => {
			const stateBefore = undefined;
			const action = {
				type: SITE_DOMAINS_RECEIVE,
				siteId,
				domains: siteDomains
			};
			const stateAfter = {
				[ siteId ]: siteDomains
			};

			deepFreeze( action );
			expectBeforeEqualToAfter( stateBefore, action, stateAfter, itemsReducer );
		} );

		it( 'should override domains for same site', () => {
			const stateBefore = {
				[ siteId ]: [
					firstDomain,
					secondDomain
				]
			};
			const action = {
				type: SITE_DOMAINS_RECEIVE,
				siteId,
				domains: [ secondDomain ]
			};
			const stateAfter = {
				[ siteId ]: [ secondDomain ]
			};

			deepFreeze( stateBefore );
			deepFreeze( action );

			expectBeforeEqualToAfter( stateBefore, action, stateAfter, itemsReducer );
		} );

		it( 'should accumulate domains for different sites', () => {
			const stateBefore = {
				[ firstSiteId ]: [ firstDomain ]
			};
			const action = {
				type: SITE_DOMAINS_RECEIVE,
				siteId: secondSiteId,
				domains: [ secondDomain ]
			};
			const stateAfter = {
				[ firstSiteId ]: [ firstDomain ],
				[ secondSiteId ]: [ secondDomain ]
			};

			deepFreeze( stateBefore );
			deepFreeze( action );

			expectBeforeEqualToAfter( stateBefore, action, stateAfter, itemsReducer );
		} );
	} );

	describe( '#requesting()', () => {
		it( 'should default to an empty object', () => {
			expectBeforeEqualToAfter( undefined, {}, {}, requestReducer );
		} );

		it( 'should index `requesting` state by site ID', () => {
			const stateBefore = undefined;
			const action = {
				type: SITE_DOMAINS_REQUEST,
				siteId
			};
			const stateAfter = {
				[ siteId ]: true
			};

			deepFreeze( action );

			expectBeforeEqualToAfter( stateBefore, action, stateAfter, requestReducer );
		} );

		it( 'should update `requesting` state by site ID on SUCCESS', () => {
			const stateBefore = {
				2916284: true
			};
			const action = {
				type: SITE_DOMAINS_REQUEST_SUCCESS,
				siteId
			};

			const stateAfter = {
				[ siteId ]: false
			};

			deepFreeze( stateBefore );
			deepFreeze( action );

			expectBeforeEqualToAfter( stateBefore, action, stateAfter, requestReducer );
		} );

		it( 'should update `requesting` state by site ID on FAILURE', () => {
			const stateBefore = {
				2916284: true
			};
			const action = {
				type: SITE_DOMAINS_REQUEST_FAILURE,
				siteId
			};

			const stateAfter = {
				[ siteId ]: false
			};

			deepFreeze( stateBefore );
			deepFreeze( action );

			expectBeforeEqualToAfter( stateBefore, action, stateAfter, requestReducer );
		} );
	} );

	describe( '#errors()', () => {
		it( 'should default to an empty object', () => {
			expectBeforeEqualToAfter( undefined, {}, {}, errorsReducer );
		} );

		it( 'should clean `errors` state by site ID on REQUEST', () => {
			const stateBefore = {
				[ siteId ]: errorMessageResponse
			};
			const action = createDomainsRequestAction( siteId );
			const stateAfter = {
				[ siteId ]: null
			};

			deepFreeze( stateBefore );
			deepFreeze( action );

			expectBeforeEqualToAfter( stateBefore, action, stateAfter, errorsReducer );
		} );

		it( 'should clean `errors` state by site ID on SUCCESS', () => {
			const stateBefore = {
				[ siteId ]: errorMessageResponse
			};
			const action = createDomainsRequestSuccessAction( siteId, errorMessageResponse );
			const stateAfter = {
				[ siteId ]: null
			};

			deepFreeze( stateBefore );
			deepFreeze( action );

			expectBeforeEqualToAfter( stateBefore, action, stateAfter, errorsReducer );
		} );

		it( 'should index `errors` state by site ID on FAILURE', () => {
			const stateBefore = undefined;
			const action = createDomainsRequestFailureAction( siteId, errorMessageResponse );
			const stateAfter = {
				[ siteId ]: errorMessageResponse
			};

			deepFreeze( action );

			expectBeforeEqualToAfter( stateBefore, action, stateAfter, errorsReducer );
		} );
	} );
} );
