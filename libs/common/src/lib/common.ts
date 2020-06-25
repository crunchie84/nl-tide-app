export interface Location {
  code: string,
  name: string
}

export interface TideRecord {
  at: Date,
  tide: 'LW'|'HW',
  elevation: number
}

export interface TideDateResponse {
  location: Location,
  elevationReferencePoint: 'NAP'|'MLS',
  tides: Array<TideRecord>
}
