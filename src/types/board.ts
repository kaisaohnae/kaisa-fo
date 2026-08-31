export interface BoardItem {
  boardNo: number;
  categoryId: number;
  slug?: string;
  title: string;
  keyword?: string | null;
  excerpt?: string | null;
  content?: string;
  isDisplay: string;
  viewCount: number;
  creator?: string | null;
  createDt?: string | null;
  updater?: string | null;
  updateDt?: string | null;
  member?: {
    memberId: string;
    memberName: string;
    email: string;
  } | null;
  category?: {
    categoryId: number;
    categoryName: string;
  } | null;
}

export interface BoardListResponse {
  list: BoardItem[];
  totalCount: number;
  currentPage: number;
  lastPage: number;
  perPage: number;
}
