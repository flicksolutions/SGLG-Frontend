import { register, init, getLocaleFromPathname } from 'svelte-i18n';

register('en', () => import('./locales/en.json'));
register('de', () => import('./locales/de.json'));
register('fr', () => import('./locales/fr.json'));
register('it', () => import('./locales/it.json'));

init({
    fallbackLocale: 'de',
    initialLocale: getLocaleFromPathname(/^\/([a-z]{2})/),
});