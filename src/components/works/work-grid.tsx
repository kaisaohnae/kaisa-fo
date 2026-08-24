'use client';

type WorkItem = {
  title: string;
  date: string;
  link?: string;
  skil: string;
  url: string;
};

type WorkGridProps = {
  items: WorkItem[];
  showIndex?: boolean;
  className?: string;
};

export default function WorkGrid({items, showIndex = true, className = ''}: WorkGridProps) {
  return (
    <ul className={`work-grid ${className}`.trim()}>
      {items.map((item, idx) => {
        const content = (
          <>
            <div className="work-grid__media">
              <img src={item.url} alt={item.title} loading="lazy" />
              {/* <div className="work-grid__overlay">
                <span className="work-grid__view">View Project</span>
              </div> */}
            </div>
            <div className="work-grid__info">
              {showIndex && (
                <span className="work-grid__index">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              )}
              <div className="work-grid__meta">
                <h3 className="work-grid__title">{item.title}</h3>
                <p className="work-grid__date">{item.date}</p>
              </div>
              {/* <p className="work-grid__skills">{item.skil}</p> */}
            </div>
          </>
        );

        return (
          <li key={`${item.title}-${idx}`} className="work-grid__item">
            {/* {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="work-grid__link"
              >
                {content}
              </a>
            ) : ( */}
              <div className="work-grid__link">{content}</div>
            {/* )} */}
          </li>
        );
      })}
    </ul>
  );
}
