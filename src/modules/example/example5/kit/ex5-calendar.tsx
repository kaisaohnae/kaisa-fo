'use client';

import {useMemo, useState} from 'react';
import {joinClasses} from './lib';
import {
  addMonths,
  buildMonthCells,
  isDateAfter,
  isDateBefore,
  isSameDay,
  normalizeCalendarDate,
  toDateKey,
  type CalendarCell,
} from '@/ui-components/calendar/calendar-utils';

export type Ex5CalendarSize = 'sm' | 'md' | 'lg';

export type Ex5CalendarMarkedDate = {
  date: Date | string;
  tone?: 'accent' | 'muted' | 'danger';
};

export type Ex5CalendarProps = {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  viewDate?: Date;
  defaultViewDate?: Date;
  onViewDateChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  markedDates?: Ex5CalendarMarkedDate[];
  disabledDates?: Array<Date | string>;
  disabled?: boolean;
  readOnly?: boolean;
  uiSize?: Ex5CalendarSize;
  showLegend?: boolean;
  legendLabel?: string;
  locale?: 'ko' | 'en';
  className?: string;
};

const WEEKDAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];
const WEEKDAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function normalizeDate(value: Date | string) {
  return normalizeCalendarDate(value);
}

function useControllableDate(
  value: Date | null | undefined,
  defaultValue: Date | null | undefined,
  onChange?: (date: Date | null) => void,
) {
  const [internal, setInternal] = useState<Date | null>(defaultValue ?? null);
  const isControlled = value !== undefined;
  const selected = isControlled ? value : internal;

  const setSelected = (next: Date | null) => {
    if (!isControlled) {
      setInternal(next);
    }
    onChange?.(next);
  };

  return [selected, setSelected] as const;
}

function useControllableViewDate(
  value: Date | undefined,
  defaultValue: Date | undefined,
  onChange?: (date: Date) => void,
) {
  const [internal, setInternal] = useState<Date>(defaultValue ?? new Date());
  const isControlled = value !== undefined;
  const viewDate = isControlled ? value : internal;

  const setViewDate = (next: Date) => {
    if (!isControlled) {
      setInternal(next);
    }
    onChange?.(next);
  };

  return [viewDate, setViewDate] as const;
}

export function Ex5Calendar({
  value,
  defaultValue = null,
  onChange,
  viewDate: viewDateProp,
  defaultViewDate,
  onViewDateChange,
  minDate,
  maxDate,
  markedDates = [],
  disabledDates = [],
  disabled,
  readOnly,
  uiSize = 'md',
  showLegend = false,
  legendLabel = '표시일',
  locale = 'ko',
  className,
}: Ex5CalendarProps) {
  const [selected, setSelected] = useControllableDate(value, defaultValue, onChange);
  const [viewDate, setViewDate] = useControllableViewDate(
    viewDateProp,
    defaultViewDate ?? selected ?? new Date(),
    onViewDateChange,
  );

  const weekdays = locale === 'en' ? WEEKDAYS_EN : WEEKDAYS_KO;
  const cells = useMemo(() => buildMonthCells(viewDate), [viewDate]);

  const markedMap = useMemo(() => {
    const map = new Map<string, Ex5CalendarMarkedDate['tone']>();
    markedDates.forEach((item) => {
      map.set(toDateKey(normalizeDate(item.date)), item.tone ?? 'accent');
    });
    return map;
  }, [markedDates]);

  const disabledSet = useMemo(() => {
    return new Set(disabledDates.map((item) => toDateKey(normalizeDate(item))));
  }, [disabledDates]);

  const isDayDisabled = (date: Date) => {
    if (disabled) {
      return true;
    }
    if (minDate && isDateBefore(date, minDate)) {
      return true;
    }
    if (maxDate && isDateAfter(date, maxDate)) {
      return true;
    }
    return disabledSet.has(toDateKey(date));
  };

  const handlePrevMonth = () => {
    if (disabled || readOnly) {
      return;
    }
    setViewDate(addMonths(viewDate, -1));
  };

  const handleNextMonth = () => {
    if (disabled || readOnly) {
      return;
    }
    setViewDate(addMonths(viewDate, 1));
  };

  const handleSelectDay = (cell: CalendarCell) => {
    if (!cell.date || disabled || readOnly || isDayDisabled(cell.date)) {
      return;
    }
    setSelected(cell.date);
  };

  const monthLabel =
    locale === 'en'
      ? viewDate.toLocaleDateString('en-US', {month: 'long', year: 'numeric'})
      : `${viewDate.getFullYear()}년 ${viewDate.getMonth() + 1}월`;

  return (
    <div
      className={joinClasses(
        'ex5k-calendar',
        `ex5k-calendar--${uiSize}`,
        disabled && 'ex5k-calendar--disabled',
        readOnly && 'ex5k-calendar--readonly',
        className,
      )}
    >
      <div className="ex5k-calendar__head">
        <div className="ex5k-calendar__nav">
          <button
            type="button"
            className="ex5k-calendar__nav-btn"
            onClick={handlePrevMonth}
            disabled={disabled || readOnly}
            aria-label={locale === 'en' ? 'Previous month' : '이전 달'}
          >
            ‹
          </button>
          <strong className="ex5k-calendar__title">{monthLabel}</strong>
          <button
            type="button"
            className="ex5k-calendar__nav-btn"
            onClick={handleNextMonth}
            disabled={disabled || readOnly}
            aria-label={locale === 'en' ? 'Next month' : '다음 달'}
          >
            ›
          </button>
        </div>
        {showLegend ? (
          <span className="ex5k-calendar__legend">
            <i className="ex5k-calendar__dot ex5k-calendar__dot--accent" />
            {legendLabel}
          </span>
        ) : null}
      </div>

      <div className="ex5k-calendar__weekdays" aria-hidden="true">
        {weekdays.map((label, index) => (
          <span
            key={label}
            className={joinClasses(
              'ex5k-calendar__weekday',
              index === 0 && 'ex5k-calendar__weekday--sun',
              index === 6 && 'ex5k-calendar__weekday--sat',
            )}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="ex5k-calendar__grid" role="grid" aria-label={monthLabel}>
        {cells.map((cell, index) => {
          if (!cell.date || cell.day === null) {
            return (
              <span
                key={`empty-${index}`}
                className="ex5k-calendar__day ex5k-calendar__day--empty"
                role="gridcell"
                aria-hidden="true"
              />
            );
          }

          const markedTone = markedMap.get(toDateKey(cell.date));
          const dayDisabled = isDayDisabled(cell.date);
          const daySelected = selected ? isSameDay(cell.date, selected) : false;

          return (
            <button
              key={toDateKey(cell.date)}
              type="button"
              className={joinClasses(
                'ex5k-calendar__day',
                cell.isToday && 'ex5k-calendar__day--today',
                daySelected && 'ex5k-calendar__day--selected',
                markedTone && `ex5k-calendar__day--marked ex5k-calendar__day--marked-${markedTone}`,
                cell.isSunday && 'ex5k-calendar__day--sun',
                cell.isSaturday && 'ex5k-calendar__day--sat',
                dayDisabled && 'ex5k-calendar__day--disabled',
              )}
              onClick={() => handleSelectDay(cell)}
              disabled={dayDisabled}
              role="gridcell"
              aria-selected={daySelected}
              aria-disabled={dayDisabled || readOnly || undefined}
              aria-label={
                locale === 'en'
                  ? cell.date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : `${cell.date.getFullYear()}년 ${cell.date.getMonth() + 1}월 ${cell.day}일`
              }
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
