import { useRotkiTheme } from '@/composables/theme';
import { StepperState } from '@/types/stepper';
import {
  type TableOptions,
  TableSymbol,
  createTableDefaults,
} from '@/composables/defaults/table';
import type { App } from 'vue';
import type { InitThemeOptions } from '@/types/theme';
import '@/style.scss';

export * from '@/icons';

export {
  type InitThemeOptions,
  type ThemeConfig,
  type ThemeContent,
  type ThemeData,
  ThemeMode,
} from '@/types/theme';

export { type ContextColorsType, contextColors } from '@/consts/colors';

export * from '@/composables';

export * from '@/components';

export { StepperState };

export interface RuiOptions {
  theme?: InitThemeOptions;
  defaults?: {
    table?: Partial<TableOptions>;
  };
}

export function createRui(options: RuiOptions = {}) {
  const { theme } = options;

  const defaults = Object.freeze({
    table: createTableDefaults(options.defaults?.table),
  });

  const install = (app: App) => {
    const { registerIcons } = useIcons();
    registerIcons(theme?.icons || []);
    useRotkiTheme().init({ ...theme });

    app.provide(TableSymbol, defaults.table);
  };

  return {
    defaults,
    install,
  };
}
