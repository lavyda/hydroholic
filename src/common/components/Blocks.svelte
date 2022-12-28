<script lang="ts">
	import { getHours, getMinutes } from 'date-fns';
	import { type Block, BlockStateColor } from '../services/blocks';

	export let columns: number = 1;
	export let rows: number = 1;
	export let blocks: Block[] = [];

	function getBlockGridColumn(block: Block): string {
		return `${block.position} / ${block.position + 1}`;
	}
	function getBlockGridRow(block: Block): string {
		const startHours = getHours(new Date(block.start));
		const startMinutes = getMinutes(new Date(block.start));
		const endHours = getHours(new Date(block.end));
		const endMinutes = getMinutes(new Date(block.end));
		const start = startMinutes ? startHours * 2 + 1 + 1 : startHours * 2 + 1;
		const end = endMinutes ? endHours * 2 + 1 + 1 : endHours * 2 + 1;
		return `${start} / ${end}`;
	}
	function getBlockBgColor(block: Block): string {
		return BlockStateColor[block.state];
	}
</script>

<div class="blocks" style="--grid-columns: {columns}; --grid-rows: {rows * 2}">
	{#each blocks as block}
		<div
			class="blocks--block"
			class:blocks--block__diagonal={getBlockBgColor(block) !== BlockStateColor.free}
			class:blocks--block__fill={getBlockBgColor(block) === BlockStateColor.free}
			style="--block-color: {getBlockBgColor(block)}; --block-grid-column: {getBlockGridColumn(
				block
			)}; --block-grid-row: {getBlockGridRow(block)}"
		/>
	{/each}
</div>

<style lang="postcss">
	.blocks {
		padding: var(--size-2);
		display: grid;
		grid-template-columns: repeat(var(--grid-columns), 1fr);
		grid-template-rows: repeat(var(--grid-rows), var(--size-3));
	}

	.blocks--block {
		grid-column: var(--block-grid-column);
		grid-row: var(--block-grid-row);
		border-radius: var(--size-2);
		border: 1px solid var(--block-color);
	}

	.blocks--block__fill {
		background-color: var(--block-color);
		opacity: 0.5;
	}

	.blocks--block__diagonal {
		background-size: 10px 10px;
		background-image: repeating-linear-gradient(
			45deg,
			var(--gray-4) 0,
			var(--gray-4) 2px,
			white 0,
			white 50%
		);
	}
</style>
