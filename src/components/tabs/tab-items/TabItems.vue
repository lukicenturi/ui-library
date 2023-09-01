<script lang="ts" setup>
export interface Props {
  modelValue?: number | string;
}

defineOptions({
  name: 'RuiTabItems',
});

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
});

const { modelValue } = toRefs(props);

const slots = useSlots();
const children = computed(() => {
  const tabs = slots.default?.() ?? [];
  return tabs.map((tab, index) => {
    const value = tab.props?.value ?? index;
    const active = get(modelValue) === value;

    return {
      ...tab,
      props: {
        value,
        active,
        ...tab.props,
      },
    };
  });
});

const css = useCssModule();
</script>

<template>
  <div :class="css.tabs">
    <Component :is="child" v-for="(child, i) in children" :key="i" />
  </div>
</template>

<style lang="scss" module>
.tabs {
  @apply grow;
}
</style>
