'use client';

import {useState} from 'react';
import {Ex3Calendar, Ex3Field} from './kit';
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

export default function Example3CalendarPage() {
  const [anchorDate] = useState(() => DEMO_ANCHOR);
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => DEMO_ANCHOR);
  const markedDates = buildMarkedDates(anchorDate.getFullYear(), anchorDate.getMonth());

  const minDate = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1);
  const maxDate = new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 0);

  return (
    <Example3ShowcaseShell
      title="Calendar"
      description="month nav · selection · marked · min/max · disabled · readOnly"
    >
      <Example3ShowcaseSection title="Basic" description="월 이동 · 날짜 선택 · 오늘 표시">
        <div className="ex3-state-grid ex3-state-grid--calendar">
          <Example3StateCard label="Default">
            <Ex3Field label="일정 날짜" hint="날짜를 클릭해 선택">
              <Ex3Calendar value={selectedDate} onChange={setSelectedDate} />
            </Ex3Field>
          </Example3StateCard>
          <Example3StateCard label="With legend">
            <Ex3Calendar
              showLegend
              legendLabel="예약일"
              markedDates={markedDates}
              defaultValue={new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 12)}
            />
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Size" description="sm · md · lg">
        <div className="ex3-state-grid ex3-state-grid--calendar">
          <Example3StateCard label="Small">
            <Ex3Calendar uiSize="sm" defaultValue={anchorDate} />
          </Example3StateCard>
          <Example3StateCard label="Medium">
            <Ex3Calendar uiSize="md" defaultValue={anchorDate} />
          </Example3StateCard>
          <Example3StateCard label="Large">
            <Ex3Calendar uiSize="lg" defaultValue={anchorDate} />
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="Marked tone" description="accent · muted · danger">
        <div className="ex3-state-grid ex3-state-grid--calendar">
          <Example3StateCard label="Accent">
            <Ex3Calendar
              markedDates={[
                {date: new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 5), tone: 'accent'},
                {date: new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 12), tone: 'accent'},
              ]}
              defaultValue={new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 5)}
            />
          </Example3StateCard>
          <Example3StateCard label="Muted">
            <Ex3Calendar
              markedDates={[
                {date: new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 8), tone: 'muted'},
                {date: new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 16), tone: 'muted'},
              ]}
              defaultValue={new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 8)}
            />
          </Example3StateCard>
          <Example3StateCard label="Danger">
            <Ex3Calendar
              markedDates={[
                {date: new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 20), tone: 'danger'},
                {date: new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 21), tone: 'danger'},
              ]}
              defaultValue={new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 20)}
            />
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>

      <Example3ShowcaseSection title="State" description="min/max · disabled dates · disabled · readOnly">
        <div className="ex3-state-grid ex3-state-grid--calendar">
          <Example3StateCard label="Min / Max">
            <Ex3Field label="이번 달만 선택" hint={`${minDate.getDate()}일 ~ ${maxDate.getDate()}일`}>
              <Ex3Calendar minDate={minDate} maxDate={maxDate} defaultValue={anchorDate} />
            </Ex3Field>
          </Example3StateCard>
          <Example3StateCard label="Disabled dates">
            <Ex3Calendar
              disabledDates={markedDates.map((item) => item.date)}
              showLegend
              legendLabel="예약 마감"
              defaultValue={new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 10)}
            />
          </Example3StateCard>
          <Example3StateCard label="Disabled">
            <Ex3Calendar disabled defaultValue={anchorDate} />
          </Example3StateCard>
          <Example3StateCard label="Read only">
            <Ex3Field label="확정 일정" hint="조회만 가능">
              <Ex3Calendar readOnly value={new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 18)} />
            </Ex3Field>
          </Example3StateCard>
        </div>
      </Example3ShowcaseSection>
    </Example3ShowcaseShell>
  );
}
