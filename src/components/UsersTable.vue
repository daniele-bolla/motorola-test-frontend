<template>
  <base-table
    class="mb-8"
    :row-height="80"
    :row-data="rowData"
    :columnDefs="columnDefs"
    :page-size="100"
    ref="table"
  >
    <template #header>
      <div class="flex flex-col">
        <div
          class="flex flex-col md:flex-row md:justify-between md:items-end w-full"
        >
          <h1 class="md:text-3xl text-xl font-bold">
            Users
          </h1>
        </div>
      </div>
    </template>
  </base-table>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import rowData from '../data.json'
import BaseTable from "./BaseTable.vue";


export default defineComponent({
  components: {
    BaseTable,
  },

 setup() {

    return {
      columnDefs: [
        {
          headerName: "Country",
          field: "country",
        },
        {
          headerName: "Region",
          field: "region",
        },
        {
          headerName: "Name",
          field: "name",
        },
        {
          headerName: "Email",
          field: "email",
        },
      ],
      rowData,
    };
  },
});
</script>
