/**
 * Returns true if currently requesting recommendations.
 *
 * @param  {Object}  state  Global state tree
 * @return {Boolean}        Whether recommendations are being requested
 */
export function isRequestingRecommendations( state ) {
	return !! state.reader.start.isRequestingRecommendations;
}

/**
 * Returns recommendations.
 *
 * @param  {Object}  state  Global state tree
 * @return {Object} Recommendations
 */
export function getRecommendations( state ) {
	return state.reader.start.items;
}
