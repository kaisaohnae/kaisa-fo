'use client';

import {useState} from 'react';
import {UiDatepicker, UiField} from '@/ui-components';
import Example3ShowcaseSection from './example3-showcase-section';
import Example3ShowcaseShell from './example3-showcase-shell';
import Example3StateCard from './example3-state-card';

const MARKED_DAYS = [2, 5, 8, 12, 15, 18, 21, 24, 26, 27, 28, 30];

const DEMO_ANCHOR = new Date(2026, 5, 28);

function buildMarkedDates(year: number, month: number) {
  return MARKED_DAYS.map((day) => ({
    date: new Date(year, month, day),
    tone: 'accent' as const,
  }));
}

export default function Example3DatepickerPage() {
  const [anchorDate] = useState(() => DEMO_ANCHOR);
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => DEMO_ANCHOR);
  const [rangeDate, setRangeDate] = useState<Date | null>(null);
  const markedDates = buildMarkedDates(anchorDate.getFullYear(), anchorDate.getMonth());

  const minDate = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1);
  const maxDate = new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 0);

  return (
    <Example3ShowcaseShell
      title="Datepicker"
      description="input · calendar popover · manual input · clear · state"
    >
      <Example3ShowcaseSection title="Basic" description="입력 · 캘린더 아이콘 · 날짜 선택">
        <div className="ex3-state-grid ex3-state-grid--pickers">
          <Example3StateCard label="Default">
            <UiField label="일정 날짜" htmlFor="ex3-datepicker-default" hint="직접 입력 또는 캘린더">
              <UiDatepicker
                id="ex3-datepicker-default"
                value={selectedDate}
                onChange={setSelectedDate}
                clearable
              />
            </UiField>
          </Example3StateCard>
          <Example3StateCard label="With marked dates">
            <UiField label="예약 가능일" htmlFor="ex3-datepicker-marked">
              <UiDatepicker
                id="ex3-datepicker-marked"
                defaultValue={new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 10)}
                markedDates={markedDates}
                disabledDates={markedDates.map((item) => item.date)}
              />
            </UiField>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Size" description="sm · md · lg">
        <div className="ex3-state-grid ex3-state-grid--pickers">
          <Example3StateCard label="Small">
            <UiDatepicker uiSize="sm" defaultValue={anchorDate} clearable />
          </Example3StateCard>
          <Example3StateCard label="Medium">
            <UiDatepicker uiSize="md" defaultValue={anchorDate} clearable />
          </Example3StateCard>
          <Example3StateCard label="Large">
            <UiDatepicker uiSize="lg" defaultValue={anchorDate} clearable />
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Input mode" description="manual · calendar only · min/max">
        <div className="ex3-state-grid ex3-state-grid--pickers">
          <Example3StateCard label="Manual input">
            <UiField label="날짜 입력" hint="2026.06.27 형식">
              <UiDatepicker
                value={rangeDate}
                onChange={setRangeDate}
                allowManualInput
                clearable
              />
            </UiField>
          </Example3StateCard>
          <Example3StateCard label="Calendar only">
            <UiDatepicker
              allowManualInput={false}
              defaultValue={anchorDate}
              placeholder="캘린더에서 선택"
            />
          </Example3StateCard>
          <Example3StateCard label="Min / Max">
            <UiField label="이번 달만" hint={`${minDate.getDate()}일 ~ ${maxDate.getDate()}일`}>
              <UiDatepicker minDate={minDate} maxDate={maxDate} defaultValue={anchorDate} />
            </UiField>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="State" description="disabled · readOnly · invalid">
        <div className="ex3-state-grid ex3-state-grid--pickers">
          <Example3StateCard label="Disabled">
            <UiField label="마감일" disabled>
              <UiDatepicker disabled defaultValue={anchorDate} />
            </UiField>
          </Example3StateCard>
          <Example3StateCard label="Read only">
            <UiField label="확정일" hint="조회만 가능">
              <UiDatepicker
                readOnly
                value={new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 18)}
              />
            </UiField>
          </Example3StateCard>
          <Example3StateCard label="Invalid">
            <UiField label="체크인" error="유효한 날짜를 입력해 주세요">
              <UiDatepicker invalid defaultValue={anchorDate} />
            </UiField>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>
    </Example3ShowcaseShell>
  );
}
