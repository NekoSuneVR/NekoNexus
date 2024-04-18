import {
    ClanMemberView, ClanView, GroupColor, GroupFontStyle, GroupType,
} from '@/Cmune/DataCenter/Common/Entities';
import ClanMemberViewProxy from './ClanMemberViewProxy';
import DateTimeProxy from './DateTimeProxy';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';
import ListProxy from './ListProxy';
import StringProxy from './StringProxy';

export default class ClanViewProxy {
  public static Serialize(stream: Stream, instance: ClanView): void {
    let num = 0;
    const memoryStream: any[] = [];

    if (instance.Address) {
      StringProxy.Serialize(memoryStream, instance.Address);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.ApplicationId);
    EnumProxy.Serialize<GroupColor>(memoryStream, instance.ColorStyle);

    if (instance.Description) {
      StringProxy.Serialize(memoryStream, instance.Description);
    } else {
      num |= 2;
    }

    EnumProxy.Serialize<GroupFontStyle>(memoryStream, instance.FontStyle);
    DateTimeProxy.Serialize(memoryStream, instance.FoundingDate);
    Int32Proxy.Serialize(memoryStream, instance.GroupId);
    DateTimeProxy.Serialize(memoryStream, instance.LastUpdated);

    if (instance.Members) {
      ListProxy.Serialize<ClanMemberView>(memoryStream, instance.Members, ClanMemberViewProxy.Serialize);
    } else {
      num |= 4;
    }

    Int32Proxy.Serialize(memoryStream, instance.MembersCount);
    Int32Proxy.Serialize(memoryStream, instance.MembersLimit);

    if (instance.Motto) {
      StringProxy.Serialize(memoryStream, instance.Motto);
    } else {
      num |= 8;
    }

    if (instance.Name) {
      StringProxy.Serialize(memoryStream, instance.Name);
    } else {
      num |= 16;
    }

    Int32Proxy.Serialize(memoryStream, instance.OwnerCmid);

    if (instance.OwnerName) {
      StringProxy.Serialize(memoryStream, instance.OwnerName);
    } else {
      num |= 32;
    }

    if (instance.Picture) {
      StringProxy.Serialize(memoryStream, instance.Picture);
    } else {
      num |= 64;
    }

    if (instance.Tag) {
      StringProxy.Serialize(memoryStream, instance.Tag);
    } else {
      num |= 128;
    }

    EnumProxy.Serialize<GroupType>(memoryStream, instance.Type);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): ClanView {
    const num = Int32Proxy.Deserialize(bytes);
    const clanView = new ClanView();

    if ((num & 1) !== 0) {
      clanView.Address = StringProxy.Deserialize(bytes);
    }

    clanView.ApplicationId = Int32Proxy.Deserialize(bytes);
    clanView.ColorStyle = EnumProxy.Deserialize<GroupColor>(bytes);

    if ((num & 2) !== 0) {
      clanView.Description = StringProxy.Deserialize(bytes);
    }

    clanView.FontStyle = EnumProxy.Deserialize<GroupFontStyle>(bytes);
    clanView.FoundingDate = DateTimeProxy.Deserialize(bytes);
    clanView.GroupId = Int32Proxy.Deserialize(bytes);
    clanView.LastUpdated = DateTimeProxy.Deserialize(bytes);

    if ((num & 4) !== 0) {
      clanView.Members = ListProxy.Deserialize<ClanMemberView>(bytes, ClanMemberViewProxy.Deserialize);
    }

    clanView.MembersCount = Int32Proxy.Deserialize(bytes);
    clanView.MembersLimit = Int32Proxy.Deserialize(bytes);

    if ((num & 8) !== 0) {
      clanView.Motto = StringProxy.Deserialize(bytes);
    }

    if ((num & 16) !== 0) {
      clanView.Name = StringProxy.Deserialize(bytes);
    }

    clanView.OwnerCmid = Int32Proxy.Deserialize(bytes);

    if ((num & 32) !== 0) {
      clanView.OwnerName = StringProxy.Deserialize(bytes);
    }

    if ((num & 64) !== 0) {
      clanView.Picture = StringProxy.Deserialize(bytes);
    }

    if ((num & 128) !== 0) {
      clanView.Tag = StringProxy.Deserialize(bytes);
    }

    clanView.Type = EnumProxy.Deserialize<GroupType>(bytes);

    return clanView;
  }
}
