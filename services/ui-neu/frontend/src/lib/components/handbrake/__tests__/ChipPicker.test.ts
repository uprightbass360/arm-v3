import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderComponent, screen, cleanup } from '$lib/test-utils';
import { fireEvent } from '@testing-library/svelte';
import ChipPicker from '../ChipPicker.svelte';

function mount(over: Record<string, unknown> = {}) {
	const onchange = vi.fn();
	renderComponent(ChipPicker, { props: { id: 'c', values: ['a', 'b'], options: null, onchange, ...over } });
	return onchange;
}
const box = () => screen.getByLabelText('Add value') as HTMLInputElement;

describe('ChipPicker', () => {
	afterEach(() => cleanup());

	it('adds a trimmed value with Enter and clears the input', async () => {
		const onchange = mount();
		await fireEvent.input(box(), { target: { value: '  c ' } });
		await fireEvent.keyDown(box(), { key: 'Enter' });
		expect(onchange).toHaveBeenCalledWith(['a', 'b', 'c']);
		expect(box().value).toBe('');
	});

	it('ignores other keys, empties and duplicates', async () => {
		const onchange = mount();
		await fireEvent.input(box(), { target: { value: 'z' } });
		await fireEvent.keyDown(box(), { key: 'a' });
		await fireEvent.click(screen.getByRole('button', { name: 'Add' }));
		await fireEvent.click(screen.getByRole('button', { name: 'Add' }));
		await fireEvent.input(box(), { target: { value: 'a' } });
		await fireEvent.click(screen.getByRole('button', { name: 'Add' }));
		expect(onchange).toHaveBeenCalledTimes(1);
		expect(onchange).toHaveBeenCalledWith(['a', 'b', 'z']);
	});

	it('removes a chip', async () => {
		const onchange = mount();
		await fireEvent.click(screen.getByRole('button', { name: 'Remove a' }));
		expect(onchange).toHaveBeenCalledWith(['b']);
	});

	it('picks from options not already chosen', async () => {
		const onchange = mount({ options: ['a', 'x', 3] });
		const select = screen.getByLabelText('Add value') as HTMLSelectElement;
		expect([...select.options].map((o) => o.value)).toEqual(['', 'x', '3']);
		await fireEvent.change(select, { target: { value: '3' } });
		expect(onchange).toHaveBeenCalledWith(['a', 'b', '3']);
	});

	it('disables its controls', () => {
		mount({ disabled: true });
		expect(box()).toBeDisabled();
		expect(screen.getByRole('button', { name: 'Remove a' })).toBeDisabled();
	});
});
