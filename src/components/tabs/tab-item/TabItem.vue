<script lang="ts" setup>
export interface Props {
  active?: boolean;
  value: number | string;
  eager?: boolean;
}

defineOptions({
  name: 'RuiTabItem',
});

withDefaults(defineProps<Props>(), {
  eager: false,
  active: false,
});
</script>

<template>
  <div v-if="active || eager" v-show="active">
    <slot />
  </div>
</template>
