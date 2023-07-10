<script setup lang="ts">
import { type ContextColorsType } from '@/consts/colors';
import { default as RuiIcon } from '@/components/icons/Icon.vue';

const props = withDefaults(
  defineProps<{
    title: string;
    description?: string;
    type?: ContextColorsType;
    icon?: string;
    variant: 'default' | 'filled' | 'outlined';
    actionText?: string;
    onAction?: Function | null;
    onClose?: Function | null;
  }>(),
  {
    description: '',
    type: 'primary',
    icon: null,
    variant: 'default',
    actionText: '',
    onAction: null,
    onClose: null,
  }
);

const { icon, type } = toRefs(props);

const usedIcon: ComputedRef<string> = computed(() => {
  const iconVal = get(icon);
  if (iconVal) {
    return iconVal;
  }

  const iconMap = {
    warning: 'alert-line',
    info: 'information-line',
    error: 'error-warning-line',
    success: 'checkbox-circle-line',
  };

  return iconMap[get(type)] ?? '';
});

const css = useCssModule();
</script>

<template>
  <div :class="[css.wrapper, css[type], css[variant]]">
    <div class="space-x-3 py-1">
      <div v-if="usedIcon">
        <rui-icon :name="usedIcon" />
      </div>
      <div class="space-y-1">
        <div class="font-medium">{{ title }}</div>
        <div class="text-body-2">{{ description }}</div>
      </div>
    </div>
    <div />
  </div>
</template>

<style lang="scss" module>
@use '@/styles/colors.scss' as c;
.wrapper {
  @apply px-4 py-2.5 rounded flex space-x-4;

  @each $color in c.$context-colors {
    &.#{$color} {
    }
  }
}
</style>
