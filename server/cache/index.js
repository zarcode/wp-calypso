/**
 * External dependencies
 */
import Lru from 'lru-cache';

/**
 * Internal dependencies
 */
import config from 'config';

function memoizeFactory( cache ) {
	return function memoize( fn, resolver ) {
		const memoized = function( ...args ) {
			const key = resolver ? resolver.apply( this, args ) : args[0];
			let result = cache.get( key );

			if ( result !== undefined ) {
				return result;
			}

			result = fn.apply( this, args );
			cache.set( key, result );
			return result;
		};

		return memoized;
	}
}

class Cache {
	get( /** key **/ ) {
		throw Error( 'Implement me!' );
	}

	set( /** key, value **/ ) {
		throw Error( 'Implement me!' );
	}
};

class LocalCache extends Cache {
	constructor() {
		super();
		this.cache = new Lru( { max: 1000 } );
		this.memoize = memoizeFactory( this.cache );
	}

	get( key ) {
		return this.cache.get( key );
	}

	set( key, value ) {
		return this.cache.set( key, value );
	}
}

export default function() {
	if ( config( 'cache' ) === 'local' ) {
		return new LocalCache();
	}
}
