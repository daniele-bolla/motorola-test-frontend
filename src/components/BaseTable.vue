<template>
  <div class="rounded border border-grey">
    <div
      class="md:px-12 md:py-10 px-8 py-6 flex flex-col lg:flex-row justify-between md:items-center"
    >
      <div class="flex justify-between w-full">
        <slot name="header"></slot>
        <div v-if="searchbar" class="md:w-96 mt-4 lg:mt-0">
          <form class="max-w-md mx-auto ">   
          <label for="search" class="mb-2 text-sm font-medium text-grey sr-only ">Search</label>
          <input        
            type="search"
            id="search"
            placeholder="Search by email or name"
            v-on:input="onFilterTextBoxChanged($event)" 
            class="block w-full p-4 ps-10 text-sm text-grey border border-grey rounded-lg "   />
          </form>
        </div>
      </div>
    </div>

    <div class="w-full overflow-hidden shadow-lg">
      <div class="w-full overflow-auto base-table">
        <ag-grid-vue
          class="w-full aommit a-theme-alpine"
          :columnDefs="columnDefs"
          :rowData="rowData"
          :gridOptions="gridOptions"
          :defaultColDef="defaultColDef"
          pagination="true"
          domLayout="autoHeight"
          @first-data-rendered="onFirstDataRendered"
          :suppressPaginationPanel="true"
          :paginationPageSize="paginationPageSize"
          :cacheQuickFilter="true"
          @pinned-row-data-changed="onPinnedRowDataChanged"
          @pagination-changed="onPaginationChanged"
          ref="table"
        >
        </ag-grid-vue>
      </div>
    </div>
  </div>
  <nav
    v-if="totalPages > 0"
    class="flex w-full justify-center items-center space-x-1 mt-2"
  >
    <button
      class="px-3 py-1 text-grey text-sm font-semibold rounded-md hover:bg-white hover:text-grey"
      @click.prevent="first"
      v-if="currentPage > 0"
    >
      First
    </button>
    <button
      v-if="currentPage - 1 > 0"
      class="px-3 py-1 text-grey text-sm font-semibold rounded-md hover:bg-white hover:text-grey"
      @click.prevent="goToPage(currentPage - 2)"
    >
      {{ currentPageLabel - 2 }}
    </button>
    <button
      v-if="currentPage > 0"
      class="px-3 py-1 text-grey text-sm font-semibold rounded-md hover:bg-white hover:text-grey"
      @click.prevent="goToPage(currentPage - 1)"
    >
      {{ currentPageLabel - 1 }}
    </button>
    <button
      disabled="true"
      class="px-3 py-1 text-sm font-semibold rounded-md bg-white text-grey"
    >
      {{ currentPageLabel }}
    </button>
    <button
      v-if="currentPage + 1 <= totalPages"
      class="px-3 py-1 text-grey text-sm font-semibold rounded-md hover:bg-white hover:text-grey"
      @click.prevent="goToPage(currentPage + 1)"
    >
      {{ currentPageLabel + 1 }}
    </button>
    <button
      v-if="currentPage + 2 <= totalPages"
      class="px-3 py-1 text-grey text-sm font-semibold rounded-md hover:bg-white hover:text-grey"
      @click.prevent="goToPage(currentPage + 2)"
    >
      {{ currentPageLabel + 2 }}
    </button>
    <button
      class="px-3 py-1 text-grey font-bold rounded-md hover:bg-white hover:text-grey"
      @click.prevent="last"
      v-if="currentPage <= totalPages"
    >
      Last
    </button>
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent, ref, onMounted, onUnmounted } from "vue";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional Theme applied to the grid
import { AgGridVue } from "ag-grid-vue3";
function lastRowBorder(params: any): any {
  if (params.node.rowIndex == params.api.rowModel.rowsToDisplay.length - 1) {
    return { "border-bottom": "none" };
  } else {
    return {};
  }
}

export default defineComponent({
  components: {
    AgGridVue,
  },
  props: {
    searchbar: {
      type: Boolean,
      default: true,
    },
    rowData: {
      type: Array,
      required: true,
    },
    columnDefs: {
      type: Array,
      required: true,
    },
    rowHeight: {
      type: Number,
      default: 80,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
  },
  emits: ["ready", "paginationChanged"],
  setup(props, { emit }) {
    const gridOptions = {
      rowHeight: Number(props.rowHeight),
      headerHeight: 100,
      getRowStyle: lastRowBorder,
    };
    const currentPage = ref(0);
    const table = ref<HTMLElement | null>(null);
    const currentPageLabel = computed(() => currentPage.value + 1);
    const rowData = computed(() => props.rowData);
    const columnDefs = props.columnDefs;
    const gridApi = ref<any>(null);
    const columnApi = ref<any>(null);
    const totalPages = ref(0);
    const paginationPageSize = props.pageSize;
    const defaultColDef = {
      sortable: true,
      lockVisible: true,
      suppressMovable: true,
      resizable: true,
      width: 100,
      icons: {
        sortAscending: "&nbsp; &#8593;",
        sortDescending: "&nbsp; &#8595;",
      },
    };

    function goToPage(page: number) {
      gridApi.value && gridApi.value.paginationGoToPage(page);
    }

    function onResize() {
      gridApi.value.sizeColumnsToFit();
      const colsWidth = gridApi.value.gridOptionsWrapper.eGridDiv
        .querySelector(".ag-header-container")
        .getBoundingClientRect().width;
      const wrapperWidth =
        gridApi.value.gridOptionsWrapper.eGridDiv.getBoundingClientRect().width;
      if (colsWidth < wrapperWidth) {
        gridApi.value && gridApi.value.sizeColumnsToFit();
      }
    }
    const onPinnedRowDataChanged = (params: any) => {
      const { api } = params;
      const bottomPinnedRowCount = api.getPinnedBottomRowCount();

      let height = 0;
      for (let i = 0; i < bottomPinnedRowCount; i++) {
        const currentRow = api.getPinnedBottomRow(i);

        if (currentRow) {
          height += currentRow.rowHeight;
        }
      }

      if (height != 0) {
        var html = document.querySelector(
          ".ag-scrollbar-invisible"
        ) as HTMLHtmlElement;
        if (html) {
          html.style.bottom = `${height}px`;
        }
      }
    };
    const onGridReady = (params: any) => {
      gridApi.value = params.api;
      columnApi.value = params.columnApi;
      totalPages.value = gridApi.value.paginationGetTotalPages() - 1;
      emit("ready", params);
    };
    const onFirstDataRendered = (params: any) => {
      gridApi.value = params.api;
      columnApi.value = params.columnApi;
      totalPages.value = gridApi.value.paginationGetTotalPages() - 1;
      onResize();
      emit("ready", params);
    };

    onMounted(() => {
      window.addEventListener("resize", onResize);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", onResize);
    });
    return {
      onGridReady,
      onFirstDataRendered,
      onPinnedRowDataChanged,
      totalPages,
      paginationPageSize,
      gridApi,
      columnApi,
      defaultColDef,
      next() {
        goToPage(currentPage.value + 1);
      },
      prev() {
        goToPage(currentPage.value - 1);
      },
      last() {
        if (gridApi.value) {
          gridApi.value.paginationGoToLastPage();
        }
      },
      first() {
        if (gridApi.value) {
          gridApi.value.paginationGoToFirstPage();
        }
      },
      goToPage,

      onFilterTextBoxChanged(e: any) {
        const search = e.target.value;
        gridApi.value.setQuickFilter(search);
      },
      onPaginationChanged(event: any) {
        if (gridApi.value) {
          currentPage.value = gridApi.value.paginationGetCurrentPage();
          emit("paginationChanged", event);
        }
      },
      currentPage,
      currentPageLabel,
      gridOptions,
      // eslint-disable-next-line vue/no-dupe-keys
      columnDefs,
      // eslint-disable-next-line vue/no-dupe-keys
      rowData,
      table,
    };
  },
});
</script>
<style >
body div .base-table .ag-header {
  @apply font-semibold tracking-wide text-left bg-grey-light text-white;
}
body div .base-table .ag-header-cell-text {
  @apply md:px-12 md:py-4 px-4 py-2;
}
body div .base-table .ag-row {
  @apply border-grey-light border-b-2 h-96;
}

body div .base-table .ag-cell {
  @apply md:pl-12 md:py-4 pl-4 py-2 flex items-center;
}
body div .base-table .ag-cell-text {
  @apply md:pl-12 md:py-4 pl-4 py-2  flex items-center;
}
body div .base-table .ag-header-icon {
  @apply font-bold mr-1 pr-1;
}
.ag-body-horizontal-scroll {
  @apply h-2;
}
.ag-body-horizontal-scroll-viewport::-webkit-scrollbar {
  @apply bg-grey rounded-none;
}

.ag-body-horizontal-scroll-viewport::-webkit-scrollbar-track {
  @apply bg-grey rounded-none;
}

.ag-body-horizontal-scroll-viewport::-webkit-scrollbar-thumb {
  @apply bg-grey-lighter border-none;
}

.ag-body-horizontal-scroll.ag-scrollbar-invisible {
  pointer-events: all !important;
}
body div .base-table .ag-horizontal-left-spacer {
  overflow-x: auto;
}
</style>