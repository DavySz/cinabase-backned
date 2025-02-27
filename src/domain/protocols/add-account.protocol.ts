import { AddAccountDTO } from "@domain/dtos/add-account.dto";
import { AccountModel } from "@domain/models/account.model";

export interface AddAccountRepository {
  add: (data: AddAccountDTO) => Promise<AccountModel>;
}
