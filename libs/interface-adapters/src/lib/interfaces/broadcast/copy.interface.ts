import { CopyType } from "./copy-type.enum";

export interface BroadcastCopy {
  name: string;
  copyType: CopyType;
  isPriority: boolean;
}
