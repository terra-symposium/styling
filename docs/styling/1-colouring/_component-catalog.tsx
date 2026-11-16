import * as React from 'react';
import { componentTsDocs } from '../../../dist/cache/component-tsdocs.js';
import * as UI from '../../../src/components/ui/index.js';

const GROUP_ORDER = ['Actions and forms', 'Content and feedback', 'Menus and overlays', 'Navigation and layout', 'Data and composition'] as const;

/** A compact index; interactive examples and API details live on each component page. */
export function ComponentCatalog(): React.JSX.Element {
	const [query, setQuery] = React.useState('');
	const normQuery = query.trim().toLowerCase();
	const base = import.meta.env.BASE_URL;
	const comps = Object.entries(componentTsDocs).map(([slug, docs]) => ({
		slug,
		title: docs.title,
		group: docs.group,
	}));

	return (
		<div className='grid gap-8'>
			<div className='grid max-w-md gap-2'>
				<UI.Label htmlFor='component-search'>Search components</UI.Label>
				<UI.Input id='component-search' type='search' value={query} onChange={event => setQuery(event.target.value)} placeholder='Search by name' />
			</div>
			{GROUP_ORDER.map(group => {
				const matches = comps.filter(component => component.group === group && component.title.toLowerCase().includes(normQuery));
				if (matches.length === 0) return null;
				return (
					<section key={group} className='grid gap-3'>
						<h2>{group}</h2>
						<ul className='grid gap-2 p-0 sm:grid-cols-2' style={{ listStyle: 'none' }}>
							{matches.map(component => (
								<li key={component.slug} className='min-w-0' style={{ listStyle: 'none' }}>
									<UI.Card variant='gray-outline' size='sm' className='block text-primary-12' href={`${base}styling/1-colouring/2-components/${component.slug}/`} style={{ textDecoration: 'none' }}>
										{component.title}
									</UI.Card>
								</li>
							))}
						</ul>
					</section>
				);
			})}
			{!comps.some(comp => comp.title.toLowerCase().includes(normQuery)) && <p>No components match your search.</p>}
		</div>
	);
}
