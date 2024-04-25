import { ApplicationRegistrationResult } from '@/Cmune/DataCenter/Common/Entities';

export default class RegisterClientApplicationViewModel {
  public Result: ApplicationRegistrationResult;
  public ItemsAttributed: List<int>;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
