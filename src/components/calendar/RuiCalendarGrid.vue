<script setup lang="ts">
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import { CalendarStateSymbol, getDaysOfWeek, type RuiCalendarState } from '@/components/calendar/state';
import { computed, inject } from 'vue';

defineOptions({
  name: 'RuiCalendarGrid',
  inheritAttrs: false,
});

const model = defineModel<Date | undefined>();

const props = defineProps<{
  viewMonth: number;
  viewYear: number;
}>();

const calendarState = inject<RuiCalendarState>(CalendarStateSymbol) as RuiCalendarState;

const daysOfWeek = getDaysOfWeek();

const calendarDays = computed(() => {
  const firstDayOfMonth = new Date(props.viewYear, props.viewMonth, 1);
  const lastDayOfMonth = new Date(props.viewYear, props.viewMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const prevMonthDays = [];
  if (startingDayOfWeek > 0) {
    const prevMonthLastDay = new Date(props.viewYear, props.viewMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      prevMonthDays.push({
        date: new Date(props.viewYear, props.viewMonth - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }
  }

  const currentMonthDays = [];
  for (let i = 1; i <= daysInMonth; i++) {
    currentMonthDays.push({
      date: new Date(props.viewYear, props.viewMonth, i),
      isCurrentMonth: true,
    });
  }

  const nextMonthDays = [];
  const totalDaysSoFar = prevMonthDays.length + currentMonthDays.length;
  const daysToAdd = 42 - totalDaysSoFar;
  for (let i = 1; i <= daysToAdd; i++) {
    nextMonthDays.push({
      date: new Date(props.viewYear, props.viewMonth + 1, i),
      isCurrentMonth: false,
    });
  }

  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
});

function isDateInRange(date: Date): boolean {
  const { maxDate, minDate } = calendarState;

  if (isDefined(maxDate) && date > get(maxDate))
    return false;
  if (isDefined(minDate) && date < get(minDate))
    return false;

  return true;
}

function isDateSelected(date: Date): boolean {
  if (!isDefined(model))
    return false;

  const modelValue = get(model);

  return date.getFullYear() === modelValue.getFullYear()
    && date.getMonth() === modelValue.getMonth()
    && date.getDate() === modelValue.getDate();
}

function selectDate(date: Date) {
  if (!isDateInRange(date))
    return;

  let updateModel: Date | undefined;

  if (isDateSelected(date) && calendarState.allowEmpty) {
    updateModel = undefined;
  }
  else {
    if (isDefined(model)) {
      const modelValue = get(model);
      const newDate = new Date(date);
      newDate.setHours(modelValue.getHours());
      newDate.setMinutes(modelValue.getMinutes());
      newDate.setSeconds(modelValue.getSeconds());
      updateModel = newDate;
    }
    else {
      updateModel = new Date(date);
    }
  }
  set(model, updateModel);
}

function isToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate()
    && date.getMonth() === today.getMonth()
    && date.getFullYear() === today.getFullYear();
}

function getKey(date: Date): string {
  const fullYear = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `rui-id-${fullYear}-${month}-${day}`;
}
</script>

<template>
  <div class="calendar-grid">
    <div class="calendar-weekdays">
      <span
        v-for="day in daysOfWeek"
        :key="day"
        class="weekday-label"
      >
        {{ day }}
      </span>
    </div>

    <div class="calendar-days">
      <RuiButton
        v-for="{ date, isCurrentMonth } in calendarDays"
        :key="`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`"
        type="button"
        variant="text"
        class="day-cell"
        :disabled="!isDateInRange(date)"
        :class="{
          'not-current-month': !isCurrentMonth,
          'is-selected': isDateSelected(date),
          'is-today': isToday(date),
          'is-disabled': !isDateInRange(date),
          [getKey(date)]: true,
        }"
        @click="selectDate(date)"
      >
        {{ date.getDate() }}
      </RuiButton>
    </div>
  </div>
</template>

<style scoped>
.calendar-grid {
  @apply w-full;
}

.calendar-weekdays {
  @apply grid grid-cols-7 bg-gray-50 dark:bg-gray-700;
}

.weekday-label {
  @apply py-2 text-xs font-medium text-center text-gray-500 dark:text-gray-400;
}

.calendar-days {
  @apply grid grid-cols-7;
}

.day-cell {
  @apply h-10 w-full flex items-center justify-center text-sm rounded-full mx-auto;
  @apply text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700;

  &.not-current-month {
    @apply text-gray-400 dark:text-gray-600;
  }

  &.is-selected {
    @apply bg-rui-primary text-white hover:bg-rui-primary/90;
  }

  &.is-today:not(.is-selected) {
    @apply border border-rui-primary/50 font-medium;
  }

  &.is-disabled {
    @apply opacity-50 cursor-not-allowed hover:bg-transparent;
  }
}
</style>
