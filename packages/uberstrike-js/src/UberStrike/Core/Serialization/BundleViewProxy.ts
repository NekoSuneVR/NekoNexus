import { BundleCategoryType, BundleItemView, BundleView, ChannelType } from '@/Cmune/DataCenter/Common/Entities';
import BooleanProxy from './BooleanProxy';
import BundleItemViewProxy from './BundleItemViewProxy';
import DecimalProxy from './DecimalProxy';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';
import ListProxy from './ListProxy';
import StringProxy from './StringProxy';

export default class BundleViewProxy {
  public static Serialize(stream: Stream, instance: BundleView): void {
    let num = 0;
    const memoryStream: MemoryStream = [];

    if (instance.AndroidStoreUniqueId) {
      StringProxy.Serialize(memoryStream, instance.AndroidStoreUniqueId);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.ApplicationId);

    if (instance.Availability) {
      ListProxy.Serialize<ChannelType>(memoryStream, instance.Availability, EnumProxy.Serialize<ChannelType>);
    } else {
      num |= 2;
    }

    if (instance.BundleItemViews) {
      ListProxy.Serialize<BundleItemView>(memoryStream, instance.BundleItemViews, BundleItemViewProxy.Serialize);
    } else {
      num |= 4;
    }

    EnumProxy.Serialize<BundleCategoryType>(memoryStream, instance.Category);
    Int32Proxy.Serialize(memoryStream, instance.Credits);

    if (instance.Description) {
      StringProxy.Serialize(memoryStream, instance.Description);
    } else {
      num |= 8;
    }

    if (instance.IconUrl) {
      StringProxy.Serialize(memoryStream, instance.IconUrl);
    } else {
      num |= 16;
    }

    Int32Proxy.Serialize(memoryStream, instance.Id);

    if (instance.ImageUrl) {
      StringProxy.Serialize(memoryStream, instance.ImageUrl);
    } else {
      num |= 32;
    }

    if (instance.IosAppStoreUniqueId) {
      StringProxy.Serialize(memoryStream, instance.IosAppStoreUniqueId);
    } else {
      num |= 64;
    }

    BooleanProxy.Serialize(memoryStream, instance.IsDefault);
    BooleanProxy.Serialize(memoryStream, instance.IsOnSale);
    BooleanProxy.Serialize(memoryStream, instance.IsPromoted);

    if (instance.MacAppStoreUniqueId) {
      StringProxy.Serialize(memoryStream, instance.MacAppStoreUniqueId);
    } else {
      num |= 128;
    }

    if (instance.Name) {
      StringProxy.Serialize(memoryStream, instance.Name);
    } else {
      num |= 256;
    }

    Int32Proxy.Serialize(memoryStream, instance.Points);

    if (instance.PromotionTag) {
      StringProxy.Serialize(memoryStream, instance.PromotionTag);
    } else {
      num |= 512;
    }

    DecimalProxy.Serialize(memoryStream, instance.USDPrice);
    DecimalProxy.Serialize(memoryStream, instance.USDPromoPrice);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): BundleView {
    const num = Int32Proxy.Deserialize(bytes);
    const bundleView = new BundleView();

    if ((num & 1) !== 0) {
      bundleView.AndroidStoreUniqueId = StringProxy.Deserialize(bytes);
    }

    bundleView.ApplicationId = Int32Proxy.Deserialize(bytes);

    if ((num & 2) !== 0) {
      bundleView.Availability = ListProxy.Deserialize<ChannelType>(bytes, EnumProxy.Deserialize<ChannelType>);
    }

    if ((num & 4) !== 0) {
      bundleView.BundleItemViews = ListProxy.Deserialize<BundleItemView>(bytes, BundleItemViewProxy.Deserialize);
    }

    bundleView.Category = EnumProxy.Deserialize<BundleCategoryType>(bytes);
    bundleView.Credits = Int32Proxy.Deserialize(bytes);

    if ((num & 8) !== 0) {
      bundleView.Description = StringProxy.Deserialize(bytes);
    }

    if ((num & 16) !== 0) {
      bundleView.IconUrl = StringProxy.Deserialize(bytes);
    }

    bundleView.Id = Int32Proxy.Deserialize(bytes);

    if ((num & 32) !== 0) {
      bundleView.ImageUrl = StringProxy.Deserialize(bytes);
    }

    if ((num & 64) !== 0) {
      bundleView.IosAppStoreUniqueId = StringProxy.Deserialize(bytes);
    }

    bundleView.IsDefault = BooleanProxy.Deserialize(bytes);
    bundleView.IsOnSale = BooleanProxy.Deserialize(bytes);
    bundleView.IsPromoted = BooleanProxy.Deserialize(bytes);

    if ((num & 128) !== 0) {
      bundleView.MacAppStoreUniqueId = StringProxy.Deserialize(bytes);
    }

    if ((num & 256) !== 0) {
      bundleView.Name = StringProxy.Deserialize(bytes);
    }

    bundleView.Points = Int32Proxy.Deserialize(bytes);

    if ((num & 512) !== 0) {
      bundleView.PromotionTag = StringProxy.Deserialize(bytes);
    }

    bundleView.USDPrice = DecimalProxy.Deserialize(bytes);
    bundleView.USDPromoPrice = DecimalProxy.Deserialize(bytes);

    return bundleView;
  }
}
