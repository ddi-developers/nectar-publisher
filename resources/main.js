import { createApp } from 'vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import 'highlight.js/styles/github.css'
import hljs from 'highlight.js/lib/core';
import xmlhiglight from 'highlight.js/lib/languages/xml';
import rhiglight from 'highlight.js/lib/languages/r';
import jsonhiglight from 'highlight.js/lib/languages/json';
import hljsVuePlugin from "@highlightjs/vue-plugin";
import App from './App.vue'

hljs.registerLanguage('xml', xmlhiglight);
hljs.registerLanguage('csv', rhiglight)
hljs.registerLanguage('json', jsonhiglight);

createApp(App)
    .use(hljsVuePlugin)
    .mount("#app")
