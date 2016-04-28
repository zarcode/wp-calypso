Site Domains
============

A module for managing site domains data.

# Actions

Used in combination with the Redux store instance `dispatch` function, actions can be used in manipulating the current global state.

### `fetchSiteDomains( siteId: Number )`

Fetches domains for the site with the given site ID.

### `refreshSiteDomains( siteID: Number )`

Clears domains and fetches them for the given site.

## Action creators

> Action creators are exactly that—functions that create actions.

### createDomainsReceiveAction( siteId, response )

### createDomainsRequestAction( siteId )

### createDomainsRequestSuccessAction( siteId )

### createDomainsRequestFailureAction( siteId, error )

```es6
import {
	createDomainsReceiveAction,
	createDomainsRequestAction,
	createDomainsRequestSuccessAction,
	createDomainsRequestFailureAction
} from 'state/sites/domains/actions';

const siteId = 2916284;

dispatch( createDomainsRequestAction( siteId ) );

wpcom
.site( siteId )
.domainsList( ( error, response ) => {
	if ( error ) {
		return dispatch( createDomainsRequestFailureAction( siteId, error.message );
	}

	dispatch( createDomainsRequestSuccessAction( siteId ) );
	dispatch( createDomainsReceiveAction( site,id, response.domains ) );
```

# Reducer
Data from the aforementioned actions is added to the global state tree, under `sites.domains`, with the following structure:

```js
state.sites.domains = {
	items: {
		[ siteId ]: [
			{
				autoRenewalDate: String,
				autoRenewing: Number,
				blogId: Number,
				canSetAsPrimary: Boolean,
				domain: String,
				expired: Boolean,
				expiry: setMomentType,
				expirySoon: Boolean,
				googleAppsSubscription: String,
				hasPrivateRegistration: Boolean,
				hasRegistration: Boolean,
				hasZone: Boolean,
				isPendingIcannVerification: Boolean,
				manualTransferRequired: Boolean,
				newRegistration: Boolean,
				partnerDomain: Boolean,
				pendingRegistration: Boolean,
				pendingRegistrationTime: String,
				isPrimary: Boolean,
				isPrivate: Boolean,
				registrationDate: String.
				type: String,
				wpcomDomain: Boolean
			}
		]
	},
	
	requesting: [
		[ siteId ]: Boolean
	],

	errors: [
		[ siteId ]: Boolean
	]
}
```
