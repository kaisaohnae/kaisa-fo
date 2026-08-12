'use client';

import {useState} from 'react';
import {Ex5Datepicker, Ex5Field} from './kit';
import Example5ShowcaseSection from './example5-showcase-section';
import Example5ShowcaseShell from './example5-showcase-shell';
import Example5StateCard from './example5-state-card';

const MARKED_DAYS = [2, 5, 8, 12, 15, 18, 21, 24, 26, 27, 28, 30];

const DEMO_ANCHOR = new Date(2026, 5, 28);

function buildMarkedDates(year: number, month: number) {
  return MARKED_DAYS.map((day) => ({
    date: new Date(year, month, day),
    tone: 'accent' as const,
  }));
}

export default function Example5DatepickerPage() {
  const [anchorDate] = useState(() => DEMO_ANCHOR);
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => DEMO_ANCHOR);
  const [rangeDate, setRangeDate] = useState<Date | null>(null);
  const markedDates = buildMarkedDates(anchorDate.getFullYear(), anchorDate.getMonth());

  const minDate = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1);
  const maxDate = new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 0);

  return (
    <Example5ShowcaseShell
      title="Datepicker"
      description="input · calendar popover · manual input · clear · state"
    >
      <Example5ShowcaseSection title="Basic" description="입력 · 캘린더 아이콘 · 날짜 선택">
        <div className="ex5-state-grid ex5-state-grid--pickers">
          <Example5StateCard label="Default">
            <Ex5Field label="일정 날짜" htmlFor="ex5-datepicker-default" hint="직접 입력 또는 캘린더">
              <Ex5Datepicker
                id="ex5-datepicker-default"
                value={selectedDate}
                onChange={setSelectedDate}
                clearable
              />
            </Ex5Field>
          </Example5StateCard>
          <Example5StateCard label="With marked dates">
            <Ex5Field label="예약 가능일" htmlFor="ex5-datepicker-marked">
              <Ex5Datepicker
                id="ex5-datepicker-marked"
                defaultValue={new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 10)}
                markedDates={markedDates}
                disabledDates={markedDates.map((item) => item.date)}
              />
            </Ex5Field>
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>

      <Example5ShowcaseSection title="Size" description="sm · md · lg">
        <div className="ex5-state-grid ex5-state-grid--pickers">
          <Example5StateCard label="Small">
            <Ex5Datepicker uiSize="sm" defaultValue={anchorDate} clearable />
          </Example5StateCard>
          <Example5StateCard label="Medium">
            <Ex5Datepicker uiSize="md" defaultValue={anchorDate} clearable />
          </Example5StateCard>
          <Example5StateCard label="Large">
            <Ex5Datepicker uiSize="lg" defaultValue={anchorDate} clearable />
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>

      <Example5ShowcaseSection title="Input mode" description="manual · calendar only · min/max">
        <div className="ex5-state-grid ex5-state-grid--pickers">
          <Example5StateCard label="Manual input">
            <Ex5Field label="날짜 입력" hint="2026.06.27 형식">
              <Ex5Datepicker
                value={rangeDate}
                onChange={setRangeDate}
                allowManualInput
                clearable
              />
            </Ex5Field>
          </Example5StateCard>
          <Example5StateCard label="Calendar only">
            <Ex5Datepicker
              allowManualInput={false}
              defaultValue={anchorDate}
              placeholder="캘린더에서 선택"
            />
          </Example5StateCard>
          <Example5StateCard label="Min / Max">
            <Ex5Field label="이번 달만" hint={`${minDate.getDate()}일 ~ ${maxDate.getDate()}일`}>
              <Ex5Datepicker minDate={minDate} maxDate={maxDate} defaultValue={anchorDate} />
            </Ex5Field>
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>

      <Example5ShowcaseSection title="State" description="disabled · readOnly · invalid">
        <div className="ex5-state-grid ex5-state-grid--pickers">
          <Example5StateCard label="Disabled">
            <Ex5Field label="마감일" disabled>
              <Ex5Datepicker disabled defaultValue={anchorDate} />
            </Ex5Field>
          </Example5StateCard>
          <Example5StateCard label="Read only">
            <Ex5Field label="확정일" hint="조회만 가능">
              <Ex5Datepicker
                readOnly
                value={new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 18)}
              />
            </Ex5Field>
          </Example5StateCard>
          <Example5StateCard label="Invalid">
            <Ex5Field label="체크인" error="유효한 날짜를 입력해 주세요">
              <Ex5Datepicker invalid defaultValue={anchorDate} />
            </Ex5Field>
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>
    </Example5ShowcaseShell>
  );
}
