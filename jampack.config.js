export default {
	image: {
		embed_size: 1500,
		srcset_min_width: 390 * 2, // HiDPI phone
		srcset_max_width: 1920 * 2, // 4K
		srcset_step: 300,
		max_width: 1920 * 2,
		external: {
			process: 'download'
		},
		compress: true,
		svg: {
			optimization: true,
			add_width_and_height: false
		}
	},
	iframe: {
		lazyload: {
			when: 'below-the-fold',
			how: 'native'
		}
	},
	misc: {
		prefetch_links: 'off'
	}
};
