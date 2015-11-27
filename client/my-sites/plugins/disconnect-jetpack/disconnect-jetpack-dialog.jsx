/**
 * External dependencies
 */
import page from 'page';
import React from 'react';

/**
 * Internal dependencies
 */
import sitesListFactory from 'lib/sites-list';
import Dialog from 'components/dialog';
import analytics from 'analytics';
import SitesListActions from 'lib/sites-list/actions';

const sites = sitesListFactory();

module.exports = React.createClass( {

	displayName: 'DisconnectJetpackDialog',

	getInitialState() {
		return { showJetpackDisconnectDialog: false };
	},

	open() {
		this.setState( { showJetpackDisconnectDialog: true } );
	},

	close( action ) {
		this.setState( { showJetpackDisconnectDialog: false } );
		if ( action === 'continue' ) {
			this.disconnectJetpack();
			analytics.ga.recordEvent( 'Jetpack', 'Clicked To Confirm Disconnect Jetpack Dialog' );
		} else {
			analytics.ga.recordEvent( 'Jetpack', 'Clicked To Cancel Disconnect Jetpack Dialog' );
		}
	},

	jetpackSiteRemain( site ) {
		return site.capabilities && site.capabilities.manage_options && site.ID !== this.props.site.ID;
	},

	disconnectJetpack() {
		const jetpackSites = sites.getJetpack();

		// remove any error and completed notices
		SitesListActions.removeSitesNotices( [ { status: 'error' }, { status: 'completed' } ] );

		if ( this.props.site ) {
			SitesListActions.disconnect( this.props.site );
			if ( this.props.redirect && jetpackSites.some( this.jetpackSiteRemain ) ) {
				page.redirect( this.props.redirect );
				return;
			}
		} else if ( this.props.sites ) {
			this.props.sites.getSelectedOrAllWithPlugins().forEach( function( site ) {
				SitesListActions.disconnect( site );
			} );
		}
		page.redirect( '/sites' );
	},

	render() {
		let moreInfo;
		const deactivationButtons = [
			{
				action: 'cancel',
				label: this.translate( 'Cancel' )
			},
			{
				action: 'continue',
				label: this.translate( 'Disconnect' ),
				isPrimary: true
			}
		];

		if ( this.props.site && this.props.site.name || this.props.site && this.props.site.title ) {
			moreInfo = this.translate(
				'Disconnecting Jetpack will remove access to WordPress.com features for %(siteName)s.', {
					args: { siteName: this.props.site.name || this.props.site.title },
					context: 'Jetpack: Warning message displayed prior to disconnecting a Jetpack Site.'
				} );
		} else {
			moreInfo = this.translate(
				'Disconnecting Jetpack will remove access to WordPress.com features.', {
					context: 'Jetpack: Warning message displayed prior to disconnecting multiple Jetpack Sites.'
				} );
		}

		return (
			<Dialog
				isVisible={ this.state.showJetpackDisconnectDialog }
				buttons={ deactivationButtons }
				onClose={ this.close }
				transitionLeave={ false }
			>
				<h1>{ this.translate( 'Disconnect Jetpack' ) }</h1>
				<p>{ moreInfo }</p>
			</Dialog>
		);
	}
} );
