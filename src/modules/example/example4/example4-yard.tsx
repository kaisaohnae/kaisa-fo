import {DOCK_STATUS_LABEL, DOCKS} from './data';

export default function Example4Yard() {
  const north = DOCKS.slice(0, 4);
  const south = DOCKS.slice(4);

  return (
    <div className="ex4-yard">
      <p className="ex4-yard__side">북측 도크</p>
      <div className="ex4-yard__row">
        {north.map((dock) => (
          <article key={dock.id} className={`ex4-bay ex4-bay--${dock.status}`}>
            <span>{dock.id}</span>
            <small>{DOCK_STATUS_LABEL[dock.status]}</small>
          </article>
        ))}
      </div>
      <p className="ex4-yard__aisle">램프 · 통로</p>
      <div className="ex4-yard__row">
        {south.map((dock) => (
          <article key={dock.id} className={`ex4-bay ex4-bay--${dock.status}`}>
            <span>{dock.id}</span>
            <small>{DOCK_STATUS_LABEL[dock.status]}</small>
          </article>
        ))}
      </div>
      <p className="ex4-yard__side">남측 도크</p>
    </div>
  );
}
