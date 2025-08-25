<script setup>
import { computed } from 'vue';
import { saveFileBrowser, copyTextToClipboard } from '../helpers/browser.ts';

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
</script>

<template>
  <section id="debug">
    <ul class="nav nav-tabs" id="exportTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="csv-tab" data-bs-toggle="tab" data-bs-target="#csv-tab-pane" type="button" role="tab" aria-controls="csv-tab-pane"> csv (text/csv)</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="ddi-c-tab" data-bs-toggle="tab" data-bs-target="#ddi-c-tab-pane" type="button" role="tab" aria-controls="ddi-c-tab-pane" aria-selected="true"> ddi-c (xml)</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="ddi-l-3-tab" data-bs-toggle="tab" data-bs-target="#ddi-l-3-tab-pane" type="button" role="tab" aria-controls="ddi-l-3-tab-pane"> ddi-l 3.3 (xml)</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="ddi-l-4-tab" data-bs-toggle="tab" data-bs-target="#ddi-l-4-tab-pane" type="button" role="tab" aria-controls="ddi-l-4-tab-pane"> ddi-l 4.0 (json)</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="ddi-cdi-tab" data-bs-toggle="tab" data-bs-target="#ddi-cdi-tab-pane" type="button" role="tab" aria-controls="ddi-cdi-tab-pane"> ddi-cdi (json)</button>
      </li>
    </ul>

    <div class="tab-content exports">
      <div class="tab-pane fade" id="csv-tab-pane" role="tabpanel" aria-labelledby="csv-tab" tabindex="0">
        <div class="more">
          <button class="btn btn-outline-primary" @click="saveFile(output.csv, 'text/csv', output.filename + '.csv')">💾save</button>
          <button class="btn btn-outline-primary" @click="copyTextToClipboard(output.csv)">📋copy</button>
        </div>
        <highlightjs :code="output.csv" language="csv"/>
      </div>

      <div class="tab-pane fade show active" id="ddi-c-tab-pane" role="tabpanel" aria-labelledby="ddi-c-tab" tabindex="1">
        <div class="more">
          <button class="btn btn-outline-primary" @click="saveFile(output.ddic, 'application/xml', output.filename + '.ddi-c.xml')">💾save</button>
          <button class="btn btn-outline-primary" @click="copyTextToClipboard(output.ddic)">📋copy</button>
        </div>
        <highlightjs :code="output.ddic" language="xml"/>
      </div>

      <div class="tab-pane fade" id="ddi-l-3-tab-pane" role="tabpanel" aria-labelledby="ddi-l-3-tab" tabindex="2">
        <div class="more">
          <button class="btn btn-outline-primary" @click="saveFile(output.ddil, 'application/xml', output.filename + '.ddi-l-3.3.xml')">💾save</button>
          <button class="btn btn-outline-primary" @click="copyTextToClipboard(output.ddil)">📋copy</button>
        </div>
        <highlightjs :code="output.ddil" language="xml"/>
      </div>

      <div class="tab-pane fade" id="ddi-l-4-tab-pane" role="tabpanel" aria-labelledby="ddi-l-4-tab" tabindex="2">
        <div class="more">
          <button class="btn btn-outline-primary" @click="saveFile(output.ddi40l, 'application/json', output.filename + '.ddi-l-4.0.json')">💾save</button>
          <button class="btn btn-outline-primary" @click="copyTextToClipboard(output.ddi40l)">📋copy</button>
        </div>
        <highlightjs :code="output.ddi40l" language="json"/>
      </div>

      <div class="tab-pane fade" id="ddi-cdi-tab-pane" role="tabpanel" aria-labelledby="ddi-cdi-tab" tabindex="2">
        <div class="more">
          <button class="btn btn-outline-primary" @click="saveFile(output.ddiCdi, 'application/json', output.filename + '.ddi-cdi.json')">💾save</button>
          <button class="btn btn-outline-primary" @click="copyTextToClipboard(output.ddiCdi)">📋copy</button>
        </div>
        <highlightjs :code="output.ddiCdi" language="json"/>
      </div>
    </div>
  </section>
</template>
