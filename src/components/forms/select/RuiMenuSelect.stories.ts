import RuiMenuSelect, { type Props } from '@/components/forms/select/RuiMenuSelect.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

interface SelectOption {
  id: string | number;
  label: string | number;
}

type SelectProps = Props<SelectOption>;

const render: StoryFn<SelectProps> = args => ({
  components: { RuiMenuSelect },
  setup() {
    const modelValue = computed({
      get() {
        return args.modelValue;
      },
      set(val) {
        args.modelValue = val;
      },
    });

    return { args, modelValue };
  },
  template: `<RuiMenuSelect v-bind="args" v-model="modelValue" />`,
});

const options: SelectOption[] = [
  { id: '1', label: 'Germany' },
  { id: '2', label: 'Nigeria' },
  { id: '3', label: 'Greece' },
  { id: '4', label: 'Indonesia' },
  { id: '5', label: 'Spain' },
  { id: '6', label: 'India' },
  { id: '7', label: 'France' },
  { id: '8', label: 'England' },
  ...[...new Array(12).keys()].map(index => ({
    id: index + 9,
    label: index + 9,
  })),
];

const meta: Meta<SelectProps> = {
  args: {
    disabled: false,
    options,
  },
  argTypes: {
    dense: { control: 'boolean' },
    disabled: { control: 'boolean' },
    modelValue: { control: 'string' },
    options: { control: 'array', defaultValue: [] },
    variant: {
      control: 'select',
      defaultValue: 'default',
      options: ['default', 'outlined', 'filled'],
    },
  },
  component: RuiMenuSelect as any,
  parameters: {
    docs: {
      controls: { exclude: ['update:model-value'] },
    },
  },
  render,
  tags: ['autodocs'],
  title: 'Components/Forms/MenuSelect',
};

type Story = StoryObj<SelectProps>;

export const Default: Story = {
  args: {
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
  },
};

export const DefaultDisabled: Story = {
  args: {
    disabled: true,
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
  },
};

export const Outlined: Story = {
  args: {
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
    variant: 'outlined',
  },
};

export const OutlinedDisabled: Story = {
  args: {
    disabled: true,
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
    variant: 'outlined',
  },
};

export const OutlinedDense: Story = {
  args: {
    dense: false,
    disabled: true,
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
    variant: 'outlined',
  },
};

export const OutlinedDisabledDense: Story = {
  args: {
    dense: true,
    disabled: true,
    keyAttr: 'id',
    modelValue: undefined,
    textAttr: 'label',
    variant: 'outlined',
  },
};

export default meta;
