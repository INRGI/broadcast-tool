import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Admins extends Document {
  @Prop({ required: true })
  emails: string[];
}

export const AdminsSchema = SchemaFactory.createForClass(Admins);
