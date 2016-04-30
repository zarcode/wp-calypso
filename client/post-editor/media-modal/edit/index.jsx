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
	EditToolbar = require( './edit-toolbar' ),
	DropZone = require( 'components/drop-zone' ),
	MediaUtils = require( 'lib/media/utils' );

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
		var src;

		if ( this.props.items && this.props.items[ this.props.selectedIndex ] ) {
			src = MediaUtils.url( this.props.items[ this.props.selectedIndex ], {
				photon: this.props.site && ! this.props.site.is_private
			} );
		}

		return  {
			src: src,
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

	onFilesDrop: function ( files ) {
		this.setState({
			src: URL.createObjectURL( files[0] )
		});
	},

	isValidTransfer: function( transfer ) {
		if ( ! transfer ) {
			return false;
		}

		// Firefox will claim that images dragged from within the same page are
		// files, but will also identify them with a `mozSourceNode` attribute.
		// This value will be `null` for files dragged from outside the page.
		//
		// See: https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/mozSourceNode
		if ( transfer.mozSourceNode ) {
			return false;
		}

		// `types` is a DOMStringList, which is treated as an array in Chrome,
		// but as an array-like object in Firefox. Therefore, we call `indexOf`
		// using the Array prototype. Safari may pass types as `null` which
		// makes detection impossible, so we err on allowing the transfer.
		//
		// See: http://www.w3.org/html/wg/drafts/html/master/editing.html#the-datatransfer-interface
		return ! transfer.types || -1 !== Array.prototype.indexOf.call( transfer.types, 'Files' );
	},

	render: function() {
		return (
			<div className="editor-media-modal-edit">
				<figure>
					<div className="editor-media-modal-edit__content editor-media-modal__content">
						<DropZone
							fullScreen={ true }
							onVerifyValidTransfer={ this.isValidTransfer }
							onFilesDrop={ this.onFilesDrop } />
						<EditCanvas
							src={ this.state.src }
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
