import { AccountModel } from "@domain/models/account.model";
import { FindAccountByEmail } from "@domain/protocols/find-account-by-email.protocol";
import { User } from "@infra/database/mongodb/schemas/user.schema";
import { toModel } from "../../helpers/map/model";

export class FindAccountByEmailRepository implements FindAccountByEmail {
  async find(email: string): Promise<AccountModel> {
    const user = await User.findOne({ email }).exec();
    if (!user) return {} as AccountModel;
    return toModel<AccountModel>(user.toObject());
  }
}
