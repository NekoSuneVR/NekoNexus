import { MapView } from '@/UberStrike/Core/Models/Views';

export default class UberstrikeLevelViewModel {
  public Maps: List<MapView> = [];

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
