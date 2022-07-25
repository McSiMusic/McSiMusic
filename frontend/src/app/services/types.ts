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
  name: string;
  duration: number;
  id: string;
  userId: string;
}
