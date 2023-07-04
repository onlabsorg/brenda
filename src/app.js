import {ref} from 'vue';

import store from './store';

import DOMPurify from 'dompurify';
const DOMPURIFY_OPTIONS = {
    ADD_TAGS: ['style', 'polyline']
}

import template from '@/app.html?raw';

import './app.css';

import {
    VApp,
    VAppBar, VAppBarTitle, VAppBarNavIcon,
    VNavigationDrawer,
    VList, VListItem,
    VMain,
    VContainer
} from 'vuetify/components';

export default {

    template: template,

    components: {
        VApp,
        VAppBar, VAppBarTitle, VAppBarNavIcon,
        VNavigationDrawer,
        VList, VListItem,
        VMain,
        VContainer
    },

    setup () {

        const path = ref("");

        const saneHTML = ref(`<p>Loading document ...</p>`);

        const title = ref("Brendy");

        const drawer = ref(false);

        const toc = ref([]);
        store.evaluateDocument('home://__toc__').then(tocNS => {
            toc.value = tocNS.items || [];
        });

        const refresh = async () => {
            const docId = location.hash ? location.hash.slice(1) : "/";
            path.value = store.normalizePath(docId);
            const doc = await store.loadDocument(path.value);
            const context = doc.createContext();
            const docNS = await doc.evaluate(context);
            title.value = docNS.title || path.value;
            const html = await context.str(docNS);
            saneHTML.value = DOMPurify.sanitize(html, DOMPURIFY_OPTIONS);
        }

        window.addEventListener('hashchange', refresh);

        refresh();

        return {path, title, drawer, toc, saneHTML};
    },
}


function parseHash () {
}
