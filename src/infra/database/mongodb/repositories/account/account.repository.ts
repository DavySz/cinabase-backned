import { AddAccountRepository } from "../../../../../domain/protocols/add-account.protocol";
import { AddAccountModelDTO } from "../../../../../domain/dtos/add-account.dto";
import { AccountModel } from "../../../../../domain/models/account.model";
import { User } from "../../schemas/user.schema";

export class AccountRepository implements AddAccountRepository {
  async add(data: AddAccountModelDTO): Promise<AccountModel> {
    const user = await User.create(data);
    return {
      id: user._id.toHexString(),
      password: user.password,
      email: user.email,
      name: user.name,
    };
  }
}
