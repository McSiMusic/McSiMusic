export interface Folder {
  name: string;
  status: FolderStatus;
}

export enum FolderStatus {
  Idle = 'Idle',
  Creating = 'Creating',
  Editing = 'Editing',
  Loading = 'Loading',
}
