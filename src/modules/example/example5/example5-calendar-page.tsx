'use client';

import {useState} from 'react';
import {Ex5Calendar, Ex5Field} from './kit';
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

export default function Example5CalendarPage() {
  const [anchorDate] = useState(() => DEMO_ANCHOR);
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => DEMO_ANCHOR);
  const markedDates = buildMarkedDates(anchorDate.getFullYear(), anchorDate.getMonth());

  const minDate = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1);
  const maxDate = new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 0);

  return (
    <Example5ShowcaseShell
      title="Calendar"
      description="month nav · selection · marked · min/max · disabled · readOnly"
    >
      <Example5ShowcaseSection title="Basic" description="월 이동 · 날짜 선택 · 오늘 표시">
        <div className="ex5-state-grid ex5-state-grid--calendar">
          <Example5StateCard label="Default">
            <Ex5Field label="일정 날짜" hint="날짜를 클릭해 선택">
              <Ex5Calendar value={selectedDate} onChange={setSelectedDate} />
            </Ex5Field>
          </Example5StateCard>
          <Example5StateCard label="With legend">
            <Ex5Calendar
              showLegend
              legendLabel="예약일"
              markedDates={markedDates}
              defaultValue={new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 12)}
            />
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>

      <Example5ShowcaseSection title="Size" description="sm · md · lg">
        <div className="ex5-state-grid ex5-state-grid--calendar">
          <Example5StateCard label="Small">
            <Ex5Calendar uiSize="sm" defaultValue={anchorDate} />
          </Example5StateCard>
          <Example5StateCard label="Medium">
            <Ex5Calendar uiSize="md" defaultValue={anchorDate} />
          </Example5StateCard>
          <Example5StateCard label="Large">
            <Ex5Calendar uiSize="lg" defaultValue={anchorDate} />
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>

      <Example5ShowcaseSection title="Marked tone" description="accent · muted · danger">
        <div className="ex5-state-grid ex5-state-grid--calendar">
          <Example5StateCard label="Accent">
            <Ex5Calendar
              markedDates={[
                {date: new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 5), tone: 'accent'},
                {date: new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 12), tone: 'accent'},
              ]}
              defaultValue={new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 5)}
            />
          </Example5StateCard>
          <Example5StateCard label="Muted">
            <Ex5Calendar
              markedDates={[
                {date: new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 8), tone: 'muted'},
                {date: new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 16), tone: 'muted'},
              ]}
              defaultValue={new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 8)}
            />
          </Example5StateCard>
          <Example5StateCard label="Danger">
            <Ex5Calendar
              markedDates={[
                {date: new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 20), tone: 'danger'},
                {date: new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 21), tone: 'danger'},
              ]}
              defaultValue={new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 20)}
            />
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>

      <Example5ShowcaseSection title="State" description="min/max · disabled dates · disabled · readOnly">
        <div className="ex5-state-grid ex5-state-grid--calendar">
          <Example5StateCard label="Min / Max">
            <Ex5Field label="이번 달만 선택" hint={`${minDate.getDate()}일 ~ ${maxDate.getDate()}일`}>
              <Ex5Calendar minDate={minDate} maxDate={maxDate} defaultValue={anchorDate} />
            </Ex5Field>
          </Example5StateCard>
          <Example5StateCard label="Disabled dates">
            <Ex5Calendar
              disabledDates={markedDates.map((item) => item.date)}
              showLegend
              legendLabel="예약 마감"
              defaultValue={new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 10)}
            />
          </Example5StateCard>
          <Example5StateCard label="Disabled">
            <Ex5Calendar disabled defaultValue={anchorDate} />
          </Example5StateCard>
          <Example5StateCard label="Read only">
            <Ex5Field label="확정 일정" hint="조회만 가능">
              <Ex5Calendar readOnly value={new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 18)} />
            </Ex5Field>
          </Example5StateCard>
        </div>
      </Example5ShowcaseSection>
    </Example5ShowcaseShell>
  );
}
