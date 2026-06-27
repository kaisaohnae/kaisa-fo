export const CALENDAR_BOOKED_DAYS = [2, 5, 8, 12, 15, 18, 21, 24, 26, 27, 28, 30];

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

type CalendarCell = {
  day: number | null;
  isToday: boolean;
  isBooked: boolean;
  isSunday: boolean;
  isSaturday: boolean;
};

function buildMonthCells(year: number, month: number, bookedDays: number[]): CalendarCell[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const cells: CalendarCell[] = [];

  for (let i = 0; i < firstDay; i += 1) {
    cells.push({day: null, isToday: false, isBooked: false, isSunday: false, isSaturday: false});
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const weekday = date.getDay();
    cells.push({
      day,
      isToday:
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === day,
      isBooked: bookedDays.includes(day),
      isSunday: weekday === 0,
      isSaturday: weekday === 6,
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({day: null, isToday: false, isBooked: false, isSunday: false, isSaturday: false});
  }

  return cells;
}

export default function Example1Calendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const cells = buildMonthCells(year, month, CALENDAR_BOOKED_DAYS);
  const bookedCount = CALENDAR_BOOKED_DAYS.length;

  return (
    <div className="ex1-calendar">
      <div className="ex1-calendar__head">
        <h2 className="ex1-calendar__title">
          {year}년 {month + 1}월(예약 {bookedCount}일)
        </h2>
        <span className="ex1-calendar__legend">
          <i className="ex1-calendar__dot ex1-calendar__dot--booked" />
          예약일
        </span>
      </div>

      <div className="ex1-calendar__weekdays">
        {WEEKDAYS.map((label, index) => (
          <span
            key={label}
            className={
              index === 0
                ? 'ex1-calendar__weekday ex1-calendar__weekday--sun'
                : index === 6
                  ? 'ex1-calendar__weekday ex1-calendar__weekday--sat'
                  : 'ex1-calendar__weekday'
            }
          >
            {label}
          </span>
        ))}
      </div>

      <div className="ex1-calendar__grid">
        {cells.map((cell, index) => {
          if (cell.day === null) {
            return <span key={`empty-${index}`} className="ex1-calendar__day ex1-calendar__day--empty" />;
          }

          const classNames = [
            'ex1-calendar__day',
            cell.isToday && 'ex1-calendar__day--today',
            cell.isBooked && 'ex1-calendar__day--booked',
            cell.isSunday && 'ex1-calendar__day--sun',
            cell.isSaturday && 'ex1-calendar__day--sat',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <span key={cell.day} className={classNames}>
              {cell.day}
            </span>
          );
        })}
      </div>
    </div>
  );
}
