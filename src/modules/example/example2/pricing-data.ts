export type PricingTier = 'offpeak' | 'standard' | 'peak';
export type PricingPeriodType = 'range' | 'date';

export type PricingRule = {
  id: string;
  name: string;
  tier: PricingTier;
  periodType: PricingPeriodType;
  startDate: string;
  endDate: string;
  multiplier: number;
  directPrice: number | null;
  price: number;
  connectors: string;
  status: 'active' | 'draft';
  note: string;
};

export const PRICING_TIER_LABEL: Record<PricingTier, string> = {
  offpeak: '경부하',
  standard: '중간부하',
  peak: '최대부하',
};

export const PRICING_PERIOD_LABEL: Record<PricingPeriodType, string> = {
  range: '기간',
  date: '특정일',
};

const BASE_RATE = 600;

function buildPricingRule(row: Omit<PricingRule, 'price'> & {price?: number}): PricingRule {
  const price = row.price ?? Math.round(BASE_RATE * row.multiplier);
  return {...row, price};
}

export const PRICING_RULES: PricingRule[] = [
  buildPricingRule({
    id: 'P-001',
    name: '심야 경부하',
    tier: 'offpeak',
    periodType: 'range',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    multiplier: 0.75,
    directPrice: null,
    connectors: '전체',
    status: 'active',
    note: '23:00 — 07:00',
  }),
  buildPricingRule({
    id: 'P-002',
    name: '주간 표준',
    tier: 'standard',
    periodType: 'range',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    multiplier: 1,
    directPrice: null,
    connectors: '전체',
    status: 'active',
    note: '07:00 — 17:00',
  }),
  buildPricingRule({
    id: 'P-003',
    name: '저녁 피크',
    tier: 'peak',
    periodType: 'range',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    multiplier: 1.35,
    directPrice: null,
    connectors: '전체',
    status: 'active',
    note: '17:00 — 23:00',
  }),
  buildPricingRule({
    id: 'P-004',
    name: '여름 성수기',
    tier: 'peak',
    periodType: 'range',
    startDate: '2026-07-01',
    endDate: '2026-08-31',
    multiplier: 1.5,
    directPrice: null,
    connectors: '초급속 · 급속',
    status: 'active',
    note: '휴가철 수요 대응',
  }),
  buildPricingRule({
    id: 'P-005',
    name: '추석 특별',
    tier: 'peak',
    periodType: 'date',
    startDate: '2026-10-03',
    endDate: '2026-10-09',
    multiplier: 1.4,
    directPrice: 980,
    connectors: '전체',
    status: 'draft',
    note: '직접 입력 우선',
  }),
  buildPricingRule({
    id: 'P-006',
    name: '완속 고정',
    tier: 'standard',
    periodType: 'range',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    multiplier: 0.45,
    directPrice: 270,
    connectors: 'AC',
    status: 'active',
    note: '완속 전용',
  }),
];

export function createPricingRange(idSuffix = Date.now()): PricingRule {
  return buildPricingRule({
    id: `P-${idSuffix}`,
    name: '신규 요금',
    tier: 'standard',
    periodType: 'range',
    startDate: '2026-07-01',
    endDate: '2026-07-31',
    multiplier: 1.1,
    directPrice: null,
    connectors: '전체',
    status: 'draft',
    note: '새 요금 구간',
  });
}
