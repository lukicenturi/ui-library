<script lang="ts" setup>
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import type { RuiIcons } from '@/icons';

export interface Props {
  expanded: boolean;
  icon?: RuiIcons;
}

withDefaults(defineProps<Props>(), { icon: 'arrow-down-s-line' });

const css = useCssModule();
const attrs = useAttrs();
</script>

<template>
  <RuiButton
    :class="[
      css.tr__expander_button,
      {
        [css.tr__expander_button_open]: expanded,
      },
    ]"
    icon
    size="sm"
    variant="text"
    v-bind="attrs"
  >
    <slot>
      <RuiIcon
        :class="css.tr__expander_button_icon"
        :name="icon"
      />
    </slot>
  </RuiButton>
</template>

<style lang="scss" module>
.tr__expander {
  &_button {
    @apply relative;

    &_icon {
      @apply transition rotate-0;
    }

    &_open .tr__expander_button_icon {
      @apply rotate-180;
    }
  }
}
</style>
