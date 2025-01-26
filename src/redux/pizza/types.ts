export enum Status {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

export type PizzaItem = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  sizes: number[];
  types: number[];
}

export interface PizzaSliceState {
  items: PizzaItem[];
  status: Status;
}

export type SearchPizzaParams = {
  sortBy: string; 
  order: string; 
  category: string; 
  search: string; 
  currentPage: string;
}