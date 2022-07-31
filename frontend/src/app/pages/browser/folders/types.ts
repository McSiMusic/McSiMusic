export interface Folder {
  name: string;
  status: FolderStatus;
}

export enum FolderStatus {
  Idle,
  Editing,
}
