export interface Location {
  code: string;
  name: string;
}

export interface TideInfo {
  elevationReferencePoint: 'NAP' | 'MLS';
  tides: Array<TideRecord>;
}

export interface TideRecord {
  at: Date;
  tide: 'LW' | 'HW';
  elevation: number;
}
