import { AddAccountDTO } from "@domain/dtos/add-account.dto";
import { AccountModel } from "@domain/models/account.model";
import { AddAccount } from "@domain/protocols/add-account.protocol";
import { User } from "@infra/database/mongodb/schemas/user.schema";
import { toModel } from "../../helpers/map/model";

export class AddAccountRepository implements AddAccount {
  async add(data: AddAccountDTO): Promise<AccountModel> {
    const user = await User.create(data);
    return toModel<AccountModel>(user.toObject());
  }
}
