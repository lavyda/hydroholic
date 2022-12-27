<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import Timetable from '../../../common/components/Timetable.svelte';
	import { formatISO } from 'date-fns';

	export let data: PageData;

	async function onDateInput(event: Event) {
		const url = new URL(window.location.href);
		url.searchParams.set('date', (event?.target as HTMLInputElement).value);
		goto(url);
	}

	$: form = $page.url.searchParams.get('date') ?? formatISO(new Date(), { representation: 'date' });
</script>

<form>
	<input type="date" bind:value={form} on:input={onDateInput} />
</form>

<Timetable blocks={data.blocks} />
