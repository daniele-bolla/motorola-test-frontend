<template>
  <base-table
    class="mb-8 bg-grey-lighter "
    :row-height="60"
    :row-data="rowData"
    :columnDefs="columnDefs"
    :page-size="10"
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
  <form>
    <div class="grid grid-cols-2 gap-6 mt-12">
      <base-input
        class="md:col-span-1 col-span-full"
        id="name"
        v-model="formData.data.name"
        label-text="Name"
        placeholder="name"
        type="text"
      ></base-input>



      <base-input
        class="md:col-span-1 col-span-full"
        id="email"
        v-model="formData.data.email"
        label-text="email"
        placeholder="email"
        type="email"
      ></base-input>


      <base-input
        class="md:col-span-1 col-span-full"
        id="country"
        v-model="formData.data.country"
        label-text="country"
        placeholder="country"
        type="country"
      ></base-input>

      <base-input
        class="md:col-span-1 col-span-full"
        id="region"
        v-model="formData.data.region"
        label-text="region"
        placeholder="region"
        type="region"
      ></base-input>

      <div class="col-span-full flex mt-4">
        <base-button
          size="large"
          skin="dark"
          @click.prevent="submit"
          class="ml-auto w-full"
          >Submit</base-button
        >
      </div>

    </div>  
  </form>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  toRaw,
} from "vue";
import data from '../data.json'
import BaseTable from "@/components/BaseTable.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseInput from "@/components/BaseInput.vue";


export default defineComponent({
  components: {
    BaseTable,
    BaseButton,
    BaseInput,
  },

 setup() {
  const rowData = ref(data)
    const formData = reactive({data:{
      email:"",
      name:"",
      country:"",
      region:""
    }});
    function clearForm(){
      formData.data = {
        email:"",
        name:"",
        country:"",
        region:""
      };
    }
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
      formData,
      submit (){
        console.log(toRaw(formData.data))
        rowData.value = [...rowData.value,toRaw(formData.data)];
        clearForm()
      }

    };
  },
});
</script>
