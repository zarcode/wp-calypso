/**
 * External dependencies
 */
var React = require( 'react' ),
	noop = require( 'lodash/noop' );

/**
 * Internal dependencies
 */
var EditCanvas = require( './edit-canvas' ),
	EditToolbar = require( './edit-toolbar' );

module.exports = React.createClass( {
	displayName: 'MediaModalDetailEdit',

	propTypes: {
		site: React.PropTypes.object,
		items: React.PropTypes.array,
		selectedIndex: React.PropTypes.number,
		onChangeView: React.PropTypes.func
	},

	getDefaultProps: function() {
		return {
			selectedIndex: 0,
			onChangeView: noop
		}
	},

	getInitialState: function() {
		return {
			rotate: 0,
			scaleX: 1,
			scaleY: 1
		};
	},

	stateChanged: function( state ) {
		this.setState( state );
	},

	render: function() {
		return (
			<div className="editor-media-modal-edit">
				<figure>
					<div className="editor-media-modal-edit__content editor-media-modal__content">
						<EditCanvas
							item={ this.props.items[ this.props.selectedIndex  ] }
							rotate={ this.state.rotate }
							scaleX={ this.state.scaleX }
							scaleY={ this.state.scaleY } />
						<EditToolbar
							rotate={ this.state.rotate }
							scaleX={ this.state.scaleX }
							scaleY={ this.state.scaleY }
							stateChanged={ this.stateChanged } />
					</div>
				</figure>
			</div>
		);
	}
} );
