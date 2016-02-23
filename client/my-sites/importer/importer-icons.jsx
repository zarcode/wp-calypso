/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-pure-render/mixin';
import classNames from 'classnames';
let SocialLogo = require( 'components/social-logo' );

export default React.createClass( {
	displayName: 'ImporterIcon',

	mixins: [ PureRenderMixin ],

	propTypes: { icon: PropTypes.oneOf( [ 'ghost', 'medium', 'squarespace', 'wordpress' ] ) },

	getSVG: function( icon ) {
		switch ( icon ) {
			case 'wordpress':
				return <SocialLogo icon="wordpress" size={ 48 } />;

			default:
				return <SocialLogo icon="wordpress" size={ 48 } />;
		}
	},

	render: function() {
		const { icon } = this.props,
			iconClasses = classNames( 'importer__service-icon', `is-${ icon }` );

		return <div className={ iconClasses }>{ this.getSVG( icon ) }</div>;
	}
} );
