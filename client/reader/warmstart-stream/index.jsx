var React = require( 'react' );

var WarmStartStream = React.createClass( {

	render: function() {
		return (
			React.createElement( 'div', { className: 'WarmStartStream' },
				"Hello, world! I am the WarmStartStream."
			)
		);
	}

} );

module.exports = WarmStartStream;
