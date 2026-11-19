/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

/**
 * Renders the carousel component example.
 * @return Renders the example and returns its React element.
 */
export default function Demo(): React.JSX.Element {
	return (
		<UI.Carousel className='w-64'>
			<UI.CarouselContent>
				<UI.CarouselItem>First slide</UI.CarouselItem>
				<UI.CarouselItem>Second slide</UI.CarouselItem>
			</UI.CarouselContent>
			<UI.CarouselPrevious />
			<UI.CarouselNext />
		</UI.Carousel>
	);
}

export const exampleCode =
	"import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@terra-symposium/styling/ui';\n\n<Carousel className='w-64'><CarouselContent><CarouselItem>First slide</CarouselItem><CarouselItem>Second slide</CarouselItem></CarouselContent><CarouselPrevious /><CarouselNext /></Carousel>";
