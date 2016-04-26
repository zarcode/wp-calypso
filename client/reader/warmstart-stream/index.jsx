var React = require( 'react' );

var FollowingStream = require( 'reader/following-stream' ),
	EmptyContent = require( './empty' );

var WarmstartStream = React.createClass( {

	render: function() {
		var title = this.translate( 'My Warmstart Recs' ),
			emptyContent = ( <EmptyContent /> );

		if ( this.props.setPageTitle ) {
			this.props.setPageTitle( title );
		}
		return (
			<FollowingStream { ...this.props }
				listName = { title }
				emptyContent = { emptyContent }
				showFollowInHeader = { true }
			/>
		);
	}

} );

module.exports = WarmstartStream;
