import { TideRecord } from './TideRecord';

export interface TideInfo {
  elevationReferencePoint: 'NAP' | 'MLS';
  tides: Array<TideRecord>;
}
