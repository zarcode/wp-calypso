/**
 * External dependencies
 */
import page from 'page';
import React from 'react';
import shuffle from 'lodash/shuffle';

/**
 * Internal dependencies
 */
import config from 'config';
import CompactCard from 'components/card/compact';
import Dialog from 'components/dialog';
import { getIncludedDomain, getName, hasIncludedDomain, isRemovable } from 'lib/purchases';
import { getPurchase, isDataLoading } from '../utils';
import Gridicon from 'components/gridicon';
import { isDomainRegistration, isPlan } from 'lib/products-values';
import notices from 'notices';
import purchasePaths from '../paths';
import { removePurchase } from 'lib/upgrades/actions';
import FormSectionHeading from 'components/forms/form-section-heading';
import FormFieldset from 'components/forms/form-fieldset';
import FormLegend from 'components/forms/form-legend';
import FormLabel from 'components/forms/form-label';
import FormRadio from 'components/forms/form-radio';
import FormTextInput from 'components/forms/form-text-input';
import FormTextarea from 'components/forms/form-textarea';

/**
 * Module dependencies
 */
import debugFactory from 'debug';
const debug = debugFactory( 'calypso:purchases:survey' );

const RemovePurchase = React.createClass( {
	propTypes: {
		selectedPurchase: React.PropTypes.object.isRequired,
		selectedSite: React.PropTypes.oneOfType( [
			React.PropTypes.object,
			React.PropTypes.bool,
			React.PropTypes.undefined
		] ),
		user: React.PropTypes.object.isRequired
	},

	getInitialState() {
		// shuffle reason order, but keep another_reason last
		let reasonOrder = shuffle( [
			'could_not_install',
			'too_hard',
			'did_not_include',
			'only_need_free'
		] );
		reasonOrder.push( 'another_reason' );

		return {
			isDialogVisible: false,
			isRemoving: false,
			checkedRadio: null,
			reasonOrder: reasonOrder
		};
	},

	closeDialog() {
		this.setState( { isDialogVisible: false } );
	},

	openDialog( event ) {
		event.preventDefault();

		this.setState( { isDialogVisible: true } );
	},

	removePurchase( closeDialog ) {
		this.setState( { isRemoving: true } );

		const purchase = getPurchase( this.props ),
			{ selectedSite, user } = this.props;

		// Tracks update goes here

		removePurchase( purchase.id, user.ID, success => {
			if ( success ) {
				const productName = getName( purchase );

				if ( isDomainRegistration( purchase ) ) {
					notices.success(
						this.translate( 'The domain {{domain/}} was removed from your account.', {
							components: { domain: <em>{ productName }</em> }
						} ),
						{ persistent: true }
					);
				} else {
					notices.success(
						this.translate( '%(productName)s was removed from {{siteName/}}.', {
							args: { productName },
							components: { siteName: <em>{ selectedSite.slug }</em> }
						} ),
						{ persistent: true }
					);
				}

				page( purchasePaths.list() );
			} else {
				this.setState( { isRemoving: false } );

				closeDialog();

				notices.error( this.props.selectedPurchase.error );
			}
		} );
	},

	handleRadio( event ) {
		this.setState( {
			checkedRadio: event.currentTarget.value
		} );
	},

	renderCard() {
		const productName = getName( getPurchase( this.props ) );

		return (
			<CompactCard className="remove-purchase__card" onClick={ this.openDialog }>
				<a href="#">
					<Gridicon icon="trash" />
					{ this.translate( 'Remove %(productName)s', { args: { productName } } ) }
				</a>
			</CompactCard>
		);
	},

	renderDialog() {
		const buttons = [ {
				action: 'cancel',
				disabled: this.state.isRemoving,
				label: this.translate( 'Cancel' )
			},
			{
				action: 'remove',
				disabled: this.state.isRemoving,
				isPrimary: true,
				label: this.translate( 'Remove Now' ),
				onClick: this.removePurchase
			} ],
			productName = getName( getPurchase( this.props ) );

		return (
			<Dialog
				buttons={ buttons }
				className="remove-purchase__dialog"
				isVisible={ this.state.isDialogVisible }
				onClose={ this.closeDialog }>
				<FormSectionHeading>{ this.translate( 'Remove %(productName)s', { args: { productName } } ) }</FormSectionHeading>
				{ config.isEnabled( 'upgrades/removal-survey' ) ? this.renderSurvey() : null }
				{ this.renderDialogText() }
			</Dialog>
		);
	},

	renderDialogText() {
		const purchase = getPurchase( this.props ),
			productName = getName( purchase );

		if ( isDomainRegistration( purchase ) ) {
			return (
				<p>
					{
						this.translate( 'This will remove %(domain)s from your account.', {
							args: { domain: productName }
						} )
					}
					{ ' ' }
					{ this.translate( 'By removing, you are canceling the domain registration. This may stop you from using it again, even with another service.' ) }
				</p>
			);
		}

		let includedDomainText;

		if ( isPlan( purchase ) && hasIncludedDomain( purchase ) ) {
			includedDomainText = (
				<p>
					{
						this.translate(
							'The domain associated with this plan, {{domain/}}, will not be removed. It will remain active on your site, unless also removed.',
							{
								components: { domain: <em>{ getIncludedDomain( purchase ) }</em> }
							}
						)
					}
				</p>
			);
		}

		return (
			<div>
				<p>
					{
						this.translate( 'Are you sure you want to remove %(productName)s from {{siteName/}}?', {
							args: { productName },
							components: { siteName: <em>{ this.props.selectedSite.slug }</em> }
						} )
					}
					{ ' ' }
					{ this.translate( 'You will not be able to reuse it again without purchasing a new subscription.', {
						context: 'Removal confirmation on Manage Purchase page',
						comment: '"it" refers to a product purchased by a user'
					} ) }
				</p>

				{ includedDomainText }
			</div>
		);
	},

	renderSurvey() {
		let reasons = {},
			ordered_reasons = [];

		let could_not_install_input = (
			<FormTextInput
				name="could_not_install_input"
				id="could_not_install_input"
				placeholder={ this.translate( 'What plugin/theme were you trying to install?' ) } />
		);
		reasons.could_not_install = (
			<FormLabel key="could_not_install">
				<FormRadio
					name="could_not_install"
					value="could_not_install"
					checked={ 'could_not_install' === this.state.checkedRadio }
					onChange={ this.handleRadio } />
				<span>{ this.translate( 'I couldn\'t install a plugin/theme I wanted.' ) }</span>
				{ 'could_not_install' === this.state.checkedRadio ? could_not_install_input : null }
			</FormLabel>
		);

		let too_hard_input = (
			<FormTextInput
				name="too_hard_input"
				id="too_hard_input"
				placeholder={ this.translate( 'Where did you run into problems?' ) } />
		);
		reasons.too_hard = (
			<FormLabel key="too_hard">
				<FormRadio
					name="too_hard"
					value="too_hard"
					checked={ 'too_hard' === this.state.checkedRadio }
					onChange={ this.handleRadio } />
				<span>{ this.translate( 'It was too hard to set up my site.' ) }</span>
				{ 'too_hard' === this.state.checkedRadio ? too_hard_input : null }
			</FormLabel>
		);

		let did_not_include_input = (
			<FormTextInput
				name="did_not_include_input"
				id="did_not_include_input"
				placeholder={ this.translate( 'What are we missing that you need?' ) } />
		);
		reasons.did_not_include = (
			<FormLabel key="did_not_include">
				<FormRadio
					name="did_not_include"
					value="did_not_include"
					checked={ 'did_not_include' === this.state.checkedRadio }
					onChange={ this.handleRadio } />
				<span>{ this.translate( 'This upgrade didn\'t include what I needed.' ) }</span>
				{ 'did_not_include' === this.state.checkedRadio ? did_not_include_input : null }
			</FormLabel>
		);

		let only_need_free_input = (
			<FormTextInput
				name="only_need_free_input"
				id="only_need_free_input"
				placeholder={ this.translate( 'Is there anything we can do to improve our upgrades?' ) } />
		);
		reasons.only_need_free = (
			<FormLabel key="only_need_free">
				<FormRadio
					name="only_need_free"
					value="only_need_free"
					checked={ 'only_need_free' === this.state.checkedRadio }
					onChange={ this.handleRadio } />
				<span>{ this.translate( 'All I need is the free plan.' ) }</span>
				{ 'only_need_free' === this.state.checkedRadio ? only_need_free_input : null }
			</FormLabel>
		);

		let another_reason_input = (
			<FormTextInput
				name="another_reason_input"
				id="another_reason_input" />
		);
		reasons.another_reason = (
			<FormLabel key="another_reason">
				<FormRadio
					name="another_reason"
					value="another_reason"
					checked={ 'another_reason' === this.state.checkedRadio }
					onChange={ this.handleRadio } />
				<span>{ this.translate( 'Another reason…' ) }</span>
				{ 'another_reason' === this.state.checkedRadio ? another_reason_input : null }
			</FormLabel>
		);

		for ( let i in this.state.reasonOrder ) {
			ordered_reasons.push( reasons[this.state.reasonOrder[i]] );
		}

		return (
			<div>
				<FormFieldset>
					<FormLegend>{ this.translate( 'Please tell us why you are canceling:' ) }</FormLegend>
					{ ordered_reasons }
					<FormLabel>
						{ this.translate( 'What\'s one thing we could have done better? (optional)' ) }
						<FormTextarea name="improvement_input" id="improvement_input" />
					</FormLabel>
				</FormFieldset>
			</div>
		);
	},

	render() {
		if ( isDataLoading( this.props ) || ! this.props.selectedSite ) {
			return null;
		}

		const purchase = getPurchase( this.props );
		if ( ! isRemovable( purchase ) ) {
			return null;
		}

		return (
			<span>
				{ this.renderCard() }
				{ this.renderDialog() }
			</span>
		);
	}
} );

export default RemovePurchase;
