import { AccountModel } from "../models/account.model";

export interface FindByEmail {
  execute(email: string): Promise<AccountModel>;
}
