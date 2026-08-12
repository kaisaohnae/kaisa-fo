export const COMPANY = '세진로지스';
export const SITE_LABEL = '인천센터';
export const PERIOD_LABEL = '2026년 8월 2주';

export const PERIOD_OPTIONS = [
  {id: 'today', label: '오늘'},
  {id: 'week', label: '이번 주'},
  {id: 'month', label: '8월'},
] as const;

export const CENTER_OPTIONS = [
  {id: 'incheon', label: '인천'},
  {id: 'all', label: '전 센터'},
] as const;

export type PeriodId = (typeof PERIOD_OPTIONS)[number]['id'];
export type CenterId = (typeof CENTER_OPTIONS)[number]['id'];

export const OVERVIEW_BY_PERIOD: Record<
  PeriodId,
  {
    kicker: string;
    stats: Array<{
      id: string;
      label: string;
      value: string;
      unit: string;
      delta: string;
      up: boolean;
      spark: number[];
    }>;
  }
> = {
  today: {
    kicker: '오늘 07:00 기준',
    stats: [
      {id: 'in', label: '입고', value: '1,284', unit: 'PLT', delta: '+7.4%', up: true, spark: [980, 1120, 1080, 1260, 1190, 1310, 1284]},
      {id: 'out', label: '출고', value: '1,172', unit: 'PLT', delta: '+7.7%', up: true, spark: [910, 1040, 1210, 1180, 1090, 1240, 1172]},
      {id: 'stock', label: '잔여', value: '8,640', unit: 'PLT', delta: '-1.2%', up: false, spark: [8920, 8840, 8710, 8600, 8580, 8690, 8640]},
      {id: 'delay', label: '지연', value: '9', unit: '건', delta: '-5건', up: true, spark: [14, 12, 11, 13, 10, 11, 9]},
    ],
  },
  week: {
    kicker: '8/5 — 8/11',
    stats: [
      {id: 'in', label: '입고', value: '7,554', unit: 'PLT', delta: '+4.1%', up: true, spark: [1080, 1260, 1190, 740, 610, 1310, 1284]},
      {id: 'out', label: '출고', value: '7,162', unit: 'PLT', delta: '+3.8%', up: true, spark: [1210, 1180, 1090, 680, 590, 1240, 1172]},
      {id: 'stock', label: '잔여', value: '8,640', unit: 'PLT', delta: '+0.4%', up: true, spark: [8420, 8510, 8600, 8810, 8900, 8720, 8640]},
      {id: 'delay', label: '지연', value: '31', unit: '건', delta: '-8건', up: true, spark: [9, 6, 4, 2, 1, 5, 4]},
    ],
  },
  month: {
    kicker: '2026년 8월',
    stats: [
      {id: 'in', label: '입고', value: '18,420', unit: 'PLT', delta: '+6.2%', up: true, spark: [14200, 15110, 15840, 16420, 17100, 17880, 18420]},
      {id: 'out', label: '출고', value: '17,110', unit: 'PLT', delta: '+5.4%', up: true, spark: [13100, 13940, 14620, 15280, 16010, 16640, 17110]},
      {id: 'stock', label: '잔여', value: '8,640', unit: 'PLT', delta: '-3.1%', up: false, spark: [9100, 8980, 8890, 8810, 8740, 8680, 8640]},
      {id: 'delay', label: '지연', value: '64', unit: '건', delta: '-11건', up: true, spark: [18, 16, 12, 9, 8, 7, 6]},
    ],
  },
};

export const ISSUES = [
  {id: 'd5', tone: 'hold' as const, text: 'D5 도크 보수 · 14:00까지'},
  {id: 'delay', tone: 'warn' as const, text: '인천 → 부산 3건 지연'},
  {id: 'cold', tone: 'info' as const, text: '남양식품 냉장 도크 우선'},
];

export const INBOUND_OUTBOUND = [
  {day: '8/3', in: 980, out: 910},
  {day: '8/4', in: 1120, out: 1040},
  {day: '8/5', in: 1080, out: 1210},
  {day: '8/6', in: 1260, out: 1180},
  {day: '8/7', in: 1190, out: 1090},
  {day: '8/8', in: 740, out: 680},
  {day: '8/9', in: 610, out: 590},
  {day: '8/10', in: 1310, out: 1240},
  {day: '8/11', in: 1284, out: 1172},
];

export const CENTER_STOCK = [
  {center: '인천', stock: 8640},
  {center: '평택', stock: 5120},
  {center: '광주', stock: 2980},
  {center: '대구', stock: 1740},
];

export const DELAY_ROWS = [
  {id: 'DN-1842', route: '인천 → 부산', reason: '도크 대기', eta: '14:40'},
  {id: 'DN-1851', route: '평택 → 광주', reason: '차량 교체', eta: '16:10'},
  {id: 'DN-1860', route: '인천 → 대구', reason: '상차 지연', eta: '17:20'},
];

export const OCCUPANCY_TREND = [
  {day: '8/3', rate: 68},
  {day: '8/4', rate: 71},
  {day: '8/5', rate: 74},
  {day: '8/6', rate: 79},
  {day: '8/7', rate: 76},
  {day: '8/8', rate: 58},
  {day: '8/9', rate: 54},
  {day: '8/10', rate: 73},
  {day: '8/11', rate: 72},
];

export const DELAY_REASONS = [
  {name: '도크 대기', value: 4},
  {name: '상차 지연', value: 3},
  {name: '차량 교체', value: 1},
  {name: '기상', value: 1},
];

export const CENTER_RADAR = [
  {metric: '입고', 인천: 88, 평택: 72, 광주: 64},
  {metric: '출고', 인천: 84, 평택: 70, 광주: 68},
  {metric: '점유', 인천: 72, 평택: 61, 광주: 54},
  {metric: '정시', 인천: 96, 평택: 94, 광주: 91},
];

export const STOCK_TREEMAP = [
  {name: '인천·철강', size: 3200},
  {name: '인천·전자', size: 2400},
  {name: '인천·식품', size: 1800},
  {name: '평택·철강', size: 2100},
  {name: '평택·전자', size: 1600},
  {name: '광주·식품', size: 980},
  {name: '기타', size: 1540},
];

export const MONTHLY_SHIPPING = [
  {month: '3월', ton: 1840, ontime: 93},
  {month: '4월', ton: 1920, ontime: 94},
  {month: '5월', ton: 2110, ontime: 92},
  {month: '6월', ton: 1980, ontime: 95},
  {month: '7월', ton: 2240, ontime: 96},
  {month: '8월', ton: 1180, ontime: 97},
];

export const ROUTE_ROWS = [
  {route: '인천 → 부산', trips: 86, ton: 412, ontime: 98},
  {route: '인천 → 광주', trips: 54, ton: 268, ontime: 96},
  {route: '평택 → 대구', trips: 41, ton: 190, ontime: 94},
  {route: '광주 → 부산', trips: 28, ton: 132, ontime: 97},
];

export const DISPATCH_FUNNEL = [
  {name: '배차 요청', value: 248},
  {name: '확정', value: 231},
  {name: '상차', value: 218},
  {name: '도착', value: 209},
];

export const SALES_GOALS = [
  {label: '운송량', actual: 1180, goal: 1100, unit: '톤'},
  {label: '정시율', actual: 97, goal: 95, unit: '%'},
  {label: '배차', actual: 209, goal: 200, unit: '회'},
];

export const DISPATCH_HEAT_HOURS = ['06', '08', '10', '12', '14', '16', '18', '20'];
export const DISPATCH_HEAT_DAYS = ['월', '화', '수', '목', '금'];
export const DISPATCH_HEAT_VALUES = [
  [18, 32, 48, 40, 52, 50, 28, 12],
  [22, 38, 55, 44, 58, 54, 31, 14],
  [16, 30, 42, 36, 48, 46, 24, 10],
  [24, 40, 60, 50, 62, 58, 34, 16],
  [26, 44, 64, 52, 66, 60, 36, 18],
];

export const SALES_COMPARE = [
  {label: '운송량', value: '1,180', unit: '톤', delta: '+12.8%', up: true, note: '7월 동기간'},
  {label: '정시율', value: '97', unit: '%', delta: '+1.0%p', up: true, note: '7월 96%'},
  {label: '배차', value: '209', unit: '회', delta: '+8회', up: true, note: '7월 동기간'},
  {label: '클레임', value: '2', unit: '건', delta: '-1건', up: true, note: '7월 3건'},
];

export const DOCK_HOURS = ['06', '08', '10', '12', '14', '16', '18', '20'];

export const DOCK_IN = [42, 68, 86, 74, 91, 88, 63, 28];
export const DOCK_OUT = [31, 54, 79, 82, 84, 90, 71, 36];

export type DockStatus = 'busy' | 'idle' | 'hold';

export const DOCKS: Array<{id: string; status: DockStatus; note: string}> = [
  {id: 'D1', status: 'busy', note: '한진철강 · 상차'},
  {id: 'D2', status: 'busy', note: '동아전자 · 하차'},
  {id: 'D3', status: 'idle', note: '대기'},
  {id: 'D4', status: 'busy', note: '남양식품 · 상차'},
  {id: 'D5', status: 'hold', note: '도크 보수'},
  {id: 'D6', status: 'idle', note: '대기'},
  {id: 'D7', status: 'busy', note: '코튼하우스 · 하차'},
  {id: 'D8', status: 'busy', note: '한진철강 · 하차'},
];

export const DOCK_STATUS_LABEL: Record<DockStatus, string> = {
  busy: '사용',
  idle: '대기',
  hold: '점검',
};

export const WEEKLY_UTIL = [
  {day: '8/5', rate: 71},
  {day: '8/6', rate: 78},
  {day: '8/7', rate: 74},
  {day: '8/8', rate: 46},
  {day: '8/9', rate: 41},
  {day: '8/10', rate: 82},
  {day: '8/11', rate: 79},
];

export const DOCK_STATUS_SHARE = [
  {label: '사용', value: 5},
  {label: '대기', value: 2},
  {label: '점검', value: 1},
];

export const WEEKDAY_PEAK = {
  labels: ['월', '화', '수', '목', '금'],
  inbound: [78, 82, 70, 88, 91],
  outbound: [72, 80, 74, 86, 84],
};

export const DOCK_SCATTER = [
  {id: 'D1', util: 86, trucks: 14},
  {id: 'D2', util: 78, trucks: 12},
  {id: 'D3', util: 22, trucks: 3},
  {id: 'D4', util: 81, trucks: 11},
  {id: 'D5', util: 0, trucks: 0},
  {id: 'D6', util: 18, trucks: 2},
  {id: 'D7', util: 74, trucks: 10},
  {id: 'D8', util: 88, trucks: 15},
];

export const SHIPPER_FILTERS = [
  {id: 'all', label: '전체'},
  {id: '한진철강', label: '한진철강'},
  {id: '동아전자', label: '동아전자'},
  {id: '남양식품', label: '남양식품'},
  {id: '코튼하우스', label: '코튼하우스'},
  {id: '기타', label: '기타'},
] as const;

export const CATEGORY_FILTERS = [
  {id: 'all', label: '전체 품목'},
  {id: '철강', label: '철강'},
  {id: '전자', label: '전자'},
  {id: '식품', label: '식품'},
  {id: '패션', label: '패션'},
] as const;

export const SHIPPER_SHARE = [
  {id: '한진철강', label: '한진철강', value: 34, note: '인천 D1·D8 고정', category: '철강'},
  {id: '동아전자', label: '동아전자', value: 22, note: '주간 하차 집중', category: '전자'},
  {id: '남양식품', label: '남양식품', value: 18, note: '냉장 도크만', category: '식품'},
  {id: '코튼하우스', label: '코튼하우스', value: 15, note: '패션 피크 금요', category: '패션'},
  {id: '기타', label: '기타 화주', value: 11, note: '5사 합산', category: '기타'},
];

export const CATEGORY_VOLUME = [
  {category: '철강', volume: 1280},
  {category: '전자', volume: 860},
  {category: '식품', volume: 640},
  {category: '패션', volume: 410},
  {category: '기타', volume: 290},
];

export const SHIPPER_HEATMAP = [
  {id: '한진철강', data: [{x: '월', y: 48}, {x: '화', y: 52}, {x: '수', y: 41}, {x: '목', y: 55}, {x: '금', y: 61}]},
  {id: '동아전자', data: [{x: '월', y: 28}, {x: '화', y: 31}, {x: '수', y: 26}, {x: '목', y: 34}, {x: '금', y: 38}]},
  {id: '남양식품', data: [{x: '월', y: 22}, {x: '화', y: 19}, {x: '수', y: 24}, {x: '목', y: 21}, {x: '금', y: 27}]},
  {id: '코튼하우스', data: [{x: '월', y: 16}, {x: '화', y: 18}, {x: '수', y: 14}, {x: '목', y: 20}, {x: '금', y: 22}]},
];

export const SHIPPER_RADAR = [
  {metric: '물동', 한진철강: 92, 동아전자: 74, 남양식품: 61},
  {metric: '정시', 한진철강: 88, 동아전자: 90, 남양식품: 84},
  {metric: '회전', 한진철강: 70, 동아전자: 78, 남양식품: 82},
  {metric: '단가', 한진철강: 65, 동아전자: 72, 남양식품: 80},
];

export const SHIPPER_TREEMAP = {
  id: '화주',
  children: [
    {id: '한진철강', value: 34},
    {id: '동아전자', value: 22},
    {id: '남양식품', value: 18},
    {id: '코튼하우스', value: 15},
    {id: '기타', value: 11},
  ],
};

export const SHIPPER_LINE = [
  {
    id: '한진철강',
    data: [
      {x: '월', y: 48},
      {x: '화', y: 52},
      {x: '수', y: 41},
      {x: '목', y: 55},
      {x: '금', y: 61},
    ],
  },
  {
    id: '동아전자',
    data: [
      {x: '월', y: 28},
      {x: '화', y: 31},
      {x: '수', y: 26},
      {x: '목', y: 34},
      {x: '금', y: 38},
    ],
  },
  {
    id: '남양식품',
    data: [
      {x: '월', y: 22},
      {x: '화', y: 19},
      {x: '수', y: 24},
      {x: '목', y: 21},
      {x: '금', y: 27},
    ],
  },
];

export const COST_MONTHS = ['3월', '4월', '5월', '6월', '7월', '8월'];

export const COST_SERIES = {
  freight: [186, 192, 208, 198, 221, 114],
  labor: [92, 94, 96, 95, 98, 52],
  storage: [48, 51, 55, 53, 58, 31],
  other: [18, 16, 21, 19, 22, 11],
};

export const BUDGET_GAUGES = [
  {label: '운임', value: 74},
  {label: '인건', value: 61},
  {label: '보관', value: 83},
];

export const COST_DONUT = [
  {label: '운임', value: 114},
  {label: '인건', value: 52},
  {label: '보관', value: 31},
  {label: '기타', value: 11},
];

export const BUDGET_BARS = [
  {label: '운임', actual: 114, budget: 186, unit: '백만'},
  {label: '인건', actual: 52, budget: 85, unit: '백만'},
  {label: '보관', actual: 31, budget: 42, unit: '백만'},
  {label: '전체', actual: 208, budget: 420, unit: '백만'},
];

export const COST_RADAR = {
  labels: ['운임', '인건', '보관', '기타'],
  series: [
    {name: '6월', data: [72, 68, 60, 48]},
    {name: '7월', data: [68, 66, 58, 46]},
    {name: '8월', data: [74, 70, 64, 52]},
  ],
};

export const CHART_COLORS = {
  ink: '#2c4a3e',
  brown: '#8b5a2b',
  slate: '#5c6b7a',
  sand: '#a38b6d',
  steel: '#3d5a73',
  grid: '#e6e2d8',
  text: '#6f6c64',
};
