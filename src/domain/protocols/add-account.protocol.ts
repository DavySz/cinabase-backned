import { AddAccountDTO } from "@domain/dtos/add-account.dto";
import { AccountModel } from "@domain/models/account.model";

export interface AddAccount {
  add: (data: AddAccountDTO) => Promise<AccountModel>;
}
