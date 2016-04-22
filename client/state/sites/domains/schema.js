export const itemsSchema = {
	type: 'array',
	items: {
		type: 'object',
		properties: {
			'^\\d+$': {
				type: 'object',
				properties: {
					autoRenewalDate: { type: 'string' },
					autoRenewing: { type: 'boolean' },
					blogId: { type: 'number' },
					canSetAsPrimary: { type: 'boolean' },
					domain: { type: 'string' },
					expired: { type: 'boolean' },
					expiry: { type: 'boolean' },
					expirySoon: { type: 'boolean' },
					googleAppsSubscription: { type: 'object' },
					hasPrivateRegistration: { type: 'boolean' },
					hasRegistration: { type: 'boolean' },
					hasZone: { type: 'boolean' },
					isPendingIcannVerification: { type: 'boolean' },
					manualTransferRequired: { type: 'boolean' },
					newRegistration: { type: 'boolean' },
					partnerDomain: { type: 'boolean' },
					pendingRegistration: { type: 'boolean' },
					pendingRegistrationTime: { type: 'string' },
					isPrimary: { type: 'boolean' },
					isPrivate: { type: 'boolean' },
					registrationDate: { type: 'string' },
					type: { type: 'string' },
					wpcomDomain: { type: 'boolean' }
				}
			}
		}
	},
	additionalProperties: false
};
