/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import get from 'lodash/get';

/**
 * Internal dependencies
 */
import MediaUtils from 'lib/media/utils';
import Spinner from 'components/spinner';
import ImagePreloader from 'components/image-preloader';

export default React.createClass( {
	displayName: 'EditorFeaturedImagePreview',

	propTypes: {
		image: PropTypes.object,
		maxWidth: PropTypes.number
	},

	src() {
		if ( ! this.props.image ) {
			return;
		}

		return MediaUtils.url( this.props.image, {
			maxWidth: this.props.maxWidth,
			size: 'post-thumbnail'
		} );
	},

	render() {
		const style = { maxHeight: get( this.props.image, 'height' ) };
		const classes = classNames( 'editor-featured-image__preview', {
			'is-transient': get( this.props.image, 'transient' )
		} );

		return (
			<div className={ classes } style={ style }>
				<Spinner className="editor-featured-image__preview-spinner" />
				<ImagePreloader
					placeholder={ <Spinner /> }
					src={ this.src() } />
			</div>
		);
	}
} );
