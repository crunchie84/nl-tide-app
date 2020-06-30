export interface DownloadTideInfoEvent {
  locationCode: string;
  year: number;
  // ISO string representation of a Date
  created: string;
}
