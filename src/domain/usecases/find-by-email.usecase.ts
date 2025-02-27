import { AccountModel } from "@domain/models/account.model";

export interface FindByEmail {
  execute(email: string): Promise<AccountModel>;
}
