<template>
  <component
    :is="element"
    :class="style"
    class="transition-all duration-300 rounded shadow disabled:opacity-70 disabled:cursor-not-allowed block text-center"
  >
    <slot />
  </component>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    skin: { type: String, default: () => "primary" },
    outline: { type: Boolean, default: () => false },
    size: { type: String, default: () => "medium" },
    element: { type: String, default: () => "button" },
  },
  setup({ skin, outline, size }) {
    const skinStyle = outline
      ? {
          "border border-primary text-primary hover:bg-gray-600  hover:border-white  hover:text-white text-primary":
            skin == "primary",
          "border border-grey-lightest text-white hover:bg-gray-600  hover:border-white  hover:text-white":
            skin == "default",
          "border border-white text-white hover:bg-gray-600  hover:border-primary  hover:text-primary":
            skin == "white",
        }
      : {
          "bg-white hover:bg-black hover:text-white  text-black":
            skin == "white",
          "bg-grey hover:bg-white hover:text-black  text-white": skin == "dark",

          "bg-primary hover:bg-white text-black hover:text-grey":
            skin == "primary",
          "bg-green-500 hover:bg-green-700": skin == "success",
          "bg-amber-500 hover:bg-amber-700": skin == "warning",
          "bg-red-500 hover:bg-red-700": skin == "danger",
          "bg-blue-500 hover:bg-blue-700": skin == "info",
          "bg-gradient-to-t from-primary-lighter via-primary to-primary-darker text-black    hover:from-white hover:to-white hover:border-primary hover:text-grey":
            skin == "gradient",
        };
    const sizeSyle = {
      "py-1 px-2 text-xs": size == "small",
      "py-1.5 px-3": size == "medium",
      "py-2 px-4  ": size == "large",
    };
    return {
      style: { ...skinStyle, ...sizeSyle },
    };
  },
});
</script>