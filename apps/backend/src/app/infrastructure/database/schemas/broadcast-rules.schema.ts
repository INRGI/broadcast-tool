import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import {
  UsageRules,
  ProductRules,
  CopyAssignmentStrategyRules,
} from "@epc-services/interface-adapters";

@Schema({ collection: "broadcast_rules", timestamps: true })
export class BroadcastRules extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  broadcastSpreadsheetId: string;

  @Prop({ type: Object, required: true })
  usageRules: UsageRules;

  @Prop({ type: Object, required: true })
  productRules: ProductRules;

  @Prop({ type: Object, required: true })
  copyAssignmentStrategyRules: CopyAssignmentStrategyRules;
}

export const BroadcastRulesSchema =
  SchemaFactory.createForClass(BroadcastRules);
