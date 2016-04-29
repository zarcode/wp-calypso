/**
 * External dependencies
 */
var React = require( 'react' ),
	noop = require( 'lodash/noop' ),
	merge = require( 'lodash/merge' ),
	isEqual = require( 'lodash/isEqual' );

/**
 * Internal dependencies
 */
var Gridicon = require( 'components/gridicon' );

module.exports = React.createClass( {
	displayName: 'MediaModalDetailEditToolbar',

	propTypes: {
		imageState: React.PropTypes.object,
		imageStateChanged: React.PropTypes.func
	},

	getInitialState: function() {
		return this.getDefaultState( this.props );
	},

	getDefaultState: function ( props ) {
		return  {
			imageState: merge(
				{
					rotate: 0,
					scaleX: 1,
					scaleY: 1
				},
				props.imageState
			)
		};
	},

	componentWillReceiveProps: function ( newProps ) {
		if ( newProps.imageState &&
			! isEqual( newProps.imageState, this.state.imageState ) ) {
			this.setState( { imageState: newProps.imageState } );
		}
	},

	rotate: function () {
		this.state.imageState.rotate = ( this.state.imageState.rotate - 90 ) % 360;
		this.props.imageStateChanged( { rotate: this.state.imageState.rotate} );
	},

	flip: function () {
		this.state.imageState.scaleX = -this.state.imageState.scaleX;
		this.props.imageStateChanged( { scaleX: this.state.imageState.scaleX } );
	},

	renderButtons: function () {
		const buttons = [ {
			tool: 'rotate',
			icon: 'rotate',
			text: this.translate( 'Rotate' ),
			onClick: this.rotate
		},/* {
			tool: 'layout',
			icon: 'layout',
			text: this.translate( 'Aspect' ),
			onClick: noop
		}, */{
			tool: 'flip-vertical',
			icon: 'flip-vertical',
			text: this.translate( 'Flip' ),
			onClick: this.flip
		} ];

		return buttons.map( function ( button ) {
			return (
				<button
					key={ 'edit-toolbar-' + button.tool }
					className={ 'editor-media-modal-edit__toolbar-button' }
					onClick={ button.onClick } >
					<Gridicon icon={ button.icon } size={ 36 } />
					<br />
					<span>{ button.text }</span>
				</button>
			);
		}, this )
	},

	render: function() {
		return (
			<div className="editor-media-modal-edit__toolbar">
				{ this.renderButtons() }
			</div>
		);
	}
} );
