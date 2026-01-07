export type PaginatedResponse<T> = {
  data: T[];
  nextPage: number | null;
};

export type DataTypes = {
  id: string | number;
  [key: string]: any;
};

export interface NoDataProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export type QueryParam = {
  page?: number | string;
  limit?: number | string;
  search?: string;
  status?: string;
};
