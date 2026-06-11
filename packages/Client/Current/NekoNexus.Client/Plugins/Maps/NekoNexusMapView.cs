using System;

namespace UberStrike.Core.Models.Views {
	[Serializable]
	public class NekoNexusMapView : MapView {
		public string FileName { get; set; }
		public NekoNexusMapView() { }

		public NekoNexusMapView(MapView map) {
			Description = map.Description;
			DisplayName = map.DisplayName;
			IsBlueBox = map.IsBlueBox;
			MapId = map.MapId;
			MaxPlayers = map.MaxPlayers;
			RecommendedItemId = map.RecommendedItemId;
			SceneName = map.SceneName;
			Settings = map.Settings;
			SupportedGameModes = map.SupportedGameModes;
			SupportedItemClass = map.SupportedItemClass;
		}
	}
}
