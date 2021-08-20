import { register, init, getLocaleFromPathname, locale as $locale } from 'svelte-i18n';

const INIT_OPTIONS = {
    fallbackLocale: 'de',
    initialLocale: getLocaleFromPathname(/^\/([a-z]{2})/),
    //loadingDelay: 200,
    //formats: {},
    warnOnMissingMessages: true,
};

let currentLocale = null;

//register('en', () => import('./locales/en.json'));
register('de', () => import('./locales/de.json'));
/*register('fr', () => import('./locales/fr.json'));
register('it', () => import('./locales/it.json'));*/

$locale.subscribe((value) => {
    if (value == null) return;
    currentLocale = value;
});

// initialize the i18n library in client
export function startClient() {
    init({
        ...INIT_OPTIONS
    });
}

// init only for routes (urls with no extensions such as .js, .css, etc) and for service worker
const DOCUMENT_REGEX = /(^([^.?#@]+)?([?#](.+)?)?|service-worker.*?\.html)$/;

// initialize the i18n library in the server and returns its middleware
export function i18nMiddleware() {
    // initialLocale will be set by the middleware
    init(INIT_OPTIONS);

    return (req, res, next) => {
        const isDocument = DOCUMENT_REGEX.test(req.originalUrl);
        // get the initial locale only for a document request
        if (!isDocument) {
            next();
            return;
        }

        let locale = null;

        let lang = req.path.search(/\/[a-z]{2}\//);
        if (lang >= 0) {
            const pathLang = req.path.substring(lang+1,lang+3);
            if (pathLang.length > 1) {
                locale = pathLang;
            }
        } else {
            locale = INIT_OPTIONS.initialLocale || INIT_OPTIONS.fallbackLocale;
        }


        if (locale != null && locale !== currentLocale) {
            $locale.set(locale);
        }

        next();
    };
}