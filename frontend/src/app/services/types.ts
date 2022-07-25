export interface User {
  id: string;
  name: string;
  picture: string;
  folders: string[];
}

export enum AuthStatus {
  Pending = 'Pending',
  Authorized = 'Authorized',
  Unauthorized = 'Unauthorized',
}

export interface Track {
  _id: string;
  name: string;
  duration: number;
  userId: string;
  date: number;
}
