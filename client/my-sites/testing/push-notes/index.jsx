/**
 * External dependencies
 */
var React = require( 'react' );

/**
 * Internal dependencies
 */
var observe = require( 'lib/mixins/data-observe' );

module.exports = React.createClass( {
	displayName: 'TestPushNotes',

	mixins: [ observe( 'pushNotifications' ) ],

	unsubscribe: function() {
		var pushNotifications = this.props.pushNotifications;
		pushNotifications.unsubscribe();
	},

	subscribe: function() {
		var pushNotifications = this.props.pushNotifications;
		pushNotifications.subscribe();
	},

	render: function() {
		var pushNotifications = this.props.pushNotifications,
			prompt;

		switch( pushNotifications.state ) {
			case 'subscribed':
				prompt = <a onClick={this.unsubscribe}>Unsubscribe</a>;
				break;
			case 'unsubscribed':
				prompt = <a onClick={this.subscribe}>Subscribe</a>;
				break;
			case 'denied':
				prompt = <span>Permission denied... Instructions on how to enable?</span>;
				break;
			default:
				prompt = <span>Push notifications not supported. Generally we'd show nothing in this case.</span>;
				break
		}

		return prompt;
	}
} );
