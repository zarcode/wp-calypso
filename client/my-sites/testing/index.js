/**
 * External dependencies
 */
import page from 'page';

/**
 * Internal dependencies
 */
import controller from 'my-sites/controller';
import testingController from './controller';

export default () => {
    page( '/testing/:domain?', controller.siteSelection, controller.navigation, testingController.testing );
};
