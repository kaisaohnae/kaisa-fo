import {ISSUES} from './data';

export default function Example4Issues() {
  return (
    <ul className="ex4-issues" aria-label="운영 이슈">
      {ISSUES.map((issue) => (
        <li key={issue.id} className={`ex4-issue ex4-issue--${issue.tone}`}>
          <span className="ex4-issue__dot" />
          {issue.text}
        </li>
      ))}
    </ul>
  );
}
