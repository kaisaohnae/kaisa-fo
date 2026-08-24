import Example1PageHeader from './example1-page-header';

const SETTINGS_GROUPS = [
  {
    title: '운영 시간',
    items: [
      {label: '체크인', value: '15:00'},
      {label: '체크아웃', value: '11:00'},
      {label: '늦은 체크인', value: '21:00까지'},
    ],
  },
  {
    title: '예약 정책',
    items: [
      {label: '최소 숙박', value: '1박'},
      {label: '당일 예약', value: '허용'},
      {label: '취소 수수료', value: '3일 전 100% 환불'},
    ],
  },
  {
    title: '알림',
    items: [
      {label: '신규 예약', value: '카카오 알림톡'},
      {label: '체크인 당일', value: 'SMS + 이메일'},
      {label: '리뷰 요청', value: '체크아웃 2시간 후'},
    ],
  },
];

export default function Example1SettingsPage() {
  return (
    <>
      <Example1PageHeader
        title="설정"
        description="펜션 운영 · 예약 · 알림 설정"
        actions={
          <button type="button" className="ex1-btn ex1-btn--primary">
            저장
          </button>
        }
      />
      <section className="ex1-settings">
        {SETTINGS_GROUPS.map((group) => (
          <article key={group.title} className="ex1-panel ex1-settings__group">
            <div className="ex1-panel__head ex1-panel__head--compact">
              <div>
                <h2>{group.title}</h2>
              </div>
            </div>
            <dl className="ex1-settings__list">
              {group.items.map((item) => (
                <div key={item.label} className="ex1-settings__row">
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </section>
    </>
  );
}
