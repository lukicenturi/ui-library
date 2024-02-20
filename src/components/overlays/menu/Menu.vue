<script setup lang="ts">
import { type PopperOptions, usePopper } from '@/composables/popper';

export interface Props {
  openOnHover?: boolean;
  disabled?: boolean;
  openDelay?: number;
  closeDelay?: number;
  popper?: PopperOptions;
  menuClass?: string;
}

defineOptions({
  name: 'RuiMenu',
});

const props = withDefaults(defineProps<Props>(), {
  openOnHover: false,
  disabled: false,
  openDelay: 0,
  closeDelay: 0,
  popper: () => ({}),
  menuClass: '',
});

const css = useCssModule();

const { closeDelay, openDelay, popper, disabled } = toRefs(props);

const {
  reference: activator,
  popper: menu,
  open,
  popperEnter,
  onMouseOver,
  onMouseLeave,
  onPopperLeave,
  updatePopper,
} = usePopper(popper, disabled, openDelay, closeDelay);

const click: Ref<boolean> = ref(false);

function onLeave() {
  onMouseLeave();
  set(click, false);
}

function checkClick() {
  if (get(open) && get(click)) {
    onLeave();
  }
  else {
    onMouseOver();
    set(click, true);
  }
}

onClickOutside(menu, () => {
  if (get(open))
    onLeave();
}, { ignore: [activator] });
</script>

<template>
  <div
    ref="activator"
    :class="css.wrapper"
    :data-menu-disabled="disabled"
    @mouseenter="openOnHover ? onMouseOver() : null"
    @mouseleave="openOnHover && !click ? onMouseLeave() : null"
    @click="checkClick()"
  >
    <slot
      name="activator"
      :open="open"
    />

    <Teleport
      v-if="!disabled"
      to="body"
    >
      <div
        v-if="popperEnter"
        ref="menu"
        :class="[
          css.menu,
          menuClass,
          css[`menu__${popper?.strategy ?? 'absolute'}`],
        ]"
        role="menu"
      >
        <TransitionGroup
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
          @before-enter="updatePopper()"
          @after-leave="onPopperLeave()"
        >
          <div
            v-if="open"
            key="menu"
            :class="css.base"
            role="menuitem"
          >
            <slot />
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  @apply relative inline-flex;
}

.menu {
  @apply w-max transform transition-opacity delay-0 z-[9999];

  &__fixed {
    @apply fixed;
  }

  &__absolute {
    @apply absolute;
  }

  .base {
    @apply rounded shadow-8;
    @apply bg-white text-rui-text;
  }
}

:global(.dark) {
  .menu {
    .base {
      @apply bg-[#2E2E2E];
    }
  }
}
</style>
