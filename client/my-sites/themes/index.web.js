/**
 * Internal dependencies
 */
import config from 'config';
import userFactory from 'lib/user';
import { makeLayout } from 'controller';
import { navigation, siteSelection } from 'my-sites/controller';
import { singleSite, multiSite, loggedOut, details } from './controller';

const user = userFactory();

const isLoggedIn = !! user.get();

const designRoutes = isLoggedIn
	? {
		'/design': [ multiSite, navigation, siteSelection ],
		'/design/:site_id': [ singleSite, navigation, siteSelection ],
		'/design/type/:tier': [ multiSite, navigation, siteSelection ],
		'/design/type/:tier/:site_id': [ singleSite, navigation, siteSelection ],
	}
	: {
		'/design': [ loggedOut, makeLayout ],
		'/design/type/:tier': [ loggedOut, makeLayout ]
	};

const themesRoutes = isLoggedIn
	? {
		'/theme/:slug/:section?/:site_id?': [ details ], // TODO: Add makeLayout here once /theme has its own module
	}
	: {
		'/theme/:slug/:section?': [ details, makeLayout ],
	};

const routes = Object.assign( {},
	config.isEnabled( 'manage/themes' ) ? designRoutes : {},
	config.isEnabled( 'manage/themes/details' ) ? themesRoutes : {}
);

export default function( router ) {
	Object.keys( routes ).forEach( route => {
		router( route, ...routes[ route ] );
	} );
}
