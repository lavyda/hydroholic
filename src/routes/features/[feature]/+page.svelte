<script lang="ts">
	import type { PageData } from './$types';
	import Timetable from '../../../common/components/Timetable.svelte';

	export let data: PageData;
</script>

<Timetable blocks={data.blocks} />
