<script lang="ts" generics="R">
	// A read-only table: the columns say what each cell shows, the actions
	// snippet draws the last cell of every row. The wrapper scrolls sideways
	// in a narrow window, never the page.
	import type { Snippet } from 'svelte';
	import type { BadgeTone, TableColumn } from '$lib/components/sessions/tableColumns';

	interface Props {
		columns: TableColumn<R>[];
		rows: R[];
		rowKey: (row: R) => string;
		activeKey?: string | null;
		label: string;
		actions: Snippet<[R]>;
		empty?: string;
	}

	const BADGE_CLASS: Record<BadgeTone, string> = {
		warn: 'badge badge-sm badge-warning',
		info: 'badge badge-sm badge-info',
		neutral: 'badge badge-sm'
	};

	let { columns, rows, rowKey, activeKey = null, label, actions, empty }: Props = $props();
</script>

<div class="data-table-scroll">
	<table class="data-table" aria-label={label}>
		<thead>
			<tr>
				{#each columns as col (col.id)}
					<th scope="col" class={col.align === 'end' ? 'data-table-num' : ''}>{col.header}</th>
				{/each}
				<th scope="col"><span class="sr-only">Actions</span></th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row (rowKey(row))}
				<tr aria-current={rowKey(row) === activeKey ? 'true' : undefined}>
					{#each columns as col (col.id)}
						{@const cell = col.cell(row)}
						<td class={col.align === 'end' ? 'data-table-num' : ''} data-muted={cell.muted ? 'true' : undefined}>
							<div class="data-table-main">
								<span class="data-table-text" title={cell.text}>{cell.text}</span>
								{#each cell.badges ?? [] as badge (badge.text)}
									<span class={BADGE_CLASS[badge.tone]}>{badge.text}</span>
								{/each}
							</div>
							{#if cell.sub}<div class="data-table-sub" title={cell.sub}>{cell.sub}</div>{/if}
						</td>
					{/each}
					<td class="data-table-actions">{@render actions(row)}</td>
				</tr>
			{:else}
				{#if empty}
					<tr>
						<td class="data-table-empty" colspan={columns.length + 1}>{empty}</td>
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>
</div>

<style>
	.data-table-scroll {
		overflow-x: auto;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-surface);
	}
	.data-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.8125rem;
	}
	.data-table th {
		padding: 0.625rem 1rem;
		text-align: left;
		font-size: 0.6875rem;
		font-weight: 400;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		white-space: nowrap;
		color: var(--color-text-muted);
	}
	.data-table td {
		max-width: 16rem;
		padding: 0.625rem 1rem;
		border-top: 1px solid var(--color-border);
		color: var(--color-text);
		vertical-align: middle;
	}
	.data-table tr[aria-current='true'] {
		background: var(--color-primary-tint-2);
	}
	.data-table td[data-muted='true'] {
		color: var(--color-text-muted);
	}
	.data-table .data-table-num {
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
	.data-table-main {
		display: flex;
		min-width: 0;
		align-items: center;
		gap: 0.5rem;
	}
	.data-table-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.data-table-sub {
		margin-top: 0.125rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}
	.data-table-actions {
		white-space: nowrap;
		text-align: right;
	}
	.data-table td.data-table-empty {
		max-width: none;
		padding: 1rem;
		text-align: center;
		color: var(--color-text-faint);
	}
</style>
