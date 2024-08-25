import { AccountModel } from "../models/account.model";

export interface AddAccountModel {
  password: string;
  email: string;
  name: string;
}

export interface AddAccount {
  execute: (account: AddAccountModel) => Promise<AccountModel>;
}
