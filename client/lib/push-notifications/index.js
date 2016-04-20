/**
 * External dependencies
 */
var Emitter = require( 'lib/mixins/emitter' ),
 	debug = require( 'debug' )( 'calypso:push-notifications' );

var initializeState,
	registerServiceWorker;

initializeState = function() {
	// Only continue if the service worker supports notifications
	if ( ! ( ( 'ServiceWorkerRegistration' in window ) && ( 'showNotification' in window.ServiceWorkerRegistration.prototype ) ) ) {
		debug( 'Notifications not supported' );
		return;
	}

	// If the user denied notifications permission, we cannot prompt again; the user must change the permission
	if ( ( ! ( 'Notification' in window ) ) || 'denied' === window.Notification.permission ) {
		debug( 'Permission denied' );
		this.setState( 'denied' );
		return;
	}

	// Only continue if push messaging is supported
	if ( ! ( 'PushManager' in window ) ) {
		debug( 'Push messaging not supported' );
		return;
	}

	window.navigator.serviceWorker.ready.then( registerServiceWorker.bind( this ) );
};

registerServiceWorker = function( serviceWorkerRegistration ) {
	debug( 'Registering service worker' );
	// Grab existing subscription if we have it
	serviceWorkerRegistration.pushManager.getSubscription().then(
		( function( subscription ) {
			if ( ! subscription ) {
				debug( 'Permission not yet granted' );
				this.setState( 'unsubscribed' );
				return;
			}

			this.setState( 'subscribed' );
			this.saveSubscription( subscription );
		} ).bind( this )
	).catch( ( function( err ) {
		debug( 'Error in getSubscription()', err );
	} ).bind( this ) );
};


/**
 * PushNotifications component
 *
 * @api public
 */

function PushNotifications() {
	// state is one of 'unknown', 'subscribed', 'unsubscribed', or 'denied'
	this.state = 'unknown';
	this.initialize();
	return this;
}

PushNotifications.prototype.initialize = function() {
	// Only register the service worker in browsers that support it.
	if ( 'serviceWorker' in window.navigator ) {
		window.navigator.serviceWorker.register( '/service-worker.js' ).then( initializeState.bind( this ) );
	} else {
		debug( 'Service worker not supported' );
	}
};

PushNotifications.prototype.setState = function( state ) {
	debug( 'Switching state to %s', state );
	this.state = state;
	this.emit( 'change' );
};

PushNotifications.prototype.deleteSubscription = function() {
	// @todo: delete the subscription
	debug( 'Delete subscription' );
};

PushNotifications.prototype.saveSubscription = function( subscription ) {
	// @todo: save the subscription
	debug( 'Save subscription', subscription );
};

PushNotifications.prototype.subscribe = function() {
	if ( 'serviceWorker' in window.navigator ) {
		window.navigator.serviceWorker.ready.then( ( function( serviceWorkerRegistration ) {
			serviceWorkerRegistration.pushManager.subscribe( { userVisibleOnly: true } ).then( ( function ( subscription ) {
				this.setState( 'subscribed' );
				this.saveSubscription( subscription );
			} ).bind( this ) ).catch( ( function( err ) {
				if ( 'denied' === window.Notification.permission ) {
					debug( 'Permission denied' );
					this.setState( 'denied' );
				} else {
					debug( 'Couldn\'t subscribe', err );
					this.setState( 'unknown' );
				}
			} ).bind( this ) );
		} ).bind( this ) );
	}
};

PushNotifications.prototype.unsubscribe = function() {
	if ( 'serviceWorker' in window.navigator ) {
		window.navigator.serviceWorker.ready.then( ( function( serviceWorkerRegistration ) {
			serviceWorkerRegistration.pushManager.getSubscription().then( ( function( pushSubscription ) {
				if ( ! pushSubscription ) {
					this.setState( 'unsubscribed' );
					return;
				}

				this.deleteSubscription();

				pushSubscription.unsubscribe().then( ( function(){
					this.setState( 'unsubscribed' );
				} ).bind( this ) ).catch( ( function( err ) {
					debug( 'Error while unsubscribing', err );
					this.setState( 'unknown' );
				} ).bind( this ) );
			} ).bind( this ) ).catch( ( function( err ) {
				debug( 'Error while unsubscribing', err );
				this.setState( 'unknown' );
			} ).bind( this ) );
		} ).bind( this ) );
	}
};

/**
 * Mixins
 */
Emitter( PushNotifications.prototype );

module.exports = PushNotifications;