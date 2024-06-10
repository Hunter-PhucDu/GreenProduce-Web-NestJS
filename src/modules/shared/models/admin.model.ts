import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Admin, AdminDocument } from '../schemas/admin.schema';

@Injectable()
export class AdminModel {
  constructor(@InjectModel(Admin.name) public model: PaginateModel<AdminDocument>) {}
}