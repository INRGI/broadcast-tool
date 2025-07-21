import {
  AnalyticSelectionRules,
  DomainRules,
  PartnerRules,
  TestingRules,
} from "@epc-services/interface-adapters";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class AdminBroadcastConfig extends Document {
  @Prop({ required: true })
  niche: string;

  @Prop({ type: Object, required: true })
  testingRules: TestingRules;

  @Prop({ type: Object, required: true })
  partnerRules: PartnerRules;

  @Prop({ type: Object, required: true })
  analyticSelectionRules: AnalyticSelectionRules;

  @Prop({ type: Object, required: true })
  domainRules: DomainRules;
}

export const AdminBroadcastConfigSchema =
  SchemaFactory.createForClass(AdminBroadcastConfig);
