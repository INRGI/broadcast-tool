import { CopyType } from "./copy-type.enum";

export interface BroadcastCopy {
  name: string;
  isPriority: boolean;
  copyType: CopyType;
}
