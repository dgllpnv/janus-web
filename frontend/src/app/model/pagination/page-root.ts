import { Content } from './content';
import { Pageable } from './pageable';
import { RootSort } from './root-sort';

export interface PageRoot {
  content: Content[]
  pageable: Pageable
  last: boolean
  totalElements: number
  totalPages: number
  size: number
  number: number
  sort: RootSort
  first: boolean
  numberOfElements: number
  empty: boolean
}