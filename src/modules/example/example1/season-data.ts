export type SeasonGrade = 'off' | 'peak' | 'super';
export type SeasonPeriodType = 'range' | 'date';
export type SeasonQuarter = 'spring' | 'summer' | 'fall' | 'winter';

export type SeasonSetting = {
  id: string;
  name: string;
  quarter: SeasonQuarter;
  grade: SeasonGrade;
  periodType: SeasonPeriodType;
  startDate: string;
  endDate: string;
  rateMultiplier: number;
  /** 기본 요금 × 배율로 계산된 금액 */
  price: number;
  /** 직접 입력 시 배율보다 우선 적용 */
  directPrice: number | null;
  rooms: string;
  status: 'active' | 'draft';
  note: string;
};

export const SEASON_GRADE_LABEL: Record<SeasonGrade, string> = {
  off: '비수기',
  peak: '성수기',
  super: '극성수기',
};

export const SEASON_QUARTER_LABEL: Record<SeasonQuarter, string> = {
  spring: '봄',
  summer: '여름',
  fall: '가을',
  winter: '겨울',
};

export const SEASON_PERIOD_LABEL: Record<SeasonPeriodType, string> = {
  range: '기간',
  date: '특정일',
};

const BASE_RATE = 280000;

function buildSeasonRow(
  row: Omit<SeasonSetting, 'price'> & {price?: number},
): SeasonSetting {
  const price = row.price ?? Math.round(BASE_RATE * row.rateMultiplier);
  return {...row, price};
}

export const SEASON_SETTINGS: SeasonSetting[] = [
  buildSeasonRow({
    id: 'S-001',
    name: '겨울 비수기',
    quarter: 'winter',
    grade: 'off',
    periodType: 'range',
    startDate: '2026-01-06',
    endDate: '2026-02-28',
    rateMultiplier: 0.85,
    directPrice: null,
    rooms: '전체',
    status: 'active',
    note: '주중 중심 할인',
  }),
  buildSeasonRow({
    id: 'S-002',
    name: '봄 시즌',
    quarter: 'spring',
    grade: 'peak',
    periodType: 'range',
    startDate: '2026-03-20',
    endDate: '2026-05-31',
    rateMultiplier: 1.1,
    directPrice: null,
    rooms: '전체',
    status: 'active',
    note: '벚꽃 · 가족 여행',
  }),
  buildSeasonRow({
    id: 'S-003',
    name: '여름 성수기',
    quarter: 'summer',
    grade: 'peak',
    periodType: 'range',
    startDate: '2026-07-15',
    endDate: '2026-08-20',
    rateMultiplier: 1.35,
    directPrice: null,
    rooms: '전체',
    status: 'active',
    note: '바베큐 · 수영장 시즌',
  }),
  buildSeasonRow({
    id: 'S-004',
    name: '여름 극성수기',
    quarter: 'summer',
    grade: 'super',
    periodType: 'range',
    startDate: '2026-08-01',
    endDate: '2026-08-15',
    rateMultiplier: 1.55,
    directPrice: null,
    rooms: '독채 A · 독채 B',
    status: 'active',
    note: '8월 첫째·둘째 주',
  }),
  buildSeasonRow({
    id: 'S-005',
    name: '불꽃축제 특정일',
    quarter: 'summer',
    grade: 'super',
    periodType: 'date',
    startDate: '2026-08-08',
    endDate: '2026-08-08',
    rateMultiplier: 1.65,
    price: 462000,
    directPrice: 450000,
    rooms: '전체',
    status: 'active',
    note: '특정일 단일 요금',
  }),
  buildSeasonRow({
    id: 'S-006',
    name: '추석 극성수기',
    quarter: 'fall',
    grade: 'super',
    periodType: 'range',
    startDate: '2026-10-02',
    endDate: '2026-10-08',
    rateMultiplier: 1.5,
    directPrice: null,
    rooms: '전체',
    status: 'active',
    note: '연휴 3박 이상 우선',
  }),
  buildSeasonRow({
    id: 'S-007',
    name: '가을 단풍 시즌',
    quarter: 'fall',
    grade: 'peak',
    periodType: 'range',
    startDate: '2026-10-15',
    endDate: '2026-11-20',
    rateMultiplier: 1.2,
    directPrice: null,
    rooms: '스위트 · 가든뷰',
    status: 'active',
    note: '주말 중심',
  }),
  buildSeasonRow({
    id: 'S-008',
    name: '12월 비수기',
    quarter: 'winter',
    grade: 'off',
    periodType: 'range',
    startDate: '2026-12-01',
    endDate: '2026-12-20',
    rateMultiplier: 0.9,
    directPrice: null,
    rooms: '전체',
    status: 'draft',
    note: '연말 전 프로모션 검토',
  }),
  buildSeasonRow({
    id: 'S-009',
    name: '연말 특정일',
    quarter: 'winter',
    grade: 'super',
    periodType: 'date',
    startDate: '2026-12-31',
    endDate: '2026-12-31',
    rateMultiplier: 1.8,
    price: 504000,
    directPrice: 520000,
    rooms: '패밀리 · 독채 B',
    status: 'active',
    note: '송년 특정일',
  }),
  buildSeasonRow({
    id: 'S-010',
    name: '겨울 비수기',
    quarter: 'winter',
    grade: 'off',
    periodType: 'range',
    startDate: '2025-01-08',
    endDate: '2025-02-25',
    rateMultiplier: 0.82,
    directPrice: null,
    rooms: '전체',
    status: 'active',
    note: '2025년 기준',
  }),
  buildSeasonRow({
    id: 'S-011',
    name: '여름 성수기',
    quarter: 'summer',
    grade: 'peak',
    periodType: 'range',
    startDate: '2025-07-10',
    endDate: '2025-08-18',
    rateMultiplier: 1.3,
    directPrice: null,
    rooms: '전체',
    status: 'active',
    note: '2025년 기준',
  }),
  buildSeasonRow({
    id: 'S-012',
    name: '5월 가정의 달',
    quarter: 'spring',
    grade: 'peak',
    periodType: 'range',
    startDate: '2026-05-01',
    endDate: '2026-05-10',
    rateMultiplier: 1.25,
    directPrice: null,
    rooms: '패밀리 · 독채 B',
    status: 'active',
    note: '가족 패키지',
  }),
  buildSeasonRow({
    id: 'S-013',
    name: '6월 초 비수기',
    quarter: 'summer',
    grade: 'off',
    periodType: 'range',
    startDate: '2026-06-01',
    endDate: '2026-06-14',
    rateMultiplier: 0.92,
    directPrice: null,
    rooms: '전체',
    status: 'active',
    note: '성수기 전 프리시즌',
  }),
  buildSeasonRow({
    id: 'S-014',
    name: '한가위 연휴 특정일',
    quarter: 'fall',
    grade: 'super',
    periodType: 'date',
    startDate: '2026-09-16',
    endDate: '2026-09-16',
    rateMultiplier: 1.7,
    price: 476000,
    directPrice: 490000,
    rooms: '전체',
    status: 'active',
    note: '추석 전후 단일일',
  }),
  buildSeasonRow({
    id: 'S-015',
    name: '11월 비수기',
    quarter: 'fall',
    grade: 'off',
    periodType: 'range',
    startDate: '2026-11-21',
    endDate: '2026-12-15',
    rateMultiplier: 0.88,
    directPrice: null,
    rooms: '스위트 · 디럭스',
    status: 'active',
    note: '단풍 시즌 이후',
  }),
  buildSeasonRow({
    id: 'S-016',
    name: '2025 추석',
    quarter: 'fall',
    grade: 'super',
    periodType: 'range',
    startDate: '2025-10-03',
    endDate: '2025-10-09',
    rateMultiplier: 1.48,
    directPrice: null,
    rooms: '전체',
    status: 'active',
    note: '2025년 기준',
  }),
];

export function createSeasonRange(idSuffix = Date.now()): SeasonSetting {
  return buildSeasonRow({
    id: `S-${idSuffix}`,
    name: '신규 시즌',
    quarter: 'summer',
    grade: 'peak',
    periodType: 'range',
    startDate: '2026-07-01',
    endDate: '2026-07-31',
    rateMultiplier: 1.2,
    directPrice: null,
    rooms: '전체',
    status: 'draft',
    note: '새 기간 설정',
  });
}

export function createSeasonDate(idSuffix = Date.now()): SeasonSetting {
  return buildSeasonRow({
    id: `S-D-${idSuffix}`,
    name: '신규 특정일',
    quarter: 'summer',
    grade: 'super',
    periodType: 'date',
    startDate: '2026-08-15',
    endDate: '2026-08-15',
    rateMultiplier: 1.5,
    directPrice: 420000,
    rooms: '전체',
    status: 'draft',
    note: '특정일 요금',
  });
}
