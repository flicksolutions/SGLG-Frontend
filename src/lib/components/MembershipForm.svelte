<script>
	import { m } from '$lib/paraglide/messages';
	import { PUBLIC_MEMBERSHIP_FORM_ENDPOINT } from '$env/static/public';

	const ENDPOINT = PUBLIC_MEMBERSHIP_FORM_ENDPOINT;

	/** @type {'idle' | 'sending' | 'success' | 'error'} */
	let status = $state('idle');
	let member = $state('Einzel');
	let isIndividual = $derived(member === 'Einzel');

	/** @param {SubmitEvent & { currentTarget: HTMLFormElement }} event */
	async function handleSubmit(event) {
		event.preventDefault();
		status = 'sending';
		try {
			const response = await fetch(ENDPOINT, {
				method: 'POST',
				headers: { Accept: 'application/json' },
				body: new FormData(event.currentTarget)
			});
			status = response.ok ? 'success' : 'error';
		} catch {
			status = 'error';
		}
	}
</script>

{#if status === 'success'}
	<p class="feedback" role="status">{m.membership_success()}</p>
{:else}
	<form action={ENDPOINT} method="POST" onsubmit={handleSubmit}>
		<p>
			<label>
				<input name="member" type="radio" value="Einzel" bind:group={member} />
				{m.membership_individual()}
			</label>
			<label>
				<input name="member" type="radio" value="Kollektiv" bind:group={member} />
				{m.membership_collective()}
			</label>
		</p>
		<p>
			<input
				name="institution"
				type="text"
				placeholder={m.membership_institution()}
				aria-label={m.membership_institution()}
				required={!isIndividual}
			/>
			<input
				name="name"
				type="text"
				placeholder={m.membership_last_name()}
				aria-label={m.membership_last_name()}
				required={isIndividual}
			/>
			<input
				name="vorname"
				type="text"
				placeholder={m.membership_first_name()}
				aria-label={m.membership_first_name()}
				required={isIndividual}
			/>
			<input
				name="email"
				type="email"
				placeholder={m.membership_email()}
				aria-label={m.membership_email()}
				required
			/>
			<input
				name="plz"
				type="number"
				min="1000"
				max="9999"
				placeholder={m.membership_postal_code()}
				aria-label={m.membership_postal_code()}
			/>
			<input
				name="adresse"
				type="text"
				placeholder={m.membership_address()}
				aria-label={m.membership_address()}
			/>
			<input
				name="ort"
				type="text"
				placeholder={m.membership_city()}
				aria-label={m.membership_city()}
			/>
			<input
				class="button"
				type="submit"
				value={status === 'sending' ? m.membership_sending() : m.membership_send()}
				disabled={status === 'sending'}
			/>
		</p>
		<input name="_gotcha" type="hidden" />
	</form>
	{#if status === 'error'}
		<p class="feedback error" role="alert">{m.membership_error()}</p>
	{/if}
{/if}

<style lang="scss">
	.feedback {
		padding-left: 0.8em;
		border-left: solid 4px $dark-green;
		&.error {
			border-left-color: $sglg-orange;
		}
	}
</style>
