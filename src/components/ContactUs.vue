<template>
  <div
    class="md:p-10 py-10 px-2 flex flex-col justify-between bg-primary rounded-md mb-12 subscribe-bg"
  >
    <div class="text-grey mb-4 lg:mb-0 lg:w-2/2 mr-4 lg:text-left">
      <h3 class="text-3xl font-bold">Contact Us</h3>
      <h4 class="text-lg">
        Can’t find your question? Please let us know by using this form.
      </h4>
    </div>

    <div class="grid grid-cols-2 gap-6 mt-12">
      <base-input
        skin="light"
        class="md:col-span-1 col-span-full"
        id="name"
        v-model="formData.name"
        label-text="Name"
        type="text"
        :is-required="'required' in v$.name"
        :is-invalid="v$.name?.$dirty && v$.name.$invalid"
        :errors="formatVuelidateErrors(v$.name.$errors)"
      ></base-input>

      <base-input
        class="md:col-span-1 col-span-full"
        skin="light"
        id="company"
        v-model="formData.company"
        label-text="Company"
        type="text"
        :is-required="'required' in v$.company"
        :is-invalid="v$.company?.$dirty && v$.company.$invalid"
        :errors="formatVuelidateErrors(v$.company.$errors)"
      ></base-input>

      <base-input
        class="md:col-span-1 col-span-full"
        skin="light"
        id="email"
        v-model="formData.email"
        label-text="Email"
        type="text"
        :is-required="'required' in v$.email"
        :is-invalid="v$.email?.$dirty && v$.email.$invalid"
        :errors="formatVuelidateErrors(v$.email.$errors)"
      ></base-input>

      <base-input
        class="md:col-span-1 col-span-full"
        skin="light"
        id="subject"
        v-model="formData.subject"
        label-text="Subject"
        type="text"
        :is-required="'required' in v$.subject"
        :is-invalid="v$.subject?.$dirty && v$.subject.$invalid"
        :errors="formatVuelidateErrors(v$.subject.$errors)"
      ></base-input>

      <base-text-area
        class="col-span-full"
        skin="light"
        id="message"
        v-model="formData.message"
        label-text="Message"
        type="text"
        :is-required="'required' in v$.message"
        :is-invalid="v$.message?.$dirty && v$.message.$invalid"
        :errors="formatVuelidateErrors(v$.message.$errors)"
      ></base-text-area>

      <base-checkbox
        class="col-span-full"
        id="acceptPrivacy"
        skin="light"
        v-model="formData.acceptPrivacy"
        :is-required="'required' in v$.acceptPrivacy"
        :is-invalid="v$.acceptPrivacy?.$dirty && v$.acceptPrivacy.$invalid"
        :errors="formatVuelidateErrors(v$.acceptPrivacy.$errors)"
      >
        <template #label>
          I understand and agree to the processing of my personal data in
          accordance with the
          <router-link
            :to="{ path: '/privacy' }"
            target="_blank"
            class="hover:underline text-white"
            >Privacy Policy</router-link
          >
        </template>
      </base-checkbox>
      <base-checkbox
        class="col-span-full"
        id="acceptNewsletter"
        skin="light"
        v-model="formData.acceptNewsletter"
        :is-required="'required' in v$.acceptNewsletter"
        :is-invalid="
          v$.acceptNewsletter?.$dirty && v$.acceptNewsletter.$invalid
        "
        :errors="formatVuelidateErrors(v$.acceptNewsletter.$errors)"
      >
        I would like to receive occasional marketing communications from Peerkat
        <!-- <template #label>
          I understand and agree with with the
          <a href="/terms" target="_blank" class="hover:underline text-white"
            >Terms of Use</a
          >
          (including the content standards)
        </template> -->
      </base-checkbox>

      <div class="col-span-full flex mt-4">
        <async-button
          size="large"
          skin="dark"
          :on-click="submit"
          class="ml-auto w-full"
          >Submit</async-button
        >
      </div>
      <base-dialog
        :show="showSuccess"
        title="Success"
        @close="showSuccess = false"
      >
        <template #body>
          <p>
            Thank you for contacting us, a member of our team will contact you
            as soon as possible.
          </p>
        </template>
        <template #footer>
          <base-button class="ml-2 w-full" @click="showSuccess = false">
            OK
          </base-button>
        </template>
      </base-dialog>
    </div>
  </div>
</template>
<script lang="ts">
import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseSelect from "@/components/BaseSelect.vue";
import BaseCheckbox from "@/components/BaseCheckbox.vue";
import BaseTextArea from "@/components/BaseTextArea.vue";
import AsyncButton from "@/components/AsyncButton.vue";
import BackLink from "@/components/BackLink.vue";
import BaseDialog from "@/components/BaseDialog.vue";

import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  toRaw,
} from "vue";
import { isRequired, isEmail } from "../utils/validators";
import useValidator from "../composables/useValidator";
import { useReCaptcha } from "vue-recaptcha-v3";
import { helpers, sameAs } from "@vuelidate/validators";

const lambdaUrl = import.meta.env.VITE_WORK_WITH_US_LAMBDA;
const sendEmail = async (data: any) => {
  let p = await fetch(lambdaUrl, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  let response = await p.json();
  return response;
};

export default defineComponent({
  components: {
    BaseCard,
    BaseButton,
    BaseInput,
    BaseSelect,
    BaseTextArea,
    BackLink,
    AsyncButton,
    BaseCheckbox,
    BaseDialog,
  },
  async setup() {
    const showError = ref(false);
    const showSuccess = ref(false);
    const errorMessage = ref<string>("");
    const inputsData = reactive({
      name: "",
      company: "",
      subject: "",
      email: "",
      message: "",
      acceptTerms: null,
      acceptNewsletter: null,
      acceptPrivacy: null,
    });

    const rules: Record<string, any> = computed(() => ({
      name: {},
      company: {},
      subject: {},
      message: { required: isRequired },
      email: { required: isRequired, email: isEmail },
      acceptTerms: {},
      acceptNewsletter: {},
      acceptPrivacy: {
        checked: helpers.withMessage(
          "Please confirm in order to proceed",
          sameAs(true)
        ),
      },
    }));
    const validator = useValidator(inputsData, rules);
    const { v$, formatVuelidateErrors, validate } = validator;
    const formData = validator.formData as any;
    let recaptchaInstance = useReCaptcha();
    const reCaptchaIn = recaptchaInstance?.instance;

    onMounted(() => {
      reCaptchaIn && reCaptchaIn.value && reCaptchaIn.value.showBadge();
    });
    onBeforeUnmount(() => {
      reCaptchaIn && reCaptchaIn.value && reCaptchaIn.value.hideBadge();
    });
    const recaptcha = async () => {
      await recaptchaInstance?.recaptchaLoaded();
      const token = await recaptchaInstance?.executeRecaptcha("login");
      return token;
    };
    return {
      formData,
      showSuccess,
      showError,
      errorMessage,
      v$,
      formatVuelidateErrors,
      async submit() {
        const isValid = await validate();
        const token = await recaptcha();
        if (isValid) {
          try {
            const data = {
              formData: {
                ...toRaw(formData),
                source: "Support page - Contact Us",
              },
            };
            await sendEmail(data);
            showSuccess.value = true;
          } catch (error) {
            console.error(error);
          }
        }
      },
    };
  },
});
</script>
<style scoped>
.subscribe-bg {
  background-image: url("/subscribe-bg.png");
  background-repeat: no-repeat;
  background-size: 40% 100%;
  background-position: right center;
}
</style>

