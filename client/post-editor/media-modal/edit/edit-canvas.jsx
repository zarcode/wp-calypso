/**
 * External dependencies
 */
var React = require( 'react' ),
	ReactDOM = require( 'react-dom' );

/**
 * Internal dependencies
 */


module.exports = React.createClass( {
	displayName: 'MediaModalDetailEditCanvas',

	propTypes: {
		site: React.PropTypes.object,
		item: React.PropTypes.object,
		rotate: React.PropTypes.number,
		scaleX: React.PropTypes.number,
		scaleY: React.PropTypes.number
	},

	getDefaultProps: function () {
		return {
			rotate: 0,
			scaleX: 1,
			scaleY: 1
		}
	},

	getInitialState: function () {
		return {
			canvasWidth: this.props.item ? this.props.item.width : 0,
			canvasHeight: this.props.item ? this.props.item.height : 0
		};
	},

	componentWillReceiveProps: function ( newProps ) {
		if ( this.props.src !== newProps.src ) {
			this.initImage( newProps.src );
		}
	},

	componentDidMount: function () {
		if ( ! this.props.src ) {
			return;
		}

		this.initImage( this.props.src );
	},

	initImage: function ( src ) {
		this.image = new Image();
		this.image.src = src;
		this.image.onload = this.onLoadComplete;
		this.image.onerror = this.onLoadComplete;
	},

	onLoadComplete: function ( event ) {
		if ( event.type !== 'load' ) {
			return;
		}

		this.drawImage();
	},

	componentDidUpdate: function () {
		this.drawImage();
	},

	drawImage: function () {
		var canvas, context;

		if ( ! this.image ) {
			return;
		}

		if ( this.state.canvasWidth !== this.image.width ||
			 this.state.canvasHeight !== this.image.height) {
			this.setState({
				canvasWidth: this.image.width,
				canvasHeight: this.image.height
			});
		}

		canvas = ReactDOM.findDOMNode( this.refs.canvas );
		context = canvas.getContext( '2d' );

		context.clearRect(0,0,canvas.width,canvas.height);
		context.save();
		context.translate( canvas.width/2, canvas.height/2 );
		context.scale( this.props.scaleX, this.props.scaleY );
		context.rotate( this.props.rotate * Math.PI/180 );
		context.drawImage( this.image, -this.image.width/2, -this.image.height/2 );
		context.restore();

		//canvas.toBlob(function(blob){ x = blob; }, "image/jpeg", 0.95); // JPEG at 95% quality
	},

	render: function () {
		var rotatedMod = this.props.rotate % 180,
			width = rotatedMod === 0 ? this.state.canvasWidth : this.state.canvasHeight,
			height = rotatedMod === 0 ? this.state.canvasHeight : this.state.canvasWidth;

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
