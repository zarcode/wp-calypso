import React from 'react';
import ReactDOM from 'react-dom';
import { renderToString } from 'react-dom/server';
import tinymce from 'tinymce/tinymce';

import Gridicon from 'components/gridicon';

const initialize = editor => {
	editor.addMenuItem( 'add_contact_form_menu', {
		text: 'Add Contact Form',
		icon: 'unlink',
		onPostRender() {
			this.innerHtml( renderToString(
				<div><Gridicon icon="external" /> External</div>
			) );
		},
		onClick() {
			console.log( 'add contact form' );
		}
	} );

	editor.addMenuItem( 'add_media_menu', {
		text: 'Add media',
		icon: 'image',
		onPostRender() {
			this.innerHtml( renderToString(
				<div><Gridicon icon="image-multiple" /> Media</div>
			) );
		},
		onClick() {
			console.log( 'add media' );
		}
	} );

	editor.addButton( 'wpcom_insert_menu', {
		type: 'splitbutton',
		text: 'Add',
		title: 'Insert content',
		classes: 'btn wpcom-insert-menu insert-menu',
		menu: [
			editor.menuItems[ 'add_media_menu' ],
			editor.menuItems[ 'add_contact_form_menu' ]
		],
		onPostRender() {
			ReactDOM.render(
				<Gridicon icon="image-multiple" />,
				this.$el[0].children[0]
			);
		},
		onclick() {
			console.log( 'add media default' );
		}
	} );
};

export default () => {
	tinymce.PluginManager.add( 'wpcom/insertmenu', initialize );
};
