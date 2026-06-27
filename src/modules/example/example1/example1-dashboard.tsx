import {ACTIVITIES, CHART_BARS, NAV_ITEMS, RECENT_ORDERS, STATS} from './data';

export default function Example1Dashboard() {
  return (
    <div className="ex1">
      <aside className="ex1-sidebar">
        <div className="ex1-sidebar__brand">
          <span className="ex1-sidebar__logo">K</span>
          <div>
            <strong>Admin Panel</strong>
            <span>example1</span>
          </div>
        </div>

        <nav className="ex1-sidebar__nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.active ? 'ex1-sidebar__link ex1-sidebar__link--active' : 'ex1-sidebar__link'}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="ex1-main">
        <header className="ex1-topbar">
          <div>
            <p className="ex1-topbar__label">Overview</p>
            <h1 className="ex1-topbar__title">Dashboard</h1>
          </div>
          <div className="ex1-topbar__actions">
            <button type="button" className="ex1-btn ex1-btn--ghost">
              Export
            </button>
            <button type="button" className="ex1-btn ex1-btn--primary">
              New Report
            </button>
          </div>
        </header>

        <section className="ex1-stats">
          {STATS.map((stat) => (
            <article key={stat.id} className="ex1-stat">
              <span className="ex1-stat__label">{stat.label}</span>
              <strong className="ex1-stat__value">{stat.value}</strong>
              <span className={stat.up ? 'ex1-stat__change ex1-stat__change--up' : 'ex1-stat__change ex1-stat__change--down'}>
                {stat.change}
              </span>
            </article>
          ))}
        </section>

        <section className="ex1-grid">
          <article className="ex1-panel ex1-panel--chart">
            <div className="ex1-panel__head">
              <h2>Weekly Traffic</h2>
              <span>Last 7 days</span>
            </div>
            <div className="ex1-chart">
              {CHART_BARS.map((bar) => (
                <div key={bar.label} className="ex1-chart__col">
                  <div className="ex1-chart__bar-wrap">
                    <div className="ex1-chart__bar" style={{height: `${bar.value}%`}} />
                  </div>
                  <span>{bar.label}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="ex1-panel">
            <div className="ex1-panel__head">
              <h2>Recent Activity</h2>
              <span>Live feed</span>
            </div>
            <ul className="ex1-activity">
              {ACTIVITIES.map((item) => (
                <li key={item.id} className={`ex1-activity__item ex1-activity__item--${item.status}`}>
                  <div>
                    <strong>{item.user}</strong>
                    <p>{item.action}</p>
                  </div>
                  <time>{item.time}</time>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="ex1-panel ex1-panel--table">
          <div className="ex1-panel__head">
            <h2>Recent Orders</h2>
            <span>Sample data</span>
          </div>
          <div className="ex1-table-wrap">
            <table className="ex1-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.amount}</td>
                    <td>
                      <span className={`ex1-badge ex1-badge--${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
