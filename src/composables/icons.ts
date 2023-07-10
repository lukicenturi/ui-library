import { type GeneratedIcon } from '@/types/icons';
import {
  RiAlertLine,
  RiCheckboxBlankLine,
  RiCheckboxCircleLine,
  RiCheckboxFill,
  RiCheckboxIndeterminateFill,
  RiErrorWarningLine,
  RiInformationLine,
} from '../all-icons';

export const useIcons = createGlobalState(() => {
  const requiredIcons: GeneratedIcon[] = [
    RiAlertLine,
    RiCheckboxBlankLine,
    RiCheckboxCircleLine,
    RiCheckboxFill,
    RiCheckboxIndeterminateFill,
    RiErrorWarningLine,
    RiInformationLine,
  ];

  const registeredIcons: Ref<Record<string, string>> = ref({});
  const registerIcons = (iconsToAdd: GeneratedIcon[]) => {
    set(registeredIcons, {
      ...get(registeredIcons),
      ...Object.fromEntries(
        [...requiredIcons, ...iconsToAdd].map(({ name, path }) => [name, path])
      ),
    });
  };

  return { registeredIcons, registerIcons };
});
