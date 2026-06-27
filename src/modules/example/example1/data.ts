export const PENSION_NAME = '펜션 관리 Example1';

export const STATS = [
  {id: 'checkin', label: '오늘 체크인', value: '5건', note: '14:00 이후 2건', tone: 'accent'},
  {id: 'checkout', label: '오늘 체크아웃', value: '3건', note: '11:00까지 1건', tone: 'info'},
  {id: 'occupancy', label: '객실 가동률', value: '78%', note: '전일 대비 +6%', tone: 'success'},
  {id: 'revenue', label: '이번 달 매출', value: '2,864만', note: '목표 대비 92%', tone: 'neutral'},
];

export const OCCUPANCY_BARS = [
  {label: '월', value: 52},
  {label: '화', value: 61},
  {label: '수', value: 48},
  {label: '목', value: 74},
  {label: '금', value: 88},
  {label: '토', value: 96},
  {label: '일', value: 82},
];

export type RoomStatus = 'occupied' | 'vacant' | 'reserved' | 'cleaning';

export const ROOMS = [
  {id: '101', name: '독채 A', type: '2인 · 바베큐', status: 'occupied' as RoomStatus, guest: '김민수', period: '06.26 — 06.28'},
  {id: '102', name: '독채 B', type: '4인 · 노천탕', status: 'vacant' as RoomStatus, guest: null, period: null},
  {id: '201', name: '스위트', type: '2인 · 오션뷰', status: 'reserved' as RoomStatus, guest: '박지연', period: '06.27 — 06.29'},
  {id: '202', name: '디럭스', type: '2인 · 정원뷰', status: 'cleaning' as RoomStatus, guest: null, period: null},
  {id: '301', name: '가든뷰', type: '3인 · 테라스', status: 'occupied' as RoomStatus, guest: '이준호', period: '06.25 — 06.28'},
  {id: '302', name: '패밀리', type: '6인 · 복층', status: 'reserved' as RoomStatus, guest: '최유나', period: '06.28 — 06.30'},
];

export const ROOM_STATUS_LABEL: Record<RoomStatus, string> = {
  occupied: '투숙중',
  vacant: '빈 객실',
  reserved: '예약 확정',
  cleaning: '청소중',
};

export const TODAY_SCHEDULE = [
  {id: 1, type: 'in', time: '15:00', room: '201 스위트', guest: '박지연', note: '차량 1대 · 늦은 체크인'},
  {id: 2, type: 'out', time: '11:00', room: '103 오션', guest: '정하늘', note: '체크아웃 완료'},
  {id: 3, type: 'in', time: '16:30', room: '302 패밀리', guest: '최유나', note: '아기침대 요청'},
  {id: 4, type: 'out', time: '11:00', room: '101 독채 A', guest: '김민수', note: '내일 오전'},
  {id: 5, type: 'in', time: '18:00', room: '102 독채 B', guest: '한소희', note: '바베큐 세트 추가'},
];

export type Reservation = {
  id: string;
  guest: string;
  room: string;
  nights: number;
  amount: string;
  channel: string;
  status: string;
  checkIn: string;
  checkOut: string;
};

export type RoomInventoryItem = {
  id: string;
  name: string;
  type: string;
  basePrice: number;
  weekendPrice: number;
  maxGuests: number;
  status: RoomStatus;
};

export const RESERVATIONS: Reservation[] = [
  {id: 'R-20260627-01', guest: '박지연', room: '201 스위트', nights: 2, amount: '420,000', channel: '네이버', status: 'confirmed', checkIn: '2026-06-27', checkOut: '2026-06-29'},
  {id: 'R-20260627-02', guest: '한소희', room: '102 독채 B', nights: 1, amount: '280,000', channel: '직접 예약', status: 'confirmed', checkIn: '2026-06-27', checkOut: '2026-06-28'},
  {id: 'R-20260626-08', guest: '김민수', room: '101 독채 A', nights: 2, amount: '560,000', channel: '야놀자', status: 'staying', checkIn: '2026-06-26', checkOut: '2026-06-28'},
  {id: 'R-20260626-05', guest: '이준호', room: '301 가든뷰', nights: 3, amount: '690,000', channel: 'Airbnb', status: 'staying', checkIn: '2026-06-25', checkOut: '2026-06-28'},
  {id: 'R-20260625-03', guest: '최유나', room: '302 패밀리', nights: 2, amount: '780,000', channel: '직접 예약', status: 'confirmed', checkIn: '2026-06-28', checkOut: '2026-06-30'},
  {id: 'R-20260624-11', guest: '정하늘', room: '202 디럭스', nights: 1, amount: '210,000', channel: '네이버', status: 'cancelled', checkIn: '2026-06-24', checkOut: '2026-06-25'},
  {id: 'R-20260623-04', guest: '오세진', room: '201 스위트', nights: 2, amount: '430,000', channel: '야놀자', status: 'pending', checkIn: '2026-07-02', checkOut: '2026-07-04'},
  {id: 'R-20260622-07', guest: '윤다인', room: '102 독채 B', nights: 3, amount: '840,000', channel: 'Airbnb', status: 'confirmed', checkIn: '2026-07-10', checkOut: '2026-07-13'},
  {id: 'R-20260621-02', guest: '강서윤', room: '301 가든뷰', nights: 2, amount: '540,000', channel: '네이버', status: 'confirmed', checkIn: '2026-07-05', checkOut: '2026-07-07'},
  {id: 'R-20260620-09', guest: '임도현', room: '101 독채 A', nights: 1, amount: '320,000', channel: '직접 예약', status: 'confirmed', checkIn: '2026-07-01', checkOut: '2026-07-02'},
  {id: 'R-20260619-06', guest: '송예린', room: '302 패밀리', nights: 2, amount: '900,000', channel: '야놀자', status: 'pending', checkIn: '2026-07-18', checkOut: '2026-07-20'},
  {id: 'R-20260618-01', guest: '조민재', room: '201 스위트', nights: 1, amount: '250,000', channel: 'Airbnb', status: 'cancelled', checkIn: '2026-06-20', checkOut: '2026-06-21'},
  {id: 'R-20260617-12', guest: '홍수아', room: '103 오션', nights: 2, amount: '620,000', channel: '네이버', status: 'confirmed', checkIn: '2026-07-08', checkOut: '2026-07-10'},
  {id: 'R-20260616-04', guest: '배준영', room: '202 디럭스', nights: 3, amount: '690,000', channel: '직접 예약', status: 'confirmed', checkIn: '2026-07-14', checkOut: '2026-07-17'},
  {id: 'R-20260615-11', guest: '노하은', room: '102 독채 B', nights: 2, amount: '760,000', channel: '야놀자', status: 'staying', checkIn: '2026-06-24', checkOut: '2026-06-26'},
  {id: 'R-20260614-03', guest: '서지훈', room: '203 테라스', nights: 1, amount: '295,000', channel: 'Airbnb', status: 'confirmed', checkIn: '2026-07-22', checkOut: '2026-07-23'},
  {id: 'R-20260613-08', guest: '유채원', room: '101 독채 A', nights: 2, amount: '580,000', channel: '네이버', status: 'pending', checkIn: '2026-08-01', checkOut: '2026-08-03'},
  {id: 'R-20260612-05', guest: '문태양', room: '302 패밀리', nights: 3, amount: '1,170,000', channel: '직접 예약', status: 'confirmed', checkIn: '2026-08-09', checkOut: '2026-08-12'},
  {id: 'R-20260611-10', guest: '권소희', room: '201 스위트', nights: 2, amount: '460,000', channel: '야놀자', status: 'confirmed', checkIn: '2026-07-25', checkOut: '2026-07-27'},
  {id: 'R-20260610-07', guest: '장우진', room: '301 가든뷰', nights: 1, amount: '270,000', channel: 'Airbnb', status: 'cancelled', checkIn: '2026-06-18', checkOut: '2026-06-19'},
  {id: 'R-20260609-02', guest: '신다은', room: '103 오션', nights: 2, amount: '640,000', channel: '네이버', status: 'confirmed', checkIn: '2026-08-15', checkOut: '2026-08-17'},
  {id: 'R-20260608-09', guest: '허재민', room: '202 디럭스', nights: 2, amount: '460,000', channel: '직접 예약', status: 'confirmed', checkIn: '2026-07-30', checkOut: '2026-08-01'},
  {id: 'R-20260607-06', guest: '안지우', room: '102 독채 B', nights: 1, amount: '360,000', channel: '야놀자', status: 'pending', checkIn: '2026-08-20', checkOut: '2026-08-21'},
];

export const ROOM_INVENTORY: RoomInventoryItem[] = [
  {id: '101', name: '독채 A', type: '2인 · 바베큐', basePrice: 280000, weekendPrice: 320000, maxGuests: 2, status: 'occupied'},
  {id: '102', name: '독채 B', type: '4인 · 노천탕', basePrice: 360000, weekendPrice: 420000, maxGuests: 4, status: 'vacant'},
  {id: '103', name: '오션', type: '4인 · 오션뷰', basePrice: 310000, weekendPrice: 360000, maxGuests: 4, status: 'reserved'},
  {id: '201', name: '스위트', type: '2인 · 오션뷰', basePrice: 210000, weekendPrice: 250000, maxGuests: 2, status: 'reserved'},
  {id: '202', name: '디럭스', type: '2인 · 정원뷰', basePrice: 190000, weekendPrice: 230000, maxGuests: 2, status: 'cleaning'},
  {id: '203', name: '테라스', type: '2인 · 테라스', basePrice: 295000, weekendPrice: 340000, maxGuests: 2, status: 'vacant'},
  {id: '301', name: '가든뷰', type: '3인 · 테라스', basePrice: 230000, weekendPrice: 270000, maxGuests: 3, status: 'occupied'},
  {id: '302', name: '패밀리', type: '6인 · 복층', basePrice: 390000, weekendPrice: 450000, maxGuests: 6, status: 'reserved'},
];

export const REVENUE_REPORT_ROWS = [
  {month: '2025-07', bookings: 30, nights: 74, revenue: 26800000, adr: 362162, occupancy: 72},
  {month: '2025-08', bookings: 35, nights: 86, revenue: 31200000, adr: 362791, occupancy: 81},
  {month: '2025-09', bookings: 27, nights: 63, revenue: 23100000, adr: 366667, occupancy: 68},
  {month: '2025-10', bookings: 29, nights: 68, revenue: 24800000, adr: 364706, occupancy: 71},
  {month: '2025-11', bookings: 24, nights: 55, revenue: 20500000, adr: 372727, occupancy: 63},
  {month: '2025-12', bookings: 20, nights: 46, revenue: 19200000, adr: 417391, occupancy: 58},
  {month: '2026-01', bookings: 18, nights: 42, revenue: 18200000, adr: 433333, occupancy: 58},
  {month: '2026-02', bookings: 22, nights: 51, revenue: 18900000, adr: 370588, occupancy: 62},
  {month: '2026-03', bookings: 28, nights: 64, revenue: 22400000, adr: 350000, occupancy: 68},
  {month: '2026-04', bookings: 31, nights: 72, revenue: 25100000, adr: 348611, occupancy: 74},
  {month: '2026-05', bookings: 34, nights: 81, revenue: 28400000, adr: 350617, occupancy: 79},
  {month: '2026-06', bookings: 36, nights: 88, revenue: 28640000, adr: 325455, occupancy: 78},
];

export const RESERVATION_STATUS_LABEL: Record<string, string> = {
  confirmed: '예약 확정',
  staying: '투숙중',
  pending: '대기',
  cancelled: '취소',
};

/** 월별 매출 (단위: 만 원) — 최근 24개월 */
export const REVENUE_HISTORY = [
  {label: '24.07', value: 1980},
  {label: '24.08', value: 2450},
  {label: '24.09', value: 2180},
  {label: '24.10', value: 2890},
  {label: '24.11', value: 2620},
  {label: '24.12', value: 1980},
  {label: '25.01', value: 1680},
  {label: '25.02', value: 1750},
  {label: '25.03', value: 2100},
  {label: '25.04', value: 2380},
  {label: '25.05', value: 2680},
  {label: '25.06', value: 3120},
  {label: '25.07', value: 2890},
  {label: '25.08', value: 3280},
  {label: '25.09', value: 2750},
  {label: '25.10', value: 3020},
  {label: '25.11', value: 2680},
  {label: '25.12', value: 2140},
  {label: '26.01', value: 1820},
  {label: '26.02', value: 1890},
  {label: '26.03', value: 2240},
  {label: '26.04', value: 2510},
  {label: '26.05', value: 2840},
  {label: '26.06', value: 2864},
];

export const REVENUE_SUMMARY = {
  total: '5.87억',
  average: '2,447만',
  growth: '+18.9%',
};

export const CHANNEL_SHARE = [
  {id: 'naver', label: '네이버', value: 32, color: '#ff4d00'},
  {id: 'yanolja', label: '야놀자', value: 24, color: '#0090ff'},
  {id: 'airbnb', label: 'Airbnb', value: 18, color: '#e5484d'},
  {id: 'direct', label: '직접 예약', value: 26, color: '#0f9d58'},
];

export const STAY_NIGHTS = [
  {label: '1박', value: 28},
  {label: '2박', value: 45},
  {label: '3박+', value: 27},
];

/** 객실 타입별 매출 (단위: 만 원, 최근 12개월) */
export const ROOM_TYPE_REVENUE = [
  {label: '독채', value: 892},
  {label: '스위트', value: 628},
  {label: '패밀리', value: 514},
  {label: '가든뷰', value: 444},
  {label: '디럭스', value: 386},
];

export function createReservation(idSuffix = Date.now()): Reservation {
  return {
    id: `R-${idSuffix}`,
    guest: '새 투숙객',
    room: '101 독채 A',
    checkIn: '2026-07-01',
    checkOut: '2026-07-02',
    nights: 1,
    amount: '280,000',
    channel: '직접 예약',
    status: 'pending',
  };
}

export function createRoomItem(idSuffix = Date.now()): RoomInventoryItem {
  return {
    id: String(100 + (idSuffix % 900)),
    name: '신규 객실',
    type: '2인 · 기본',
    basePrice: 220000,
    weekendPrice: 260000,
    maxGuests: 2,
    status: 'vacant',
  };
}
