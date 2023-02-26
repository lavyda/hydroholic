<script lang="ts">
	import { BlockStateLabel, type Block } from '../services/blocks';

	export let dialog: HTMLDialogElement;
	export let block: Block;
</script>

<dialog bind:this={dialog} class="dialog">
	{#if block}
		<div class="dialog__header">
			<span>Dráha {block.position}: </span>
			<span>{BlockStateLabel[block.state]}</span>
		</div>

		<div class="dialog__body">
			{#if block.name}
				<span class="dialog__name">{block.name}</span>
			{/if}
		</div>
	{/if}

	<div class="dialog__footer">
		<button class="dialog__close" on:click={() => dialog.close()}>Zavrieť</button>
	</div>
</dialog>

<style lang="postcss">
	.dialog {
		display: flex;
		flex-direction: column;
		gap: var(--size-2);

		border: none;
		border-radius: var(--size-2);
		box-shadow: var(--shadow-2);

		inline-size: 80%;
	}

	.dialog__header {
		font-size: var(--font-size-0);
		color: var(--gray-8);
	}

	.dialog__footer {
		text-align: right;
	}

	.dialog::backdrop {
		background-color: black;
		opacity: 0.3;
	}
</style>
