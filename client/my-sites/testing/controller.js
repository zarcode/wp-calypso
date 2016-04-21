/**
 * External Dependencies
 */
var React = require( 'react' ),
	ReactDom = require( 'react-dom' );

const Controller = {
	testing( context, next ) {
		var PushNotesComponent = require( 'my-sites/testing/push-notes' ),
			PushNotifications = require( 'lib/push-notifications' ),
			pushNotifications;

		pushNotifications = new PushNotifications();

		ReactDom.render(
			React.createElement( PushNotesComponent, {
				pushNotifications: pushNotifications
			} ),
			document.getElementById( 'primary' )
		);
	}
};

export default Controller;