import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RoleEnum } from '../enum/roles.enum';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: 'users',
  autoIndex: process.env.ENVIROMENT == 'development',
})
export class Users extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: false })
  lastName: string;

  @Prop({ required: false, default: null })
  age: number;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: true, required: true })
  isActive: boolean;

  @Prop({ default: null, required: true, enum: RoleEnum })
  role: RoleEnum;
}

export const UserSchema = SchemaFactory.createForClass(Users);
