export const NAV_ITEMS = [
  {id: 'dashboard', label: 'Dashboard', active: true},
  {id: 'users', label: 'Users', active: false},
  {id: 'projects', label: 'Projects', active: false},
  {id: 'reports', label: 'Reports', active: false},
  {id: 'settings', label: 'Settings', active: false},
];

export const STATS = [
  {id: 'visitors', label: 'Total Visitors', value: '24,582', change: '+12.4%', up: true},
  {id: 'revenue', label: 'Revenue', value: '₩48.2M', change: '+8.1%', up: true},
  {id: 'orders', label: 'Orders', value: '1,284', change: '-2.3%', up: false},
  {id: 'conversion', label: 'Conversion', value: '3.8%', change: '+0.6%', up: true},
];

export const CHART_BARS = [
  {label: 'Mon', value: 62},
  {label: 'Tue', value: 78},
  {label: 'Wed', value: 54},
  {label: 'Thu', value: 88},
  {label: 'Fri', value: 72},
  {label: 'Sat', value: 45},
  {label: 'Sun', value: 58},
];

export const ACTIVITIES = [
  {id: 1, user: 'Kim Minsoo', action: 'New project created', time: '2 min ago', status: 'success'},
  {id: 2, user: 'Park Jiyeon', action: 'Updated dashboard settings', time: '18 min ago', status: 'info'},
  {id: 3, user: 'Lee Junho', action: 'Export report completed', time: '1 hr ago', status: 'success'},
  {id: 4, user: 'System', action: 'Backup scheduled', time: '3 hr ago', status: 'neutral'},
  {id: 5, user: 'Choi Yuna', action: 'User role changed', time: '5 hr ago', status: 'warning'},
];

export const RECENT_ORDERS = [
  {id: '#ORD-1042', customer: 'Acme Corp', amount: '₩1,240,000', status: 'Completed', date: '2026-06-27'},
  {id: '#ORD-1041', customer: 'Nova Studio', amount: '₩860,000', status: 'Processing', date: '2026-06-27'},
  {id: '#ORD-1040', customer: 'Blue Labs', amount: '₩2,100,000', status: 'Completed', date: '2026-06-26'},
  {id: '#ORD-1039', customer: 'Pixel Works', amount: '₩540,000', status: 'Pending', date: '2026-06-26'},
  {id: '#ORD-1038', customer: 'Frame Inc', amount: '₩980,000', status: 'Completed', date: '2026-06-25'},
];
