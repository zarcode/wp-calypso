import React from 'react';

import Gridicon from 'components/gridicon';
import SocialLogo from 'components/social-logo';

export default [
	{
		name: 'insert_media_item',
		icon: 'image-multiple',
		item: <div><Gridicon icon="image-multiple" /> Add Media</div>
	},
	{
		name: 'insert_contact_form',
		icon: 'mention',
		item: <div><Gridicon icon="mention" /> Add Contact Form</div>,
		cmd: 'wpcomContactForm'
	},
	{
		name: 'insert_instragram_item',
		icon: 'instagram',
		item: <div><SocialLogo icon="instagram" /> Instagram Widget</div>
	}
];
