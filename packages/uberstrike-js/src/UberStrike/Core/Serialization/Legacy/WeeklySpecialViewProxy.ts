import { WeeklySpecialView } from '@/Cmune/DataCenter/Common/Entities';
import DateTimeProxy from '../DateTimeProxy';
import Int32Proxy from '../Int32Proxy';
import StringProxy from '../StringProxy';

export default class WeeklySpecialViewProxy {
  public static Serialize(stream: Stream, instance: WeeklySpecialView): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      if (instance.EndDate) {
        DateTimeProxy.Serialize(memoryStream, instance.EndDate);
      } else {
        num |= 1;
      }
      Int32Proxy.Serialize(memoryStream, instance.Id);
      if (instance.ImageUrl) {
        StringProxy.Serialize(memoryStream, instance.ImageUrl);
      } else {
        num |= 2;
      }
      Int32Proxy.Serialize(memoryStream, instance.ItemId);
      DateTimeProxy.Serialize(memoryStream, instance.StartDate);
      if (instance.Text) {
        StringProxy.Serialize(memoryStream, instance.Text);
      } else {
        num |= 4;
      }
      if (instance.Title) {
        StringProxy.Serialize(memoryStream, instance.Title);
      } else {
        num |= 8;
      }
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): WeeklySpecialView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let weeklySpecialView: WeeklySpecialView | null = null;
    if (num !== 0) {
      weeklySpecialView = new WeeklySpecialView();
      if ((num & 1) !== 0) {
        weeklySpecialView.EndDate = DateTimeProxy.Deserialize(bytes);
      }
      weeklySpecialView.Id = Int32Proxy.Deserialize(bytes);
      if ((num & 2) !== 0) {
        weeklySpecialView.ImageUrl = StringProxy.Deserialize(bytes);
      }
      weeklySpecialView.ItemId = Int32Proxy.Deserialize(bytes);
      weeklySpecialView.StartDate = DateTimeProxy.Deserialize(bytes);
      if ((num & 4) !== 0) {
        weeklySpecialView.Text = StringProxy.Deserialize(bytes);
      }
      if ((num & 8) !== 0) {
        weeklySpecialView.Title = StringProxy.Deserialize(bytes);
      }
    }
    return weeklySpecialView;
  }
}
