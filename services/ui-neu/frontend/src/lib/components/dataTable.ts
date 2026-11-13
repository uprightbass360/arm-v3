// The shapes DataTable draws: a column says what each cell shows, and a cell
// is the text, sub line, pill and badges of one value.
import type { MediaType } from '$lib/types/api.gen';

export type BadgeTone = 'warn' | 'info' | 'neutral';

export type PillTone = MediaType | 'custom' | 'builtin';

export type CellContent = {
	text: string;
	/** Draw the cell as an uppercase pill: a media-type pill, or the Custom / Built-in tag. */
	pill?: { tone: PillTone };
	sub?: string;
	muted?: boolean;
	/** Draw the text in the monospace face (paths). */
	mono?: boolean;
	badges?: Array<{ text: string; tone: BadgeTone }>;
};

export interface TableColumn<R> {
	id: string;
	header: string;
	align?: 'start' | 'end';
	cell: (row: R) => CellContent;
}
