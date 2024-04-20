using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using static Paradise.Client.ParadisePrefs;

namespace Paradise.Client {
	internal static class ParadiseMainMenuMusicManager {
		public static readonly Dictionary<MainMenuMusicType, AudioClip> MenuAudio = new Dictionary<MainMenuMusicType, AudioClip> {
			[MainMenuMusicType.None] = null,
			[MainMenuMusicType.Default] = GameAudio.HomeSceneBackground
		};

		public static void LoadMainMenuMusic() {
			foreach (MainMenuMusicType type in Enum.GetValues(typeof(MainMenuMusicType))) {
				var resource = string.Empty;

				switch (type) {
					case MainMenuMusicType.Seletron:
						resource = "SeletronRadio-Short.ogg";
						break;
					case MainMenuMusicType.Catalyst:
						resource = "0305-Catalyst2D_V2.ogg";
						break;
					case MainMenuMusicType.ApexTwin:
						resource = "0416-ApexTwinTowers_V4Gandhi.ogg";
						break;
					case MainMenuMusicType.GhostIsland:
						resource = "1017-Halloween MusicSELODEMO_V3.ogg";
						break;
					case MainMenuMusicType.DangerZone:
						resource = "0503-Volley_V1.ogg";
						break;
				}

				if (!string.IsNullOrEmpty(resource)) {
					UnityRuntime.StartRoutine(GetAudio(resource, (AudioClip clip) => {
						MenuAudio[type] = clip;
					}));
				}
			}
		}

		private static IEnumerator GetAudio(string resource, Action<AudioClip> callback) {
			if (!string.IsNullOrEmpty(resource)) {
				var resourceUri = string.Join("/", new[] { Application.dataPath, "Resources", resource });

				if (File.Exists(resourceUri)) {
					using (var request = new WWW("file://" + resourceUri)) {
						while (!request.isDone) {
							yield return null;
						}

						if (request.isDone) {
							callback(request.GetAudioClip(false));
							yield break;
						}
					}
				}
			}

			yield break;
		}
	}
}
