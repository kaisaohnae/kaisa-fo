export const STATION_NAME = '충전소 관리 Example2';

export const STATS = [
  {id: 'active', label: '충전 중', value: '8대', note: '초급속 3 · 급속 5', tone: 'success'},
  {id: 'available', label: '사용 가능', value: '6대', note: '대기 중 충전기', tone: 'info'},
  {id: 'utilization', label: '금일 가동률', value: '74%', note: '전일 대비 +8%', tone: 'accent'},
  {id: 'revenue', label: '오늘 매출', value: '186만', note: '목표 대비 88%', tone: 'neutral'},
];

export const ENERGY_BARS = [
  {label: '08', value: 48},
  {label: '10', value: 61},
  {label: '12', value: 74},
  {label: '14', value: 68},
  {label: '16', value: 82},
  {label: '18', value: 91},
  {label: '20', value: 56},
];

export type ChargerStatus = 'charging' | 'available' | 'offline' | 'error' | 'reserved';

export const CHARGERS = [
  {id: 'A-01', name: '초급속 #1', type: '350kW · CCS1', status: 'charging' as ChargerStatus, vehicle: '현대 IONIQ 6', detail: 'SOC 68% · 24분 남음'},
  {id: 'A-02', name: '초급속 #2', type: '350kW · CCS1', status: 'charging' as ChargerStatus, vehicle: '기아 EV6', detail: 'SOC 42% · 38분 남음'},
  {id: 'B-01', name: '급속 #1', type: '100kW · CCS2', status: 'available' as ChargerStatus, vehicle: null, detail: null},
  {id: 'B-02', name: '급속 #2', type: '100kW · CCS2', status: 'charging' as ChargerStatus, vehicle: '테슬라 Model 3', detail: 'SOC 81% · 12분 남음'},
  {id: 'B-03', name: '급속 #3', type: '100kW · CHAdeMO', status: 'reserved' as ChargerStatus, vehicle: '예약 · 17:30', detail: '회원 M-2041'},
  {id: 'C-01', name: '완속 #1', type: '7kW · AC', status: 'charging' as ChargerStatus, vehicle: 'BMW i4', detail: 'SOC 91% · 1시간 10분'},
];

export const CHARGER_STATUS_LABEL: Record<ChargerStatus, string> = {
  charging: '충전 중',
  available: '대기',
  offline: '오프라인',
  error: '점검 필요',
  reserved: '예약됨',
};

export const CHARGER_STATUS_COLORS: Record<ChargerStatus, string> = {
  charging: '#06d6a0',
  available: '#0096c7',
  offline: '#94a3b8',
  error: '#ef476f',
  reserved: '#ffd166',
};

export type LiveEventType = 'start' | 'end' | 'alert';

export const LIVE_EVENTS: Array<{
  id: number;
  type: LiveEventType;
  time: string;
  charger: string;
  vehicle: string;
  note: string;
}> = [
  {id: 1, type: 'start', time: '17:02', charger: 'A-01 초급속', vehicle: '12가 3456', note: '회원 충전 시작'},
  {id: 2, type: 'end', time: '16:48', charger: 'B-04 급속', vehicle: '34나 7890', note: '충전 완료 · 38.2kWh'},
  {id: 3, type: 'alert', time: '16:30', charger: 'C-02 완속', vehicle: '-', note: '통신 지연 감지'},
  {id: 4, type: 'start', time: '16:15', charger: 'A-02 초급속', vehicle: '56다 1122', note: 'QR 인증 완료'},
  {id: 5, type: 'end', time: '15:58', charger: 'B-01 급속', vehicle: '78라 3344', note: '충전 완료 · 22.7kWh'},
];

export type Session = {
  id: string;
  member: string;
  vehicle: string;
  charger: string;
  kwh: number;
  amount: string;
  connector: string;
  status: string;
  startAt: string;
  endAt: string;
};

export type ChargerItem = {
  id: string;
  name: string;
  type: string;
  powerKw: number;
  connector: string;
  unitPrice: number;
  status: ChargerStatus;
};

export const SESSIONS: Session[] = [
  {id: 'E-20260627-01', member: '김전기', vehicle: '12가 3456', charger: 'A-01 초급속', kwh: 42.5, amount: '38,250', connector: 'CCS1', status: 'charging', startAt: '2026-06-27 17:02', endAt: '-'},
  {id: 'E-20260627-02', member: '박충전', vehicle: '34나 7890', charger: 'B-02 급속', kwh: 38.2, amount: '22,920', connector: 'CCS2', status: 'completed', startAt: '2026-06-27 15:40', endAt: '2026-06-27 16:48'},
  {id: 'E-20260627-03', member: '이볼트', vehicle: '56다 1122', charger: 'A-02 초급속', kwh: 51.0, amount: '45,900', connector: 'CCS1', status: 'charging', startAt: '2026-06-27 16:15', endAt: '-'},
  {id: 'E-20260626-08', member: '최EV', vehicle: '78라 3344', charger: 'B-01 급속', kwh: 22.7, amount: '13,620', connector: 'CCS2', status: 'completed', startAt: '2026-06-26 14:20', endAt: '2026-06-26 15:58'},
  {id: 'E-20260626-05', member: '정주행', vehicle: '90마 5566', charger: 'C-01 완속', kwh: 18.4, amount: '4,968', connector: 'AC', status: 'charging', startAt: '2026-06-26 13:00', endAt: '-'},
  {id: 'E-20260625-03', member: '한플러그', vehicle: '11바 7788', charger: 'B-03 급속', kwh: 0, amount: '0', connector: 'CHAdeMO', status: 'reserved', startAt: '2026-06-27 17:30', endAt: '-'},
  {id: 'E-20260624-11', member: '오파워', vehicle: '22사 9900', charger: 'A-03 초급속', kwh: 44.1, amount: '39,690', connector: 'CCS1', status: 'completed', startAt: '2026-06-24 11:10', endAt: '2026-06-24 11:52'},
  {id: 'E-20260623-04', member: '윤초급', vehicle: '33아 1234', charger: 'B-04 급속', kwh: 29.6, amount: '17,760', connector: 'CCS2', status: 'cancelled', startAt: '2026-06-23 09:00', endAt: '2026-06-23 09:05'},
  {id: 'E-20260622-07', member: '강완속', vehicle: '44자 5678', charger: 'C-02 완속', kwh: 12.3, amount: '3,321', connector: 'AC', status: 'completed', startAt: '2026-06-22 20:00', endAt: '2026-06-23 02:10'},
  {id: 'E-20260621-02', member: '임주차', vehicle: '55차 9012', charger: 'B-05 급속', kwh: 35.8, amount: '21,480', connector: 'CCS2', status: 'completed', startAt: '2026-06-21 18:30', endAt: '2026-06-21 19:25'},
  {id: 'E-20260620-09', member: '서급속', vehicle: '66카 3456', charger: 'A-01 초급속', kwh: 48.0, amount: '43,200', connector: 'CCS1', status: 'completed', startAt: '2026-06-20 12:00', endAt: '2026-06-20 12:44'},
  {id: 'E-20260619-06', member: '문충전', vehicle: '77타 7890', charger: 'B-06 급속', kwh: 26.4, amount: '15,840', connector: 'CHAdeMO', status: 'pending', startAt: '2026-06-28 10:00', endAt: '-'},
];

export const CHARGER_INVENTORY: ChargerItem[] = [
  {id: 'A-01', name: '초급속 #1', type: '350kW · CCS1', powerKw: 350, connector: 'CCS1', unitPrice: 900, status: 'charging'},
  {id: 'A-02', name: '초급속 #2', type: '350kW · CCS1', powerKw: 350, connector: 'CCS1', unitPrice: 900, status: 'charging'},
  {id: 'A-03', name: '초급속 #3', type: '350kW · CCS1', powerKw: 350, connector: 'CCS1', unitPrice: 900, status: 'available'},
  {id: 'B-01', name: '급속 #1', type: '100kW · CCS2', powerKw: 100, connector: 'CCS2', unitPrice: 600, status: 'available'},
  {id: 'B-02', name: '급속 #2', type: '100kW · CCS2', powerKw: 100, connector: 'CCS2', unitPrice: 600, status: 'charging'},
  {id: 'B-03', name: '급속 #3', type: '100kW · CHAdeMO', powerKw: 100, connector: 'CHAdeMO', unitPrice: 620, status: 'reserved'},
  {id: 'C-01', name: '완속 #1', type: '7kW · AC', powerKw: 7, connector: 'AC', unitPrice: 270, status: 'charging'},
  {id: 'C-02', name: '완속 #2', type: '7kW · AC', powerKw: 7, connector: 'AC', unitPrice: 270, status: 'offline'},
];

export const CHARGER_STATUS_BREAKDOWN = (
  ['charging', 'available', 'reserved', 'offline'] as ChargerStatus[]
).map((status) => ({
  status,
  label: CHARGER_STATUS_LABEL[status],
  count: CHARGER_INVENTORY.filter((item) => item.status === status).length,
  color: CHARGER_STATUS_COLORS[status],
}));

export const CHARGER_STATUS_TOTAL = CHARGER_INVENTORY.length;

export const CHARGER_TYPE_ERROR_RATE = [
  {label: '초급속', value: 0.6, incidents: 2, note: '최근 30일 · 3기'},
  {label: '급속', value: 1.1, incidents: 4, note: '최근 30일 · 3기'},
  {label: '완속', value: 2.4, incidents: 3, note: '최근 30일 · 2기'},
];

export const OCPP_VERSION_SHARE = [
  {label: 'OCPP 1.6', version: '1.6', count: 5, color: '#0096c7'},
  {label: 'OCPP 2.0.1', version: '2.0.1', count: 3, color: '#023e8a'},
];

export const REVENUE_REPORT_ROWS = [
  {month: '2025-07', sessions: 842, kwh: 18420, revenue: 12840000, avgKwh: 21.9, utilization: 62},
  {month: '2025-08', sessions: 910, kwh: 20150, revenue: 14280000, avgKwh: 22.1, utilization: 68},
  {month: '2025-09', sessions: 788, kwh: 17280, revenue: 11960000, avgKwh: 21.9, utilization: 59},
  {month: '2025-10', sessions: 820, kwh: 17840, revenue: 12420000, avgKwh: 21.8, utilization: 61},
  {month: '2025-11', sessions: 760, kwh: 16420, revenue: 11380000, avgKwh: 21.6, utilization: 57},
  {month: '2025-12', sessions: 702, kwh: 15100, revenue: 10450000, avgKwh: 21.5, utilization: 52},
  {month: '2026-01', sessions: 680, kwh: 14680, revenue: 10120000, avgKwh: 21.6, utilization: 51},
  {month: '2026-02', sessions: 710, kwh: 15320, revenue: 10640000, avgKwh: 21.6, utilization: 53},
  {month: '2026-03', sessions: 780, kwh: 16940, revenue: 11860000, avgKwh: 21.7, utilization: 58},
  {month: '2026-04', sessions: 830, kwh: 18120, revenue: 12740000, avgKwh: 21.8, utilization: 62},
  {month: '2026-05', sessions: 880, kwh: 19380, revenue: 13680000, avgKwh: 22.0, utilization: 66},
  {month: '2026-06', sessions: 902, kwh: 19860, revenue: 14020000, avgKwh: 22.0, utilization: 68},
];

export const SESSION_STATUS_LABEL: Record<string, string> = {
  charging: '충전 중',
  completed: '완료',
  reserved: '예약',
  pending: '대기',
  cancelled: '취소',
};

export const REVENUE_SUMMARY = {
  total: '1.52억',
  average: '1,267만',
  growth: '+14.2%',
};

export const ENERGY_HISTORY = [
  {label: '1월', value: 14680},
  {label: '2월', value: 15320},
  {label: '3월', value: 16940},
  {label: '4월', value: 18120},
  {label: '5월', value: 19380},
  {label: '6월', value: 19860},
  {label: '7월', value: 18420},
  {label: '8월', value: 20150},
  {label: '9월', value: 17280},
  {label: '10월', value: 17840},
  {label: '11월', value: 16420},
  {label: '12월', value: 15100},
];

export const CONNECTOR_SHARE = [
  {label: 'CCS1', value: 38, color: '#0096c7'},
  {label: 'CCS2', value: 34, color: '#48cae4'},
  {label: 'CHAdeMO', value: 14, color: '#90e0ef'},
  {label: 'AC', value: 14, color: '#ade8f4'},
];

export const TIME_SLOT_USAGE = [
  {label: '새벽', value: 12},
  {label: '오전', value: 28},
  {label: '점심', value: 22},
  {label: '오후', value: 48},
  {label: '저녁', value: 74},
  {label: '심야', value: 18},
];

export function createSession(idSuffix = Date.now()): Session {
  return {
    id: `E-${idSuffix}`,
    member: '신규 회원',
    vehicle: '00가 0000',
    charger: 'B-01 급속',
    kwh: 0,
    amount: '0',
    connector: 'CCS2',
    status: 'pending',
    startAt: '2026-06-27 18:00',
    endAt: '-',
  };
}

export function createChargerItem(idSuffix = Date.now()): ChargerItem {
  return {
    id: `X-${idSuffix}`,
    name: '신규 충전기',
    type: '100kW · CCS2',
    powerKw: 100,
    connector: 'CCS2',
    unitPrice: 600,
    status: 'available',
  };
}
