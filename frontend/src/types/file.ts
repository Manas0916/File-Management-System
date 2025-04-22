export interface File {
  id: string;
  original_filename: string;
  file_type: string;
  size: number;
  uploaded_at: string;
  file: string;
} 

export interface FilterBarProps {
  onFilterChange: (filters: Filters) => void;
  filters: Filters;
}

export interface Filters {
    fileType: string;
    dateRange: { startDate: string; endDate: string };
    fileSize: string;
    fileName: string;
}