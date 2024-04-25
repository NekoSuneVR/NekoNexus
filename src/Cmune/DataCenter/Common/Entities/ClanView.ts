import BasicClanView from './BasicClanView';
import ClanMemberView from './ClanMemberView';

export default class ClanView extends BasicClanView {
  public Members: List<ClanMemberView>;

  constructor(params: any = {}) {
    super(params);
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }

  public override toString(): string {
    return `[Clan: ${super.toString()} [Members: ${this.Members.map((_) => _.toString())}]]`;
  }
}
