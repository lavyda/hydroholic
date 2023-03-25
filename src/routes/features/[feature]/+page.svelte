<script lang="ts">
	import { formatISO } from 'date-fns';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import Timetable from '../../../common/components/Timetable.svelte';
	import BlockDetailsDialog from '../../../common/components/BlockDetailsDialog.svelte';
	import { features } from '../../../common/services/features';
	import type { Block } from '../../../common/services/blocks';

	export let data: PageData;

	let blockDialog: HTMLDialogElement;
	let blockDialogData: Block;

	async function onDateInput(event: Event) {
		const url = new URL(window.location.href);
		url.searchParams.set('date', (event?.target as HTMLInputElement).value);
		goto(url);
	}

	function onFeatureInput(event: Event) {
		const url = new URL(
			`${window.location.origin}/features/${(event?.target as HTMLSelectElement).value}`
		);
		if (date) {
			url.searchParams.set('date', date);
		}
		goto(url);
	}

	function onDetails(event: CustomEvent) {
		blockDialogData = event.detail.block;
		blockDialog.showModal();
	}

	$: date = $page.url.searchParams.get('date');
	$: form = date ?? formatISO(new Date(), { representation: 'date' });
</script>

<form>
	<div>
		<label for="feature">Zariadenie: </label>
		<select id="feature" on:input={onFeatureInput}>
			{#each features as option}
				<option value={option.id} selected={Number($page.params.feature) === option.id}
					>{option.name}</option
				>
			{/each}
		</select>
	</div>

	<div>
		<label for="date">Dátum: </label>
		<input id="date" type="date" bind:value={form} on:input={onDateInput} />
	</div>
</form>

<small>Kliknite na udalosť v rozvrhu pre viac informácií</small>

<h1>{data.name}</h1>

<Timetable blocks={data.blocks} on:details={onDetails} />

<BlockDetailsDialog bind:dialog={blockDialog} block={blockDialogData} />

<style lang="postcss">
	form {
		display: flex;
		flex-direction: column;
		gap: var(--size-1);
	}

	h1 {
		font-size: var(--font-size-3);
	}
</style>
