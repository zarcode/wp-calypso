/** @ssr-ready **/

/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import Card from 'components/card';
import Gridicon from 'components/gridicon';
import i18n from 'lib/mixins/i18n';

var ThemeDownloadCard = React.createClass( {

	propTypes: {
		theme: React.PropTypes.string.isRequired,
		href: React.PropTypes.string
	},

	render() {
		var downloadURI = this.props.href || ( 'http://wordpress.org/themes/' + this.props.theme );
		var downloadText = i18n.translate( 'This theme is available for download to be used on your {{a}}WordPress self-hosted{{/a}} installation.', {
			components: {
				a: <a href={ downloadURI } />
			}
		} );
		return (
			<Card className="themes__sheet-download">
				<Gridicon icon="cloud-download" size={ 48 } />
				<p>{ downloadText }</p>
				<Button href={ downloadURI }>{ i18n.translate( 'Download' ) }</Button>
			</Card>
		);
	}
} );

module.exports = ThemeDownloadCard;
