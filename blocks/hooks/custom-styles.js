/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getBlockRandomAnchor, hasBlockSupport, getBlockType } from '../api';

const CUSTOM_STYLE_ATTRIBUTES = [ 'backgroundColor', 'textColor' ];

const hasCustomStyles = ( attributes ) => (
	CUSTOM_STYLE_ATTRIBUTES.some( attr => attributes[ attr ] )
);

class AddAnchorWhenNeeded extends Component {
	componentWillReceiveProps( nextProps ) {
		if ( ! nextProps.attributes.anchor && hasCustomStyles( nextProps.attributes ) ) {
			nextProps.setAttributes( {
				anchor: getBlockRandomAnchor( nextProps.name ),
			} );
		}
	}

	render() {
		return null;
	}
}

export function addAnchorWhenStylesNeed( element, props ) {
	if ( hasBlockSupport( props.name, 'anchor' ) ) {
		const blockType = getBlockType( props.name );
		if ( blockType && hasCustomStyles( blockType.attributes ) ) {
			element = [ element, <AddAnchorWhenNeeded key="add-anchor" { ...props } /> ];
		}
	}
	return element;
}

export function addCustomStylesClass( extraProps, blockType, attributes ) {
	if ( hasCustomStyles( attributes ) ) {
		extraProps.className = classnames( extraProps.className, 'has-custom-styles' );
	}

	return extraProps;
}

export default function customAnchorStyles( { addFilter } ) {
	addFilter( 'BlockEdit', 'core-anchor-inspector-control', addAnchorWhenStylesNeed );
	addFilter( 'getSaveContent.extraProps', 'core-custom-styles-save-props', addCustomStylesClass );
}
