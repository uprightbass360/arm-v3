// What a form embedded in an EditorSidebar tells the sidebar's footer: whether
// its Save button is enabled, whether a save is in flight, and an optional
// note for the footer's usage line.
export interface EditorStatus {
	canSubmit: boolean;
	submitting: boolean;
	note: string;
}

export const IDLE_STATUS: EditorStatus = { canSubmit: false, submitting: false, note: '' };
