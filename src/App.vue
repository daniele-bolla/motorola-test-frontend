<script setup lang="ts">
import UsersTable from './components/UsersTable.vue'
</script>

<template>
  <div class="flex flex-col h-full">
    <main class="flex-1 container mx-auto flex items-center justify-center">
      <div class="rounded-lg panel-shadow bg-white-dark max-w-[960px] w-full m-6  p-9">
        <UsersTable />
      </div>
    </main>
  </div>

</template>
