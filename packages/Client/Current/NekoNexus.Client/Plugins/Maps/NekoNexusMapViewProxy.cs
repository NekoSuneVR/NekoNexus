using System.IO;
using UberStrike.Core.Models.Views;

namespace UberStrike.Core.Serialization {
	public static class NekoNexusMapViewProxy {
		public static void Serialize(Stream stream, NekoNexusMapView instance) {
			using (var memoryStream = new MemoryStream()) {
				MapViewProxy.Serialize(memoryStream, instance);
				StringProxy.Serialize(memoryStream, instance.FileName);
				memoryStream.WriteTo(stream);
			}
		}

		public static NekoNexusMapView Deserialize(Stream bytes) {
			var mapView = MapViewProxy.Deserialize(bytes);

			return new NekoNexusMapView(mapView) {
				FileName = StringProxy.Deserialize(bytes)
			};
		}
	}
}
