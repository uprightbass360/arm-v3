// The coverage tool reports open arms on SlideOver that are Svelte's, not the
// component's: the `class="... {width}"` template compiles to `(width) ?? ''`
// (plus its attribute-update `if`), and width always has a default.
import { it, expect, vi, afterEach } from 'vitest';
import { renderComponent, screen, fireEvent, cleanup } from '$lib/test-utils';
import SlideOverHarness from './SlideOverHarness.svelte';

afterEach(cleanup);

it('renders title and body when open', () => {
	renderComponent(SlideOverHarness, { props: { open: true } });
	expect(screen.getByRole('dialog', { name: /panel title/i })).toBeInTheDocument();
	expect(screen.getByTestId('body')).toBeInTheDocument();
});

it('renders nothing when closed', () => {
	renderComponent(SlideOverHarness, { props: { open: false } });
	expect(screen.queryByRole('dialog')).toBeNull();
});

it('close button dismisses and fires onclose', async () => {
	const onclose = vi.fn();
	renderComponent(SlideOverHarness, { props: { open: true, onclose } });
	await fireEvent.click(screen.getByRole('button', { name: /close/i }));
	expect(onclose).toHaveBeenCalledOnce();
	expect(screen.queryByRole('dialog')).toBeNull();
});

it('Escape dismisses the panel', async () => {
	renderComponent(SlideOverHarness, { props: { open: true } });
	expect(screen.getByRole('dialog')).toBeInTheDocument();
	await fireEvent.keyDown(document, { key: 'Escape' });
	expect(screen.queryByRole('dialog')).toBeNull();
});

it('is not stacked by default', () => {
	renderComponent(SlideOverHarness, { props: {} });
	expect(document.querySelector('.slide-over-scrim')).toHaveAttribute('data-stacked', 'false');
	expect(screen.getByRole('dialog')).toHaveAttribute('data-stacked', 'false');
});

it('a stacked panel marks its scrim and panel to layer above another slide-over', () => {
	renderComponent(SlideOverHarness, { props: { stacked: true } });
	expect(document.querySelector('.slide-over-scrim')).toHaveAttribute('data-stacked', 'true');
	expect(screen.getByRole('dialog')).toHaveAttribute('data-stacked', 'true');
});
