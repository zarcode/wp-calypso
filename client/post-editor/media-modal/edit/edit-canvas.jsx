/**
 * External dependencies
 */
var React = require( 'react' ),
	ReactDOM = require( 'react-dom' );

/**
 * Internal dependencies
 */
var MediaUtils = require( 'lib/media/utils' );

module.exports = React.createClass( {
	displayName: 'MediaModalDetailEditCanvas',

	propTypes: {
		item: React.PropTypes.object,
		rotate: React.PropTypes.number,
		scaleX: React.PropTypes.number,
		scaleY: React.PropTypes.number
	},

	getDefaultProps() {
		return {
			rotate: 0,
			scaleX: 1,
			scaleY: 1
		}
	},

	componentDidMount: function () {
		const src = MediaUtils.url( this.props.item, {
			photon: this.props.site && ! this.props.site.is_private
		} );

		this.image = new Image();
		this.image.src = src;
		this.image.onload = this.onLoadComplete;
		this.image.onerror = this.onLoadComplete;
	},

	onLoadComplete: function () {
		this.drawImage();
	},

	componentDidUpdate: function () {
		this.drawImage();
	},

	drawImage: function () {
		var canvas = ReactDOM.findDOMNode( this.refs.canvas ),
			context = canvas.getContext( '2d' );

		context.clearRect(0,0,canvas.width,canvas.height);
		context.save();
		context.translate( canvas.width/2, canvas.height/2 );
		context.scale( this.props.scaleX, this.props.scaleY );
		context.rotate( this.props.rotate * Math.PI/180 );
		context.drawImage( this.image, -this.image.width/2, -this.image.height/2 );
		context.restore();
	},

	render: function () {
		var rotatedMod = this.props.rotate % 180,
			item = this.props.item,
			width = rotatedMod === 0 ? item.width : item.height,
			height = rotatedMod === 0 ? item.height : item.width;

		return (
			<div className="editor-media-modal-edit__canvas-container">
				<canvas
					ref="canvas"
					className="editor-media-modal-edit__canvas"
					width={ width }
					height={ height }></canvas>
			</div>
		);
	}
} );
