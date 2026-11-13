<script lang="ts">
	import SlideOver from '../SlideOver.svelte';

	let { withFooter = true, onclosebase }: { withFooter?: boolean; onclosebase?: () => void } = $props();
</script>

<SlideOver open title="Base panel" onclose={onclosebase}>
	<p>Base body</p>
	{#snippet footer()}
		{#if withFooter}<p data-testid="footer">Footer</p>{/if}
	{/snippet}
</SlideOver>
<SlideOver open title="Top panel" stacked>
	<p>Top body</p>
</SlideOver>
