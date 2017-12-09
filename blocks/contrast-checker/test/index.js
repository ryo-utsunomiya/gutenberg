/**
 * External dependencies
 */
import { shallow } from 'enzyme';
import tinycolor from 'tinycolor2';

/**
 * Internal dependencies
 */
import ContrastChecker from '../';

describe( 'ContrastChecker', () => {
	const backgroundColor = '#ffffff';
	const textColor = '#000000';
	const isLargeText = true;
	const fallbackBackgroundColor = '#fff';
	const fallbackTextColor = '#000';
	const sameShade = '#666';

	const wrapper = shallow(
		<ContrastChecker
			backgroundColor={ backgroundColor }
			textColor={ textColor }
			isLargeText={ isLargeText }
			fallbackBackgroundColor={ fallbackBackgroundColor }
			fallbackTextColor={ fallbackTextColor } />
	);

	test( 'should render null when no colors are provided', () => {
		expect( shallow( <ContrastChecker /> ).html() ).toBeNull();
	} );

	test( 'should render null when the colors meet AA WCAG guidelines.', () => {
		const readable = tinycolor.isReadable(
			backgroundColor,
			textColor,
			{ level: 'AA', size: ( isLargeText ? 'large' : 'small' ) }
		);

		expect( readable ).toBe( true );
		expect( wrapper.html() ).toBeNull();
	} );

	test( 'should render component when the colors do not meet AA WCAG guidelines.', () => {
		const readable = tinycolor.isReadable(
			sameShade,
			sameShade,
			{ level: 'AA', size: ( isLargeText ? 'large' : 'small' ) }
		);

		const componentWrapper = shallow(
			<ContrastChecker
				backgroundColor={ sameShade }
				textColor={ sameShade }
				isLargeText={ isLargeText }
				fallbackBackgroundColor={ fallbackBackgroundColor }
				fallbackTextColor={ fallbackTextColor } />
		);

		expect( readable ).toBe( false );
		expect( componentWrapper ).toMatchSnapshot();
	} );

	test( 'should render different message matching snapshot when background color has less brightness than text color and different text size.', () => {
		const darkerShade = '#555';
		const tinyBackgroundColor = tinycolor( darkerShade );
		const tinyTextColor = tinycolor( sameShade );

		const readable = tinycolor.isReadable(
			tinyBackgroundColor,
			tinyTextColor,
			{ level: 'AA', size: ( isLargeText ? 'large' : 'small' ) }
		);

		expect( tinyBackgroundColor.getBrightness() < tinyTextColor.getBrightness() ).toBe( true );

		const componentWrapper = shallow(
			<ContrastChecker
				backgroundColor={ darkerShade }
				textColor={ sameShade }
				isLargeText={ ! isLargeText }
				fallbackBackgroundColor={ fallbackBackgroundColor }
				fallbackTextColor={ fallbackTextColor } />
		);

		expect( readable ).toBe( false );
		expect( componentWrapper ).toMatchSnapshot();
	} );

	test( 'should render null when the colors meet AA WCAG guidelines, with only fallback colors', () => {
		const readable = tinycolor.isReadable(
			fallbackBackgroundColor,
			fallbackTextColor,
			{ level: 'AA', size: ( isLargeText ? 'large' : 'small' ) }
		);

		const componentWrapper = shallow(
			<ContrastChecker
				isLargeText={ isLargeText }
				fallbackBackgroundColor={ fallbackBackgroundColor }
				fallbackTextColor={ fallbackTextColor } />
		);

		expect( readable ).toBe( true );
		expect( componentWrapper.html() ).toBeNull();
	} );
} );
