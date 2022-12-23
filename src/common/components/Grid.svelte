<script lang="ts">
	export let columns: number = 1;
	export let rows: number = 1;
	const cells = columns * rows + rows * 2 + columns * 2 + 4;
</script>

<div class="grid" style="--grid-columns: {columns}; --grid-rows: {rows}">
	{#each Array(cells) as cell, i}
		<div
			class="grid--cell"
			class:grid--cell__left={i % (columns + 2) === 0}
			class:grid--cell__top={i < columns + 2}
		/>
	{/each}
</div>

<style lang="postcss">
	.grid {
		inline-size: 100%;
		block-size: 100%;
		display: grid;
		grid-template-columns: var(--size-2) repeat(var(--grid-columns), 1fr) var(--size-2);
		grid-template-rows: var(--size-2) repeat(var(--grid-rows), var(--size-7)) var(--size-2);
	}

	.grid--cell {
		border-inline-start: var(--border-size-1) solid var(--gray-2);
		border-block-start: var(--border-size-1) solid var(--gray-2);
	}

	.grid--cell__left {
		border-inline-start: none;
	}

	.grid--cell__top {
		border-block-start: none;
	}
</style>
