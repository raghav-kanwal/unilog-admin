import { CustomFieldValues } from "src/components/FilterBar/types";

export interface Filters {
  searchText: string;
  from: string;
  to: string;
  sortBy: string;
  filterBy: string[];
  customFieldValues: CustomFieldValues[];
}
