<script setup>
import { ref, computed } from 'vue';
import { Marked } from 'marked';
import { saveFileBrowser, copyTextToClipboard } from '../helpers/browser.ts';


const marked = new Marked({ gfm: true });

const props = defineProps({
  output: {
    type: Object,
    required: true
  }
});

function saveFile(content, type, fileName) {
  const fileAsBlob = new Blob([content], { type: type });
  saveFileBrowser(fileName, fileAsBlob);
}

const currentTab = ref('ddi-c');

const currentExport = computed(() => {
  const out = props.output || {};
  switch (currentTab.value) {
    case 'csv':
      return { content: out.csv || '', mime: 'text/csv', filename: (out.filename || 'export') + '.csv' };
    case 'ddi-l-3':
      return { content: out.ddil || '', mime: 'application/xml', filename: (out.filename || 'export') + '.ddi-lifecycle-3.3.xml' };
    case 'ddi-l-4':
      return { content: out.ddi40l || '', mime: 'application/json', filename: (out.filename || 'export') + '.ddi-ddi-lifecycle-4.0.json' };
    case 'ddi-cdi':
      return { content: out.ddiCdi || '', mime: 'application/json', filename: (out.filename || 'export') + '.ddi-cdi.json' };
    case 'markdown':
      return { content: out.markdown || '', mime: 'text/markdown', filename: (out.filename || 'export') + '.markdown.md' };
    case 'html':
      return { content: out.html || '', mime: 'text/html', filename: (out.filename || 'export') + '.html.html' };
    case 'ddi-c':
    default:
      return { content: out.ddic || '', mime: 'application/xml', filename: (out.filename || 'export') + '.ddi-codebook.2.6.xml' };
  }
});

function saveCurrent() {
  const cur = currentExport.value;
  if (!cur || !cur.content) return;
  saveFile(cur.content, cur.mime, cur.filename);
}

function copyCurrent() {
  const cur = currentExport.value;
  if (!cur || !cur.content) return;
  copyTextToClipboard(cur.content);
}
</script>

<template>
  <section id="debug">
    <ul class="nav nav-tabs" id="exportTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="csv-tab" data-bs-toggle="tab" data-bs-target="#csv-tab-pane" type="button"
          role="tab" aria-controls="csv-tab-pane" @click="currentTab = 'csv'"> csv (text/csv)</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="ddi-c-tab" data-bs-toggle="tab" data-bs-target="#ddi-c-tab-pane"
          type="button" role="tab" aria-controls="ddi-c-tab-pane" aria-selected="true" @click="currentTab = 'ddi-c'">
          ddi-c (xml)</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="ddi-l-3-tab" data-bs-toggle="tab" data-bs-target="#ddi-l-3-tab-pane" type="button"
          role="tab" aria-controls="ddi-l-3-tab-pane" @click="currentTab = 'ddi-l-3'"> ddi-l 3.3 (xml)</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="ddi-l-4-tab" data-bs-toggle="tab" data-bs-target="#ddi-l-4-tab-pane" type="button"
          role="tab" aria-controls="ddi-l-4-tab-pane" @click="currentTab = 'ddi-l-4'"> ddi-l 4.0 (json)</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="ddi-cdi-tab" data-bs-toggle="tab" data-bs-target="#ddi-cdi-tab-pane" type="button"
          role="tab" aria-controls="ddi-cdi-tab-pane" @click="currentTab = 'ddi-cdi'"> ddi-cdi (json)</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="markdown-tab" data-bs-toggle="tab" data-bs-target="#markdown-pane" type="button"
          role="tab" aria-controls="markdown-pane" @click="currentTab = 'markdown'"> markdown (md)</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="html-tab" data-bs-toggle="tab" data-bs-target="#html-pane" type="button"
          role="tab" aria-controls="html-pane" @click="currentTab = 'html'"> html (html)</button>
      </li>

      <li class="nav-item ms-auto" role="presentation">
        <button class="nav-link" type="button" title="Save current" @click.prevent="saveCurrent">💾</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" type="button" title="Copy current" @click.prevent="copyCurrent">📋</button>
      </li>
    </ul>

    <div class="tab-content exports">
      <div class="tab-pane fade" id="csv-tab-pane" role="tabpanel" aria-labelledby="csv-tab">
        <highlightjs :code="output.csv" language="csv" />
      </div>

      <div class="tab-pane fade show active" id="ddi-c-tab-pane" role="tabpanel" aria-labelledby="ddi-c-tab">
        <highlightjs :code="output.ddic" language="xml" />
      </div>

      <div class="tab-pane fade" id="ddi-l-3-tab-pane" role="tabpanel" aria-labelledby="ddi-l-3-tab">
        <highlightjs :code="output.ddil" language="xml" />
      </div>

      <div class="tab-pane fade" id="ddi-l-4-tab-pane" role="tabpanel" aria-labelledby="ddi-l-4-tab">
        <highlightjs :code="output.ddi40l" language="json" />
      </div>

      <div class="tab-pane fade" id="ddi-cdi-tab-pane" role="tabpanel" aria-labelledby="ddi-cdi-tab">
        <highlightjs :code="output.ddiCdi" language="json" />
      </div>

      <div class="tab-pane fade" id="markdown-pane" role="tabpanel" aria-labelledby="markdown-tab">
        <ul class="nav nav-pills mb-3 mt-3" id="md-content-tab" role="tablist">
          <li class="nav-item">
            <a class="nav-link active" id="md-preview-tab" data-bs-toggle="pill" href="#md-preview" role="tab"
              aria-controls="md-preview-home" aria-selected="true">Preview</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" id="md-code-tab" data-bs-toggle="pill" href="#md-code" role="tab"
              aria-controls="md-code" aria-selected="false">Code</a>
          </li>
        </ul>
        <div class="tab-content" id="pills-tabContent">
          <div class="tab-pane fade show active" id="md-preview" role="tabpanel" aria-labelledby="md-preview-tab">
            <!-- rendered markdown (html) -->
            <div v-html="marked.parse(output.markdown)"></div>
          </div>
          <div class="tab-pane fade" id="md-code" role="tabpanel" aria-labelledby="md-code-tab">
            <div>
              <!-- raw code for markdown -->
              <highlightjs :code="output.markdown" language="md" />
            </div>
          </div>
        </div>
      </div>

      <div class="tab-pane fade" id="html-pane" role="tabpanel" aria-labelledby="html-tab">
        <ul class="nav nav-pills mb-3 mt-3" id="html-content-tab" role="tablist">
          <li class="nav-item">
            <a class="nav-link active" id="html-preview-tab" data-bs-toggle="pill" href="#html-preview" role="tab"
              aria-controls="md-preview-home" aria-selected="true">Preview</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" id="html-code-tab" data-bs-toggle="pill" href="#html-code" role="tab"
              aria-controls="md-code" aria-selected="false">Code</a>
          </li>
        </ul>
        <div class="tab-content" id="pills-tabContent">
          <div class="tab-pane fade show active" id="html-preview" role="tabpanel" aria-labelledby="html-preview-tab">
            <!-- rendered html -->
            <div v-html="marked.parse(output.html)"></div>
          </div>
          <div class="tab-pane fade" id="html-code" role="tabpanel" aria-labelledby="html-code-tab">
            <div>
              <!-- raw code for html -->
              <highlightjs :code="output.html" language="html" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
