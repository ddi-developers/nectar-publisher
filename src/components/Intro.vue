<script setup>
const emit = defineEmits(['import-data'])

const spreadsheetExample = `${import.meta.env.BASE_URL}images/intro/spreadsheet-example.png`
</script>

<template>
  <div class="container py-4 py-lg-5">
    <div class="card border-0 bg-body-tertiary shadow-sm">
      <div class="card-body p-4 p-lg-5">
        <div class="row g-4 g-lg-5 align-items-center">
          <div class="col-lg-5">
            <strong class="text-uppercase display-9 fw-semibold mb-3">Welcome to Nectar Publisher</strong>
            <p class="lead">
              Start by importing a CSV, TSV, SPSS (.sav), Stata (.dta), SAS (.sas7bdat), or spreadsheet (XLS, XLSX, or ODS) file.
            </p>
            <p class="mb-4">
              For spreadsheets, put the variable headings in the first row. Each following row should contain one observation.
              Use the example to the right as a guide.
            </p>
            <button type="button" class="btn btn-primary" @click="emit('import-data')">
              Import data
            </button>
          </div>
          <div class="col-lg-7">
            <figure class="mb-0">
              <img
                :src="spreadsheetExample"
                class="img-fluid rounded border bg-white"
                alt="Example spreadsheet with variable headings in the first row and observations in the rows below">
              <figcaption class="small text-body-secondary mt-2">
                Good example: headings in the first row, with one observation per row.
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
