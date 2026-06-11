using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using static NekoNexus.Client.NekoNexusPrefs;

namespace NekoNexus.Client {
	internal static class NekoNexusMainMenuMusicManager {
		public static readonly Dictionary<MainMenuMusicType, AudioClip> MenuAudio = new Dictionary<MainMenuMusicType, AudioClip> {
			[MainMenuMusicType.None] = null,
			[MainMenuMusicType.Default] = GameAudio.HomeSceneBackground
		};

		// Safe lookup. The themed tracks load from loose .ogg files in UberStrike_Data/Resources/;
		// if one was never shipped (or fails to load) its dictionary key is missing, and a raw
		// MenuAudio[type] lookup throws KeyNotFoundException - which is what made every theme appear
		// "broken". Fall back to the default menu track instead so selection always works.
		public static AudioClip GetClip(MainMenuMusicType type) {
			if (type == MainMenuMusicType.None) {
				return null;
			}

			return MenuAudio.TryGetValue(type, out var clip) && clip != null ? clip : GameAudio.HomeSceneBackground;
		}

		public static void LoadMainMenuMusic() {
			foreach (MainMenuMusicType type in Enum.GetValues(typeof(MainMenuMusicType))) {
				// Guarantee every theme has an entry up-front so selection never crashes; the real
				// track (when its .ogg is present in Resources/) overwrites this once it loads.
				if (!MenuAudio.ContainsKey(type)) {
					MenuAudio[type] = type == MainMenuMusicType.None ? null : GameAudio.HomeSceneBackground;
				}

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
						resource = "1017-Halloween_MusicSELODEMO_V3.ogg";
						break;
					case MainMenuMusicType.DangerZone:
						resource = "0503-Volley_V1.ogg";
						break;
				}

				if (!string.IsNullOrEmpty(resource)) {
					UnityRuntime.StartRoutine(GetAudio(resource, (AudioClip clip) => {
						// Only overwrite the fallback when the real track actually loaded.
						if (clip != null) {
							MenuAudio[type] = clip;
						}
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
