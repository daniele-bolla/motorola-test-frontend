import { ethers } from "ethers";
import { i18n } from "../i18n"
import {
  required,
  email,
  sameAs,
  maxLength,
  minLength,
  helpers,
  url
} from "@vuelidate/validators";
import { createI18nMessage } from '@vuelidate/validators'

const { t } = i18n.global || i18n;
const withI18nMessage = createI18nMessage({ t });

// export const isRequired = withI18nMessage(required)
// export const isEmail = withI18nMessage(email)
export const isRequired = required;
export const isEmail = email;
export const isUrl = url;

// export const isMaxLength = (value: number) => withI18nMessage(maxLength(value))
// export const isMinLength = (value: number) => withI18nMessage(minLength(value))
export const isMaxLength = (value: number) => maxLength(value);
export const isMinLength = (value: number) => minLength(value);
function validateAddress(value: any): boolean {
  return ethers.utils.isAddress(value);
}
export const isValidAddress = helpers.withMessage(
  t("Not a Valid address"),
  validateAddress,
);

const contain2Numerics = helpers.regex(/(?=(.*\d){2})/);
export const isAtLeast2Numerics = helpers.withMessage(
  t("Must contains at least 2 numbers"),
  contain2Numerics,
);

export const isSameAs = (refInput: string) => helpers.withMessage(
  t("The password should match"),
  sameAs(refInput)
)


const checked = (value: boolean) => value == true


export const isChecked = (value: boolean) => helpers.withMessage('This field cannot be empty', sameAs(true))
