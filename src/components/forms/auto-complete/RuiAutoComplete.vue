<script lang="ts" setup generic='T extends object'>
import { Combobox, ComboboxButton, ComboboxOption, ComboboxOptions } from '@headlessui/vue';
import RuiAutoCompleteSelection from '@/components/forms/auto-complete/RuiAutoCompleteSelection.vue';
import { defaultKeyProp } from '@/consts/forms/auto-complete';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiTextField from '@/components/forms/text-field/RuiTextField.vue';
import type { ContextColorsType } from '@/consts/colors';

export type ModelValue<T> = T | null | T[];

export interface Props<T extends object> {
  data: T[];
  modelValue: ModelValue<T>;
  nullable?: boolean;
  disabled?: boolean;
  searchQuery?: string;
  searchProp?: Extract<keyof T, string>;
  placeholder?: string;
  label?: string;
  keyProp?: Extract<keyof T, string>;
  textProp?: Extract<keyof T, string>;
  itemDisabledProp?: Extract<keyof T, string>;
  variant?: 'default' | 'filled' | 'outlined';
  color?: ContextColorsType;
  dense?: boolean;
  hint?: string;
  errorMessages?: string[];
}

defineOptions({
  name: 'RuiAutoComplete',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props<T>>(), {
  keyProp: undefined,
  textProp: undefined,
  itemDisabledProp: undefined,
  searchProp: undefined,
  searchQuery: '',
  placeholder: '',
  label: '',
  disabled: false,
  nullable: false,
  variant: 'default',
  color: undefined,
  dense: false,
  hint: '',
  errorMessages: () => [],
});

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: ModelValue<T>): void;
}>();

const css = useCssModule();
const slots = useSlots();

const query = ref(props.searchQuery ?? '');
const button = ref<{
  el: HTMLButtonElement;
}>();

function matches(search: string, text?: string): boolean {
  return !!text && text.toLowerCase().includes(search);
}

const internalKeyProp = computed<string>(() => props.keyProp ?? defaultKeyProp);

const internalModelValue = computed<object | object[] | null>(() => props.modelValue);

const filtered = computed<T[]>(() => {
  const search = get(query).toLowerCase();
  const searchKey = props.searchProp;
  const textKey = props.textProp;
  return !search
    ? props.data
    : props.data.filter((item) => {
      const itemText = getText(item, textKey);
      if (searchKey) {
        const searchText = getStringValue(item[searchKey]);
        return matches(search, itemText) || matches(search, searchText);
      }
      return matches(search, itemText);
    });
});

const multiple = computed(() => Array.isArray(props.modelValue));

const hasValue = computed(() => {
  const value = props.modelValue;
  return Array.isArray(value) ? value.length > 0 : !!value;
});

const hideDetails = computed(() => !(props.hint || props.errorMessages?.length > 0));

function onChange(newVal: ModelValue<T>) {
  const value = props.modelValue;
  if (!(newVal && value) || newVal !== value)
    emit('update:modelValue', newVal);
}

function setQuery(q: string) {
  set(query, q);
}

function toggleDropdown() {
  get(button)?.el?.click();
}

function onClear() {
  emit('update:modelValue', get(multiple) ? [] : null);
  setQuery('');
}

function onRemove(option: unknown) {
  const value = props.modelValue;

  if (!get(multiple) || !Array.isArray(value))
    return;

  const key = props.keyProp ?? defaultKeyProp as Extract<keyof T, string>;

  emit(
    'update:modelValue',
    value.filter((opt: T) => opt[key] !== (option as T)[key]),
  );
}

watch(multiple, (multiple) => {
  const value = props.modelValue;

  if (multiple) {
    if (Array.isArray(value))
      emit('update:modelValue', value);
    else
      emit('update:modelValue', value ? [value] : []);
  }
  else {
    if (Array.isArray(value))
      emit('update:modelValue', value.length > 0 ? value[0] : null);
    else
      emit('update:modelValue', value || null);
  }
});

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList<T>(
  filtered,
  {
    itemHeight: 40,
    overscan: 1,
  },
);

watch(filtered, () => {
  scrollTo(0);
});

const renderedData = useArrayMap(list, ({ data }) => data);

function updateOpen(open: boolean) {
  if (!open && get(hasValue)) {
    const value = props.modelValue;
    const key = props.keyProp ?? defaultKeyProp as Extract<keyof T, string>;
    const lastKey = Array.isArray(value)
      ? value.at(-1)?.[key]
      : value;

    nextTick(() => {
      scrollTo(get(filtered).findIndex(item => item[key] === lastKey));
    });
  }
}

const { getTextValue, getItemKey, isItemDisabled } = useAutoCompleteProps(props);

const attrs = useAttrs();
</script>

<template>
  <div :class="[multiple ? css.multiple : css.single, css[variant ?? '']]">
    <Combobox
      #default="{ open }"
      :by="internalKeyProp"
      :class="[
        {
          [css.disabled]: disabled,
          [css.has_details]: !hideDetails,
        },
      ]"
      :disabled="disabled"
      :model-value="internalModelValue"
      :multiple="multiple"
      :nullable="nullable"
      @update:model-value="onChange($event)"
    >
      <div class="relative">
        <RuiTextField
          v-model="query"
          :as="RuiAutoCompleteSelection"
          v-bind="attrs"
          :color="color"
          :data="modelValue"
          :dense="dense"
          :disabled="disabled"
          :error-messages="errorMessages"
          :has-value="hasValue"
          :hide-details="hideDetails"
          :hint="hint"
          :item-disabled-prop="itemDisabledProp"
          :key-prop="keyProp"
          :label="label"
          :placeholder="placeholder"
          :text-prop="textProp"
          :variant="variant"
          @remove="onRemove($event)"
          @focus-input="!open && toggleDropdown()"
        >
          <template #append>
            <div class="flex space-x-1 items-center">
              <button
                v-if="nullable && hasValue"
                :class="css.clear_button"
                :disabled="disabled"
                tabindex="-1"
                type="button"
                @click.prevent.stop="onClear()"
              >
                <RuiIcon
                  :class="css.clear_icon"
                  name="close-line"
                />
              </button>
              <ComboboxButton
                ref="button"
                :class="[{ [css.toggle_disabled]: disabled }]"
                :disabled="disabled"
                @click="updateOpen(open)"
              >
                <RuiIcon
                  :class="[css.toggle_icon, { 'rotate-180': open }]"
                  name="arrow-drop-down-fill"
                />
              </ComboboxButton>
            </div>
          </template>
        </RuiTextField>
        <Transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-out"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
          @after-leave="setQuery('')"
        >
          <ComboboxOptions :class="css.options">
            <div
              v-if="filtered.length === 0 && query !== ''"
              :class="css.empty"
            >
              <slot name="no-data">
                No options found
              </slot>
            </div>
            <div
              v-else
              v-bind="containerProps"
              class="max-h-60"
            >
              <div v-bind="wrapperProps">
                <ComboboxOption
                  v-for="item in renderedData"
                  :key="getItemKey(item)"
                  #default="{ selected, disabled: itemDisabled }"
                  class="h-10"
                  :disabled="isItemDisabled(item)"
                  :value="item"
                  as="template"
                >
                  <li
                    :class="[
                      css.option,
                      {
                        [css.option__disabled]: itemDisabled,
                        [css.option__selected]: selected,
                        [css.option__prefixed]: !!slots.prefix,
                      },
                    ]"
                  >
                    <span
                      v-if="!!slots.prefix"
                      :class="{ prefix: !!slots.prefix }"
                    >
                      <slot
                        class="prefix"
                        name="prefix"
                        :item="item"
                      />
                    </span>
                    <span class="block truncate">
                      <template v-if="slots.default">
                        <slot :item="item" />
                      </template>
                      <template v-else> {{ getTextValue(item) }} </template>
                    </span>
                    <span
                      v-if="selected"
                      :class="css.option__selected_icon"
                    >
                      <RuiIcon
                        aria-hidden="true"
                        class="h-5 w-5"
                        name="check-line"
                      />
                    </span>
                  </li>
                </ComboboxOption>
              </div>
            </div>
          </ComboboxOptions>
        </Transition>
      </div>
    </Combobox>
  </div>
</template>

<style lang="scss" module>
.toggle_icon {
  @apply text-rui-grey-600 hover:text-rui-grey-800 transition-all;
}

.clear {
  &_button {
    @apply inset-y-0 px-2 flex items-center focus:outline-none;
  }

  &_icon {
    @apply text-rui-grey-600 hover:text-rui-grey-800;
  }
}

.has_details {
  .options {
    @apply -mt-5;
  }
}

.multiple,
.single {
  @apply max-w-full;
}

.default,
.filled,
.outlined {
  @apply visible;
}

.options {
  @apply absolute z-[999] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-8;

  .empty {
    @apply relative cursor-default select-none py-2 px-4 text-rui-grey-700 pointer-events-none;
  }

  .option {
    @apply relative cursor-pointer select-none py-2 pr-10 pl-4 text-rui-grey-900;
    @apply hover:bg-rui-grey-100;

    &__selected {
      @apply bg-rui-grey-300/50;

      &.option__disabled {
        @apply hover:bg-rui-grey-300/50;
      }

      &_icon {
        @apply absolute inset-y-0 right-0 flex items-center pr-3 text-rui-primary;
      }
    }

    &__disabled {
      @apply cursor-default hover:bg-transparent text-rui-grey-500;
    }

    &__prefixed {
      @apply flex items-center;
    }
  }
}

:global(.dark) {
  .clear {
    &_icon {
      @apply text-rui-grey-400 hover:text-rui-grey-300;
    }
  }

  .toggle_icon {
    @apply text-rui-grey-400 hover:text-rui-grey-300;
  }

  .options {
    @apply bg-white/[0.12];
    background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.12) 0%,
        rgba(255, 255, 255, 0.12) 100%
      ),
      #121212;

    .empty {
      @apply text-rui-grey-500;
    }

    .option {
      @apply text-white hover:bg-rui-grey-300/20;

      &__selected {
        @apply bg-rui-grey-300/10;
        @apply hover:bg-rui-grey-300/20;

        &.option__disabled {
          @apply hover:bg-rui-grey-300/10;
        }

        &_icon {
          @apply text-white;
        }
      }

      &__disabled {
        @apply hover:bg-transparent text-white/50;
      }
    }
  }
}
</style>
