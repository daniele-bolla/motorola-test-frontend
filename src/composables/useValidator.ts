import useVuelidate from "@vuelidate/core";
import { ValidationRuleCollection } from "@vuelidate/core";


function focusTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
        if (el.getBoundingClientRect().bottom > window.innerHeight) {
            el.scrollIntoView(false);
        }
        if (el.getBoundingClientRect().top < 0) {
            el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });

        }
        if (el?.focus) {
            //el.focus({ preventScroll: false });
            el.focus({ preventScroll: true });
        }
    }

}

export default function (formData: Record<string, any>, rules: ValidationRuleCollection) {
    const v$ = useVuelidate(rules, formData);
    return {
        formData,
        v$,
        formatVuelidateErrors(errors: any[]) {
            return errors.map((error) => {
                return { text: error.$message, key: error.$uid };
            });
        },
        async validate(): Promise<boolean> {
            const isFormCorrect = await v$.value.$validate();
            if (!isFormCorrect) {
                const { $errors
                } = v$.value;
                const {
                    0: { $property: firsInvalidEl, $validator, $response
                    } = { $property: null, $validator: null, $response: null },
                    length,
                } = $errors as any[];
                if ($validator === "$each"
                ) {
                    const data = $response.$data
                    const fisrtIndex = data.findIndex(
                        (error: any) => {
                            return Object.values(error).some(({ $invalid }: any) => $invalid)
                        }
                    )
                    const block = $response.$data[fisrtIndex]
                    const firsInvalidElInList = Object.keys(block).find(function (key) {
                        const { $invalid } = block[key]
                        return $invalid

                    });
                    if (firsInvalidElInList) {
                        focusTo(`${firsInvalidEl}-${firsInvalidElInList}-${fisrtIndex}`);
                        return false;
                    }

                } else {
                    if (firsInvalidEl) {
                        focusTo(firsInvalidEl);
                        return false;
                    }
                }

                return false;
            }
            return true
        }
    };
}