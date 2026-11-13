<script lang="ts">
	import EditorSidebar from '../EditorSidebar.svelte';

	interface Props {
		onclose?: () => void;
		stacked?: boolean;
		width?: 'form' | 'wide';
		withActions?: boolean;
	}
	let { onclose = () => {}, stacked, width = 'form', withActions = true }: Props = $props();
</script>

<EditorSidebar title="Editor title" {width} {stacked} {onclose}>
	{#snippet headerActions()}
		{#if withActions}<button type="button">Header action</button>{/if}
	{/snippet}
	<p data-testid="body">Body content</p>
	{#snippet footer()}
		<span>Footer content</span>
	{/snippet}
</EditorSidebar>
