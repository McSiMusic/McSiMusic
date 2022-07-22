export interface User {
  id: string;
  name: string;
  picture: string;
}

export enum AuthStatus {
  Pending = 'Pending',
  Authorized = 'Authorized',
  Unauthorized = 'Unauthorized',
}
