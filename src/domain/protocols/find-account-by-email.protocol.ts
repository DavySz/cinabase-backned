import { AccountModel } from "@domain/models/account.model";

export interface FindAccountByEmail {
  find: (email: string) => Promise<AccountModel>;
}
