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
var EditCanvas = require( './edit-canvas' ),
	EditToolbar = require( './edit-toolbar' );

module.exports = React.createClass( {
	displayName: 'MediaModalDetailEdit',

	propTypes: {
		site: React.PropTypes.object,
		items: React.PropTypes.array,
		selectedIndex: React.PropTypes.number,
		onChangeView: React.PropTypes.func,
		imageState: React.PropTypes.object
	},

	getDefaultProps: function() {
		return {
			selectedIndex: 0,
			onChangeView: noop,
			imageState: {}
		}
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

	imageStateChanged: function( state ) {
		this.setState( { imageState: merge( {}, this.state.imageState, state ) } );
	},

	render: function() {
		return (
			<div className="editor-media-modal-edit">
				<figure>
					<div className="editor-media-modal-edit__content editor-media-modal__content">
						<EditCanvas
							site={ this.props.site }
							item={ this.props.items[ this.props.selectedIndex  ] }
							rotate={ this.state.imageState.rotate }
							scaleX={ this.state.imageState.scaleX }
							scaleY={ this.state.imageState.scaleY } />
						<EditToolbar
							imageState={ this.state.imageState }
							imageStateChanged={ this.imageStateChanged } />
					</div>
				</figure>
			</div>
		);
	}
} );
