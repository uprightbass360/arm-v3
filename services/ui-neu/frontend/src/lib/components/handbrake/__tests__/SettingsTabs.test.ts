import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderComponent, screen, cleanup } from '$lib/test-utils';
import { fireEvent } from '@testing-library/svelte';
import type { HandbrakeSchemaSlimView, SettingIssue } from '$lib/types/api.gen';
import fixture from '$lib/handbrake/__tests__/fixtures/slim-schema.json';
import SettingsTabs from './SettingsTabsHarness.svelte';

const schema = fixture as unknown as HandbrakeSchemaSlimView;

function mount(over: Record<string, unknown> = {}) {
	const ontab = vi.fn();
	const result = renderComponent(SettingsTabs, {
		props: { schema, settings: { common: {}, encoders: {} }, issues: [], tab: 'summary', ontab, ...over }
	});
	return { ontab, ...result };
}
const tab = (name: string) => screen.getByRole('tab', { name: new RegExp(`^${name}`) });

describe('SettingsTabs', () => {
	afterEach(() => cleanup());

	it('renders the tab strip with the selected tab marked', () => {
		mount({ tab: 'video' });
		expect(screen.getAllByRole('tab')).toHaveLength(7);
		expect(tab('Video')).toHaveAttribute('aria-selected', 'true');
		expect(tab('Audio')).toHaveAttribute('aria-selected', 'false');
	});

	it('reports a clicked tab', async () => {
		const { ontab } = mount();
		await fireEvent.click(tab('Filters'));
		expect(ontab).toHaveBeenCalledWith('filters');
	});

	it('shows stored counts without a filter and no count for empty tabs', () => {
		mount({ settings: { common: { PictureWidth: 1, PictureHeight: 2 }, encoders: {} } });
		expect(tab('Dimensions')).toHaveTextContent('2');
		expect(tab('Audio').textContent).not.toMatch(/\d/);
		expect(tab('Audio')).toHaveAttribute('data-dim', 'false');
	});

	it('shows a warning glyph on a tab with an issue', () => {
		const issues = [
			{ key: 'PictureWidth', code: 'out_of_range', message: 'x' },
			{ key: 'AudioBitrate', code: 'not_in_list', message: 'y' }
		] as SettingIssue[];
		mount({ issues });
		expect(tab('Dimensions').querySelector('svg')).not.toBeNull();
		expect(tab('Audio').querySelector('svg')).not.toBeNull();
		expect(tab('Video').querySelector('svg')).toBeNull();
	});

	it('counts matches per tab, dims tabs with none and jumps to the first match', async () => {
		const { ontab } = mount({ tab: 'summary' });
		await fireEvent.input(screen.getByPlaceholderText('Filter settings'), { target: { value: 'PictureWidth' } });
		expect(tab('Dimensions')).toHaveTextContent('1');
		expect(tab('Video')).toHaveAttribute('data-dim', 'true');
		expect(tab('Dimensions')).toHaveAttribute('data-dim', 'false');
		expect(ontab).toHaveBeenCalledWith('dimensions');
	});

	it('hands the filter state to the body', async () => {
		mount();
		await fireEvent.input(screen.getByPlaceholderText('Filter settings'), { target: { value: 'abc' } });
		await fireEvent.click(screen.getByLabelText('Changed only'));
		expect(screen.getByText('body abc|true')).toBeInTheDocument();
	});

	it('combines Changed only with the filter', async () => {
		mount({ settings: { common: { PictureWidth: 1 }, encoders: {} }, tab: 'dimensions' });
		await fireEvent.input(screen.getByPlaceholderText('Filter settings'), { target: { value: 'Picture' } });
		const all = Number(tab('Dimensions').textContent!.replace(/\D/g, ''));
		await fireEvent.click(screen.getByLabelText('Changed only'));
		expect(Number(tab('Dimensions').textContent!.replace(/\D/g, ''))).toBe(1);
		expect(all).toBeGreaterThan(1);
	});

	it('does not move the tab when the filter is cleared', async () => {
		const { ontab } = mount({ tab: 'summary' });
		const box = screen.getByPlaceholderText('Filter settings');
		await fireEvent.input(box, { target: { value: 'PictureWidth' } });
		expect(ontab).toHaveBeenCalledTimes(1);
		await fireEvent.input(box, { target: { value: '' } });
		expect(ontab).toHaveBeenCalledTimes(1);
	});

	it('re-runs the jump when Changed only is toggled with text', async () => {
		const { ontab } = mount({ tab: 'summary', settings: { common: { PictureWidth: 1 }, encoders: {} } });
		await fireEvent.input(screen.getByPlaceholderText('Filter settings'), { target: { value: 'Picture' } });
		ontab.mockClear();
		await fireEvent.click(screen.getByLabelText('Changed only'));
		expect(ontab).toHaveBeenCalledWith('dimensions');
	});

	it('does not jump when Changed only is toggled without text', async () => {
		const { ontab } = mount();
		await fireEvent.click(screen.getByLabelText('Changed only'));
		expect(ontab).not.toHaveBeenCalled();
	});
});
