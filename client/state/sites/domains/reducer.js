/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import {
	SITE_DOMAINS_RECEIVE,
	SITE_DOMAINS_REQUEST,
	SITE_DOMAINS_REQUEST_SUCCESS,
	SITE_DOMAINS_REQUEST_FAILURE,
	SERIALIZE,
	DESERIALIZE
} from 'state/action-types';

/**
 * Domains `Reducer` function
 *
 * @param {Object} state - current state
 * @param {Object} action - domains action
 * @return {Object} updated state
 */
export const items = ( state = {}, action ) => {
	const { siteId } = action;
	switch ( action.type ) {
		case SITE_DOMAINS_RECEIVE:
			return Object.assign(
				{},
				state,
				{
					[ siteId ]: action.domains
				}
			);
	}

	return state;
};

/**
 * `Reducer` function which handles request/response actions
 * to/from WP REST-API
 *
 * @param {Object} state - current state
 * @param {Object} action - domains action
 * @return {Object} updated state
 */
export const requesting = ( state = {}, action ) => {
	switch ( action.type ) {
		case SITE_DOMAINS_REQUEST:
		case SITE_DOMAINS_REQUEST_SUCCESS:
		case SITE_DOMAINS_REQUEST_FAILURE:
			return Object.assign( {}, state, {
				[ action.siteId ]: action.type === SITE_DOMAINS_REQUEST
			} );

		case SERIALIZE:
			return {};

		case DESERIALIZE:
			return {};
	}

	return state;
};

/**
 * `Reducer` function which handles ERRORs REST-API response actions
 *
 * @param {Object} state - current state
 * @param {Object} action - domains action
 * @return {Object} updated state
 */
export const errors = ( state = {}, action ) => {
	switch ( action.type ) {
		case SITE_DOMAINS_REQUEST:
		case SITE_DOMAINS_REQUEST_SUCCESS:
			return Object.assign( {}, state, {
				[ action.siteId ]: null
			} );

		case SITE_DOMAINS_REQUEST_FAILURE:
			return Object.assign( {}, state, {
				[ action.siteId ]: action.error
			} );

		case SERIALIZE:
			return {};

		case DESERIALIZE:
			return {};
	}

	return state;
};

export default combineReducers( {
	items,
	requesting,
	errors
} );
