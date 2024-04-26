<template>
  <fieldset>
    <label class="block w-full tracking-wide text-white" :for="id">
      <div class="flex justify-between">
        <span v-show="!labelHidden"
          >{{ labelText }}
          <span class="text-primary" v-if="isRequired">&ast;</span></span
        >
        <!-- <span class="text-primary text-sm" v-if="description">{{
          description
        }}</span> -->
        <span v-if="description" class="text-white">
          <Tooltip :content="description"></Tooltip>
        </span>
      </div>
      <select
        :id="id"
        class="border shadow-inner w-full text-white bg-grey-dark rounded mt-1 py-3 px-4"
        :class="{
          ' border-red-500 ': errors.length,
          'border-grey-light': !errors.length,
          'text-white bg-grey-dark ': skin === 'dark',
          'text-grey-dark bg-white ': skin === 'light',
          'border-r-0 pr-0 rounded-r-none': $slots.postpend,
        }"
        :aria-label="labelText"
        :required="isRequired"
        :aria-required="isRequired"
        :aria-invalid="isInvalid"
        v-bind="describedBy"
        @blur="handleChange"
        @change="handleChange"
      >
        <option
          v-for="choice in choices"
          :key="choice.label"
          :value="choice.value"
          :selected="choice.value == model"
        >
          {{ choice.label }}
        </option>
      </select>
    </label>

    <base-alert
      v-if="errors.length"
      :id="`alert-${id}`"
      :messages="errors"
      role="alert"
      status="danger"
    >
    </base-alert>
  </fieldset>
</template>

<script lang="ts">
import BaseAlert from "@/components/BaseAlert.vue";
import Tooltip from "@/components/Tooltip.vue";
import { defineComponent, PropType, computed } from "vue";
interface Choice {
  label: string;
  value?: string | number;
}
export default defineComponent({
  components: {
    BaseAlert,
    Tooltip,
  },
  props: {
    choices: {
      type: Array as PropType<Choice[]>,
      default: () => [],
    },
    id: {
      type: String,
      default: () => "",
    },
    labelText: {
      type: String,
      default: () => "",
    },
    modelValue: {
      type: [String, Object] as PropType<string | Choice>,
      default: () => undefined,
    },
    description: {
      type: String,
      default: "",
    },
    errors: {
      type: Array,
      default: (): Array<unknown> => [],
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    isInvalid: {
      type: Boolean,
      default: false,
    },
    asVal: { type: Boolean, default: () => false },
    labelHidden: { type: Boolean, default: () => false },
    skin: { type: String, default: () => "dark" },
  },
  emits: { "update:modelValue": null },
  setup(props, { emit }) {
    const describedBy = computed(() => {
      return props.isInvalid ? { ariaDescribedby: `alert-${props.id}` } : {};
    });
    return {
      model:
        typeof props.modelValue == "string"
          ? props.modelValue
          : props.modelValue?.value,
      describedBy,
      handleChange(event: Event): void {
        const value = (event.target as HTMLSelectElement).value;
        if (value) {
          const selected = props.choices.find((choice: Choice) => {
            return choice.value == value;
          });
          if (props.asVal) {
            emit("update:modelValue", selected?.value);
          } else {
            emit("update:modelValue", selected);
          }
        }
      },
    };
  },
});
</script>
