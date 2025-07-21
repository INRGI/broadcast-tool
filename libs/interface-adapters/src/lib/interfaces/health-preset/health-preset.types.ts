import { HealthBotTrap } from "./health-bot-trap.types";
import { HealthBroadcast } from "./health-broadcast.types";
import { HealthCopyStyles } from "./health-copy-styles.types";
import { HealthCopyWhatToReplace } from "./health-copy-what-to-replace.types";
import { HealthLinkUrl } from "./health-link-url.types";
import { HealthSubjectLine } from "./health-subject-line.types";
import { HealthUnsubLinkUrl } from "./health-unsub-link-url.types";

export interface HealthPreset {
  name: string;
  copyStyles?: HealthCopyStyles;
  copyWhatToReplace?: HealthCopyWhatToReplace;
  linkUrl?: HealthLinkUrl;
  unsubLinkUrl?: HealthUnsubLinkUrl;
  broadcast: HealthBroadcast;
  subjectLine?: HealthSubjectLine;
  botTrap?: HealthBotTrap;
  format?: 'html' | 'mjml';
}
