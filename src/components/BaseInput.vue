<template>
  <fieldset>
    <label
      :class="{
        'text-white': skin === 'dark',
        'text-grey-dark': skin === 'light',
      }"
      class="block w-full tracking-wide"
      :for="id"
    >
      <div class="flex justify-between">
        <span
          :class="{
            'text-white': skin === 'dark',
            'text-grey-dark': skin === 'light',
          }"
          v-show="!labelHidden"
          >{{ labelText }}
          <span
            :class="{
              'text-primary': skin === 'dark',
              'text-grey-dark': skin === 'light',
            }"
            v-if="isRequired"
            >&ast;</span
          ></span
        >
         <span class="text-primary text-sm" v-if="description">{{
          description
        }}</span> 
      </div>
      <div class="flex w-full mt-2 mb-3">
        <input
          :id="id"
          class="border shadow-inner flex-1 rounded mt-1 py-3 px-4"
          :class="{

            'text-white bg-grey-darker ': skin === 'dark',
            'text-grey-dark bg-white ': skin === 'light',
            'border-r-0 pr-0 rounded-r-none': $slots.postpend,
          }"
          :value="modelValue"
          :type="type"
          :aria-label="labelText"
          :required="isRequired"
          :aria-required="isRequired"
          :aria-invalid="isInvalid"
          v-bind="describedBy"
          @input="handleChange"
        />
        <slot name="postpend"></slot>
      </div>
    </label>


  </fieldset>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

const getValue = (event: Event): string | number | undefined => {
  const value =
    (event.target as HTMLInputElement).type == "number"
      ? Number((event.target as HTMLInputElement).value)
      : String((event.target as HTMLInputElement).value);
  return value;
};

export default defineComponent({

  props: {
    id: {
      type: String,
      required: true,
    },
    labelText: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    modelValue: {
      type: [Number, String],
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    isInvalid: {
      type: Boolean,
      default: false,
    },
    labelHidden: { type: Boolean, default: () => false },
    skin: { type: String, default: () => "light" },
  },
  emits: { "update:modelValue": null },
  setup(props, { emit }) {
    const describedBy = computed(() => {
      return props.isInvalid ? { ariaDescribedby: `alert-${props.id}` } : {};
    });
    return {
      describedBy,
      handleChange(event: Event): void {
        const value = getValue(event);
        emit("update:modelValue", value);
      },
    };
  },
});
</script>
