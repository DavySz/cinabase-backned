import { AddAccountDTO } from "@domain/dtos/add-account.dto";
import { AccountModel } from "@domain/models/account.model";
import { AddAccountRepository } from "@domain/protocols/add-account.protocol";
import { User } from "@infra/database/mongodb/schemas/user.schema";

export class AccountRepository implements AddAccountRepository {
  async add(data: AddAccountDTO): Promise<AccountModel> {
    const user = await User.create(data);
    return {
      id: user._id.toHexString(),
      password: user.password,
      email: user.email,
      name: user.name,
    };
  }
}
