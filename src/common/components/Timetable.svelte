<script lang="ts">
	import { eachHourOfInterval, endOfToday, format, startOfToday } from 'date-fns';
	import type { Block } from '../services/blocks';
	import Blocks from './Blocks.svelte';
	import Grid from './Grid.svelte';

	export let blocks: Block[] = [];

	const hours = eachHourOfInterval({ start: startOfToday(), end: endOfToday() });
	$: positions = Array.from(new Set(blocks.map((b) => b.position)));
	function formatHour(hour: Date): string {
		return format(hour, 'HH:mm');
	}
</script>

<div class="timetable">
	<div class="timetable--xaxis">
		{#each hours as hour}
			<div>{formatHour(hour)}</div>
		{/each}
	</div>

	<div class="timetable--yaxis" style="--yaxis-cells: {positions.length}">
		{#each positions as position}
			<div>{position}</div>
		{/each}
	</div>

	<div class="timetable--body">
		<div class="body--grid">
			<Grid columns={positions.length} rows={hours.length} />
		</div>
		<div class="body--blocks">
			<Blocks {blocks} columns={positions.length} rows={hours.length} on:details />
		</div>
	</div>
</div>

<style lang="postcss">
	.timetable {
		inline-size: 100%;
		block-size: 100%;
		display: grid;
		grid-template-columns: auto 1fr;
		grid-template-rows: auto 1fr;
		grid-template-areas:
			'. yaxis'
			'xaxis body';
		gap: var(--size-1);
	}

	.timetable--xaxis {
		grid-area: xaxis;
	}

	.timetable--xaxis > div {
		block-size: var(--size-7);
		inline-size: var(--size-8);
		font-size: var(--font-size-0);
		color: var(--gray-7);
		text-align: right;
	}

	.timetable--yaxis {
		grid-area: yaxis;
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: repeat(var(--yaxis-cells), 1fr);
		font-size: var(--font-size-0);
		color: var(--gray-7);
		padding: 0 var(--size-2);
	}

	.timetable--yaxis > div {
		text-align: center;
	}

	.timetable--body {
		grid-area: body;
		position: relative;
	}

	.body--grid {
		position: absolute;
		block-size: 100%;
		inline-size: 100%;
	}

	.body--blocks {
		position: relative;
		z-index: 1;
	}
</style>
