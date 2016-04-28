/**
 * External dependencies
 */
var page = require( 'page' );

/**
 * Internal dependencies
 */
var controller = require( './controller' ),
	config = require( 'config' );

function forceTeamA8C( context, next ) {
	context.params.team = 'a8c';
	next();
}

module.exports = function() {
	if ( config.isEnabled( 'reader' ) ) {
		page( '/', controller.loadSubscriptions, controller.initAbTests, controller.updateLastRoute, controller.removePost, controller.sidebar, controller.following );

		// Old and incomplete paths that should be redirected to /
		page( '/read/following', '/' );
		page( '/read', '/' );
		page( '/read/blogs', '/' );
		page( '/read/feeds', '/' );
		page( '/read/blog', '/' );
		page( '/read/post', '/' );
		page( '/read/feed', '/' );

		// Feed stream
		page( '/read/*', controller.loadSubscriptions, controller.initAbTests );
		page( '/read/blog/feed/:feed_id', controller.legacyRedirects );
		page( '/read/feeds/:feed_id/posts', controller.incompleteUrlRedirects );
		page( '/read/feeds/:feed_id', controller.updateLastRoute, controller.prettyRedirects, controller.removePost, controller.sidebar, controller.feedDiscovery, controller.feedListing );
		page.exit( '/read/feeds/:feed_id', controller.resetTitle );

		// Feed full post
		page( '/read/post/feed/:feed_id/:post_id', controller.legacyRedirects );
		page( '/read/feeds/:feed/posts/:post', controller.updateLastRoute, controller.feedPost );
		page.exit( '/read/feeds/:feed/posts/:post', controller.resetTitle );

		// Blog stream
		page( '/read/blog/id/:blog_id', controller.legacyRedirects );
		page( '/read/blogs/:blog_id/posts', controller.incompleteUrlRedirects );
		page( '/read/blogs/:blog_id', controller.updateLastRoute, controller.prettyRedirects, controller.removePost, controller.sidebar, controller.blogListing );

		// Blog full post
		page( '/read/post/id/:blog_id/:post_id', controller.legacyRedirects );
		page( '/read/blogs/:blog/posts/:post', controller.updateLastRoute, controller.blogPost );
		page.exit( '/read/blogs/:blog/posts/:post', controller.resetTitle );

		page( '/tag/*', controller.loadSubscriptions, controller.initAbTests );
		page( '/tag/:tag', controller.updateLastRoute, controller.removePost, controller.sidebar, controller.tagListing );
	}

	page( '/read/a8c', controller.updateLastRoute, controller.removePost, controller.sidebar, forceTeamA8C, controller.readA8C );
	if ( config.isEnabled( 'reader/search' ) ) {
		page( '/read/search', controller.updateLastRoute, controller.removePost, controller.sidebar, controller.search );
	}

	page( '/read/list/:user/:list', controller.updateLastRoute, controller.removePost, controller.sidebar, controller.listListing );

	if ( config.isEnabled( 'reader/list-management' ) ) {
		page( '/read/list/:user/:list/sites', controller.updateLastRoute, controller.removePost, controller.sidebar, controller.listManagementSites );
		page( '/read/list/:user/:list/tags', controller.updateLastRoute, controller.removePost, controller.sidebar, controller.listManagementTags );
		page( '/read/list/:user/:list/edit', controller.updateLastRoute, controller.removePost, controller.sidebar, controller.listManagementDescriptionEdit );
		page( '/read/list/:user/:list/followers', controller.updateLastRoute, controller.removePost, controller.sidebar, controller.listManagementFollowers );
	}

	page( '/activities/likes', controller.loadSubscriptions, controller.initAbTests, controller.updateLastRoute, controller.removePost, controller.sidebar, controller.likes );

	page( '/following/*', controller.loadSubscriptions, controller.initAbTests );
	page( '/following/edit', controller.updateLastRoute, controller.removePost, controller.sidebar, controller.followingEdit );

	page( '/tags', controller.loadSubscriptions, controller.initAbTests, controller.updateLastRoute, controller.removePost, controller.sidebar, controller.recommendedTags );
};
