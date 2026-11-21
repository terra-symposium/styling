/**
 * docs/styling/1-colouring/demos/carousel.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

/**
 * Renders the carousel component example.
 * @param variant - Appearance variant selected in the workbench.
 * @return Renders the example and returns its React element.
 */
export default function Demo({ variant }: { variant?: string }): React.JSX.Element {
	return (
		<UI.Carousel className='w-64'>
			<UI.CarouselContent>
				<UI.CarouselItem>First slide</UI.CarouselItem>
				<UI.CarouselItem>Second slide</UI.CarouselItem>
			</UI.CarouselContent>
			<UI.CarouselPrevious variant={variant as React.ComponentProps<typeof UI.CarouselPrevious>['variant']} />
			<UI.CarouselNext />
		</UI.Carousel>
	);
}

export const exampleCode =
	"import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@terra-symposium/styling/ui';\n\n<Carousel className='w-64'><CarouselContent><CarouselItem>First slide</CarouselItem><CarouselItem>Second slide</CarouselItem></CarouselContent><CarouselPrevious /><CarouselNext /></Carousel>";
