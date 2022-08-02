import { Track } from 'src/app/services/types';
import { sToTime } from 'src/app/utils/durtaionConvertor';

export interface TrackPropDescriptor {
  key: keyof Track;
  displayName: string;
  primary?: boolean;
  convert?: (value: any) => string;
  cellClass: string;
}

export const tableDescriptor: TrackPropDescriptor[] = [
  {
    key: 'name',
    displayName: 'Title',
    primary: true,
    cellClass: 'title',
  },
  {
    key: 'date',
    displayName: 'Date',
    convert: (value: number) => new Date(value).toLocaleDateString('en-US'),
    cellClass: 'date',
  },
  {
    key: 'duration',
    displayName: 'Duration',
    convert: sToTime,
    cellClass: 'duration',
  },
];
