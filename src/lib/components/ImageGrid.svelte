<script>
	import { preventDefault } from 'svelte/legacy';
	import Lightbox from './Lightbox.svelte';
	import { fit, parent_style } from '@leveluptuts/svelte-fit';
	import { ASSET_URL } from '$lib/constants';

	let { images, captions = [], overlay = [] } = $props();
	let showLightbox = $state(new Array(images.length).fill(false));
	let parent = $state(null);

	const setViewbox = (node) => {
		$effect(() => {
			const bbox = node.querySelector('text').getBBox();
			/* Apply bounding box values to SVG element as viewBox */
			node.setAttribute('viewBox', [bbox.x, bbox.y, bbox.width, bbox.height].join(' '));
		});
	};
</script>

<div class="img-grid">
	{#each images as img, i}
		<figure class="img">
			<a
				href={`${ASSET_URL}${img.directus_files_id.id}`}
				onclick={(e) => {
					e.preventDefault();
					showLightbox[i] = !showLightbox[i];
				}}
				target="_blank"
			>
				<img
					src={`${ASSET_URL}${img.directus_files_id.id}?key=detail`}
					alt={img.directus_files_id.title}
				/>
				{#if overlay[i]}
					<div class="overlay" bind:this={parent}>
						<div class="inner" use:fit={{ min_size: 3, max_size: 30 }}>
							{@html overlay[i]}
						</div>
					</div>
				{/if}
			</a>
			{#if captions[i]}
				<figcaption>{@html captions[i]}</figcaption>
			{/if}
		</figure>
		<Lightbox
			img={`${ASSET_URL}${img.directus_files_id.id}`}
			alt={img.directus_files_id.title}
			on:exitLightbox={() => (showLightbox[i] = !showLightbox[i])}
			show={showLightbox[i]}
		/>
	{/each}
</div>

<style lang="scss">
	.img-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, 200px);
		grid-gap: 1em;
		justify-content: space-between;
		margin-top: 3em;
		@media (min-width: $medium) {
			grid-column: 2;
		}
		.img {
			a {
				display: grid;
				grid-template-columns: 1fr;
				grid-template-rows: 1fr;
				width: 200px;
				height: 200px;
				text-decoration: none;
				color: $dark-green;
				overflow: hidden;
				& > * {
					grid-column: 1;
					grid-row: 1;
				}
				img {
					opacity: 1;
					transition-property: opacity;
					transition-duration: 200ms;
					transition-timing-function: ease-in-out;
				}
				.overlay {
					opacity: 0;
					width: 200px;
					height: 200px;
					transition-property: opacity;
					transition-duration: 200ms;
					transition-timing-function: ease-in-out;

					.inner {
						width: 200px;
						height: 200px;
						:global(p) {
							margin: 0;
							font-size: inherit;
							font-family: $title-font;
							font-weight: normal;
						}
						:global(strong) {
							font-weight: normal;
						}
					}
				}
				&:hover {
					img {
						opacity: 0.1;
					}
					.overlay {
						opacity: 1;
						z-index: 9;
					}
				}
			}
			figcaption :global(a) {
				margin-bottom: unset;
			}
		}
	}
</style>
