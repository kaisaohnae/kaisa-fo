import Example2PageHeader from './example2-page-header';

const SETTINGS_GROUPS = [
  {
    title: '충전 운영',
    items: [
      {label: '최대 충전 시간', value: '120분'},
      {label: '유휴 점유 알림', value: '30분 후'},
      {label: '예약 선점', value: '15분'},
    ],
  },
  {
    title: '결제 · 요금',
    items: [
      {label: '기본 단가', value: '600원/kWh'},
      {label: '회원 할인', value: '5%'},
      {label: '미수금 알림', value: '3일 후 SMS'},
    ],
  },
  {
    title: '알림',
    items: [
      {label: '충전 완료', value: '앱 푸시 + SMS'},
      {label: '고장 감지', value: '관리자 즉시 알림'},
      {label: '피크 부하', value: 'Slack 웹훅'},
    ],
  },
];

export default function Example2SettingsPage() {
  return (
    <>
      <Example2PageHeader
        title="설정"
        description="충전소 운영 · 요금 · 알림"
        actions={
          <button type="button" className="ex2-btn ex2-btn--primary">
            저장
          </button>
        }
      />
      <section className="ex2-settings">
        {SETTINGS_GROUPS.map((group) => (
          <article key={group.title} className="ex2-panel ex2-settings__group">
            <div className="ex2-panel__head ex2-panel__head--compact">
              <div>
                <h2>{group.title}</h2>
              </div>
            </div>
            <dl className="ex2-settings__list">
              {group.items.map((item) => (
                <div key={item.label} className="ex2-settings__row">
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
