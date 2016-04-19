/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import Gridicon from 'components/gridicon';

const ControlButton = props => (
	<div onClick={ props.onClick } className="design-tool-list__button">
		<span className="design-tool-list__button__title">{ props.title }</span>
		<Gridicon icon="chevron-right" size={ 24 } className="design-tool-list__button__arrow" />
	</div>
);

const DesignToolList = React.createClass( {
	propTypes: {
		onChange: React.PropTypes.func.isRequired,
	},

	renderControl( tool ) {
		const onChange = () => this.props.onChange( tool.value )
		return <ControlButton key={ tool.value } title={ tool.label } onClick={ onChange } />;
	},

	render() {
		return (
			<div className="design-tool-list">
				<div className="design-tool-list__header">{ this.translate( 'Site Identity' ) }</div>
				<div className="design-tool-list__section">
					{ this.renderControl( { label: this.translate( 'Logo' ), value: 'siteLogo' } ) }
					{ this.renderControl( { label: this.translate( 'Title and Tagline' ), value: 'siteTitle' } ) }
				</div>
				<div className="design-tool-list__header">{ this.translate( 'Site Layout' ) }</div>
				<div className="design-tool-list__section">
					{ this.renderControl( { label: this.translate( 'Homepage Settings' ), value: 'homePage' } ) }
					{ this.renderControl( { label: this.translate( 'Header Image' ), value: 'headerImage' } ) }
				</div>
			</div>
		);
	}
} );

export default DesignToolList;
