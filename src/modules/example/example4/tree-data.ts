import type {Ex4TreeNode} from './tree-utils';

export const TREE_COPY = {
  pageTitle: '로케이션',
  pageDesc:
    '구역과 랙을 끌어 옮긴다. 순서만, 편성, 양쪽 배정, 잠금·깊이 제한.',
  asideLabel: '인터랙션',
  kicker: '2026년 8월 2주',
  reset: '초기화',
  empty: '비어 있음',
  reorder: {
    title: '도크 순서',
    hint: '같은 레벨에서만 위아래 이동',
  },
  reparent: {
    title: '랙 편성',
    hint: '폴더 안으로 넣거나 형제로 이동',
  },
  transfer: {
    title: '작업 배정',
    hint: '입고대기 ↔ 확정 로케이션',
    left: '입고 대기',
    right: '확정 로케이션',
  },
  strict: {
    title: '제약 이동',
    hint: '잠금 노드 · 최대 깊이 3',
  },
  meters: {
    title: '\uac00\ub3d9 \u00b7 \uc801\uc7ac',
    hint: '1~100% \ub4dc\ub798\uadf8',
    dock: '\ub3c4\ud06c \uac00\ub3d9',
    rack: '\ub799 \uc801\uc7ac',
    out: '\ucd9c\uace0 \uc9c4\ucc99',
    band: '\ubaa9\ud45c \uad6c\uac04',
  },
};

export const DOCK_TREE: Ex4TreeNode[] = [
  {id: 'd1', label: '도크 1', kind: 'leaf'},
  {id: 'd2', label: '도크 2', kind: 'leaf'},
  {id: 'd3', label: '도크 3', kind: 'leaf'},
  {id: 'd4', label: '도크 4', kind: 'leaf'},
  {id: 'd5', label: '도크 5', kind: 'leaf'},
];

export const ZONE_TREE: Ex4TreeNode[] = [
  {
    id: 'f1',
    label: '1층',
    kind: 'folder',
    children: [
      {
        id: 'a',
        label: '상온 A',
        kind: 'folder',
        children: [
          {id: 'a01', label: 'A-01', kind: 'leaf'},
          {id: 'a02', label: 'A-02', kind: 'leaf'},
          {id: 'a03', label: 'A-03', kind: 'leaf'},
        ],
      },
      {
        id: 'b',
        label: '상온 B',
        kind: 'folder',
        children: [
          {id: 'b01', label: 'B-01', kind: 'leaf'},
          {id: 'b02', label: 'B-02', kind: 'leaf'},
        ],
      },
      {
        id: 'c',
        label: '냉장',
        kind: 'folder',
        children: [
          {id: 'c01', label: 'C-01', kind: 'leaf'},
          {id: 'c02', label: 'C-02', kind: 'leaf'},
        ],
      },
    ],
  },
  {
    id: 'f2',
    label: '2층',
    kind: 'folder',
    children: [
      {
        id: 'p',
        label: '픽킹',
        kind: 'folder',
        children: [
          {id: 'p01', label: 'P-01', kind: 'leaf'},
          {id: 'p02', label: 'P-02', kind: 'leaf'},
        ],
      },
      {
        id: 's',
        label: '출고대기',
        kind: 'folder',
        children: [{id: 's01', label: 'S-01', kind: 'leaf'}],
      },
    ],
  },
];

export const STAGING_TREE: Ex4TreeNode[] = [
  {id: 'lot2401', label: 'LOT-2401', kind: 'leaf'},
  {id: 'lot2402', label: 'LOT-2402', kind: 'leaf'},
  {id: 'lot2403', label: 'LOT-2403', kind: 'leaf'},
  {
    id: 'inspect',
    label: '검수중',
    kind: 'folder',
    children: [{id: 'lot2390', label: 'LOT-2390', kind: 'leaf'}],
  },
];

export const ASSIGNED_TREE: Ex4TreeNode[] = [
  {
    id: 'as-a',
    label: '상온 A',
    kind: 'folder',
    children: [{id: 'a11', label: 'A-11', kind: 'leaf'}],
  },
  {
    id: 'as-c',
    label: '냉장',
    kind: 'folder',
    children: [],
  },
];

export const STRICT_TREE: Ex4TreeNode[] = [
  {
    id: 'st-f1',
    label: '1층',
    kind: 'folder',
    children: [
      {
        id: 'st-a',
        label: '상온',
        kind: 'folder',
        children: [
          {id: 'st-a01', label: 'A-01', kind: 'leaf'},
          {id: 'st-a02', label: 'A-02', kind: 'leaf'},
        ],
      },
      {
        id: 'st-h',
        label: '위험물',
        kind: 'folder',
        locked: true,
        children: [{id: 'st-h01', label: 'H-01', kind: 'leaf', locked: true}],
      },
    ],
  },
  {
    id: 'st-f2',
    label: '2층',
    kind: 'folder',
    children: [
      {
        id: 'st-p',
        label: '픽킹',
        kind: 'folder',
        children: [{id: 'st-p01', label: 'P-01', kind: 'leaf'}],
      },
    ],
  },
];
