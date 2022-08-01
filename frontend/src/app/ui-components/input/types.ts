export declare type InputValidator = (value: string) => true | string;
export interface BlurEvent {
  value: string;
  isEsc?: boolean;
  isEnter?: boolean;
}
