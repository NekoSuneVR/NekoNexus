using System;
using HarmonyLib;
using System.Collections.Generic;
using System.Linq;
using UberStrike.DataCenter.Common.Entities;
using UberStrike.Realtime.UnitySdk;
using UnityEngine;

namespace Paradise.Client {
	[HarmonyPatch(typeof(StatsPageGUI))]
	public static class StatsPageGUIHook {
		private static ParadiseTraverse<StatsPageGUI> traverse;

		[HarmonyPatch("Awake"), HarmonyPrefix]
		public static bool Awake_Postfix(StatsPageGUI __instance) {
			if (traverse == null) {
				traverse = ParadiseTraverse<StatsPageGUI>.Create(__instance);
			}

			return true;
		}

		[HarmonyPatch("Start"), HarmonyPostfix]
		public static void Start_Postfix(StatsPageGUI __instance) {
			traverse.SetField("_weaponIcons", new Dictionary<string, Texture2D> {
				[LocalizedStrings.MeleeWeapons] = ShopIcons.StatsMostWeaponSplatsMelee,
				[ParadiseLocalizedStrings.Handguns] = ShopIcons.StatsMostWeaponSplatsHandgun,
				[LocalizedStrings.Machineguns] = ShopIcons.StatsMostWeaponSplatsMachinegun,
				[LocalizedStrings.Cannons] = ShopIcons.StatsMostWeaponSplatsCannon,
				[LocalizedStrings.Shotguns] = ShopIcons.StatsMostWeaponSplatsShotgun,
				[LocalizedStrings.Splatterguns] = ShopIcons.StatsMostWeaponSplatsSplattergun,
				[LocalizedStrings.Launchers] = ShopIcons.StatsMostWeaponSplatsLauncher,
				[LocalizedStrings.SniperRifles] = ShopIcons.StatsMostWeaponSplatsSniperRifle,
			});
		}

		[HarmonyPatch("DrawPersonalStatsTab"), HarmonyPrefix]
		public static bool DrawPersonalStatsTab(Rect rect) {
			traverse.SetField("_scrollGeneral", GUITools.BeginScrollView(rect, traverse.GetField<Vector2>("_scrollGeneral"), new Rect(0f, 0f, 340f, 915f), false, false, true));

			int num = Mathf.RoundToInt((rect.width - 80f) * 0.5f);
			PlayerPersonalRecordStatisticsView personalRecord = Singleton<PlayerDataManager>.Instance.ServerLocalPlayerStatisticsView.PersonalRecord;
			traverse.InvokeMethod("DrawGroupControl", new Rect(14f, 16f, rect.width - 40f, 100f), LocalizedStrings.LevelAndXP, BlueStonez.label_group_interparkbold_18pt);
			traverse.InvokeMethod("DrawXPMeter", new Rect(24f, 32f, rect.width - 60f, 64f));
			traverse.InvokeMethod("DrawGroupControl", new Rect(14f, 142f, rect.width - 40f, 405f), LocalizedStrings.PersonalRecordsPerLife, BlueStonez.label_group_interparkbold_18pt);
			traverse.InvokeMethod("DrawPersonalStat", 36, 158, num, LocalizedStrings.MostKills, personalRecord.MostSplats.ToString(), traverse.GetField<Texture2D>("_mostSplatsIcon"));
			traverse.InvokeMethod("DrawPersonalStat", 36, 234, num, LocalizedStrings.MostDamageDealt, personalRecord.MostDamageDealt.ToString(), traverse.GetField<Texture2D>("_mostDamageDealtIcon"));
			traverse.InvokeMethod("DrawPersonalStat", 36, 310, num, LocalizedStrings.MostHealthPickedUp, personalRecord.MostHealthPickedUp.ToString(), traverse.GetField<Texture2D>("_mostHealthPickedUpIcon"));
			traverse.InvokeMethod("DrawPersonalStat", 36, 386, num, LocalizedStrings.MostHeadshots, personalRecord.MostHeadshots.ToString(), traverse.GetField<Texture2D>("_mostHeadshotsIcon"));
			traverse.InvokeMethod("DrawPersonalStat", 36, 462, num, LocalizedStrings.MostConsecutiveSnipes, personalRecord.MostConsecutiveSnipes.ToString(), traverse.GetField<Texture2D>("_mostConsecutiveSnipesIcon"));
			traverse.InvokeMethod("DrawPersonalStat", 36 + num, 158, num, LocalizedStrings.MostXPEarned, personalRecord.MostXPEarned.ToString(), traverse.GetField<Texture2D>("_mostXPEarnedIcon"));
			traverse.InvokeMethod("DrawPersonalStat", 36 + num, 234, num, LocalizedStrings.MostDamageReceived, personalRecord.MostDamageReceived.ToString(), traverse.GetField<Texture2D>("_mostDamageReceivedIcon"));
			traverse.InvokeMethod("DrawPersonalStat", 36 + num, 310, num, LocalizedStrings.MostArmorPickedUp, personalRecord.MostArmorPickedUp.ToString(), traverse.GetField<Texture2D>("_mostArmorPickedUpIcon"));
			traverse.InvokeMethod("DrawPersonalStat", 36 + num, 386, num, LocalizedStrings.MostNutshots, personalRecord.MostNutshots.ToString(), traverse.GetField<Texture2D>("_mostNutshotsIcon"));
			traverse.InvokeMethod("DrawGroupControl", new Rect(14f, 575f, traverse.GetField<Rect>("statsPage").width - 40f, 328f), "Weapon Records (per Life)", BlueStonez.label_group_interparkbold_18pt);
			traverse.InvokeMethod("DrawPersonalStat", 36, 593, num, LocalizedStrings.MostMeleeKills, personalRecord.MostMeleeSplats.ToString(), traverse.GetField<Texture2D>("_mostMeleeSplatsIcon"));
			traverse.InvokeMethod("DrawPersonalStat", 36, 669, num, ParadiseLocalizedStrings.MostHandgunKills, personalRecord.GetProps().MostHandgunSplats.ToString(), ShopIcons.StatsMostWeaponSplatsHandgun);
			traverse.InvokeMethod("DrawPersonalStat", 36, 745, num, LocalizedStrings.MostMachinegunKills, personalRecord.MostMachinegunSplats.ToString(), traverse.GetField<Texture2D>("_mostMachinegunSplatsIcon"));
			traverse.InvokeMethod("DrawPersonalStat", 36, 821, num, LocalizedStrings.MostShotgunKills, personalRecord.MostShotgunSplats.ToString(), traverse.GetField<Texture2D>("_mostShotgunSplatsIcon"));
			traverse.InvokeMethod("DrawPersonalStat", 36 + num, 593, num, LocalizedStrings.MostSplattergunKills, personalRecord.MostSplattergunSplats.ToString(), traverse.GetField<Texture2D>("_mostSplattergunSplatsIcon"));
			traverse.InvokeMethod("DrawPersonalStat", 36 + num, 669, num, LocalizedStrings.MostCannonKills, personalRecord.MostCannonSplats.ToString(), traverse.GetField<Texture2D>("_mostCannonSplatsIcon"));
			traverse.InvokeMethod("DrawPersonalStat", 36 + num, 745, num, LocalizedStrings.MostSniperRifleKills, personalRecord.MostSniperSplats.ToString(), traverse.GetField<Texture2D>("_mostSniperSplatsIcon"));
			traverse.InvokeMethod("DrawPersonalStat", 36 + num, 821, num, LocalizedStrings.MostLauncherKills, personalRecord.MostLauncherSplats.ToString(), traverse.GetField<Texture2D>("_mostLauncherSplatsIcon"));
			GUITools.EndScrollView();

			return false;
		}

		[HarmonyPatch("UpdateWeaponStatList"), HarmonyPrefix]
		public static bool UpdateWeaponStatList_Prefix() {
			var _weaponStatList = traverse.GetField<CmunePairList<float, string>>("_weaponStatList");
			_weaponStatList.Clear();

			var weaponStatistics = Singleton<PlayerDataManager>.Instance.ServerLocalPlayerStatisticsView.WeaponStatistics;
			var _selectedFilterIndex = traverse.GetField<int>("_selectedFilterIndex");

			switch (_selectedFilterIndex) {
				case 0:
					_weaponStatList.Add(weaponStatistics.MeleeTotalDamageDone, LocalizedStrings.MeleeWeapons);
					_weaponStatList.Add(weaponStatistics.GetProps().HandgunTotalDamageDone, ParadiseLocalizedStrings.Handguns);
					_weaponStatList.Add(weaponStatistics.MachineGunTotalDamageDone, LocalizedStrings.Machineguns);
					_weaponStatList.Add(weaponStatistics.CannonTotalDamageDone, LocalizedStrings.Cannons);
					_weaponStatList.Add(weaponStatistics.ShotgunTotalDamageDone, LocalizedStrings.Shotguns);
					_weaponStatList.Add(weaponStatistics.SplattergunTotalDamageDone, LocalizedStrings.Splatterguns);
					_weaponStatList.Add(weaponStatistics.LauncherTotalDamageDone, LocalizedStrings.Launchers);
					_weaponStatList.Add(weaponStatistics.SniperTotalDamageDone, LocalizedStrings.SniperRifles);

					traverse.SetField("_currentStatsType", 0);
					break;
				case 1:
					_weaponStatList.Add(weaponStatistics.MeleeTotalSplats, LocalizedStrings.MeleeWeapons);
					_weaponStatList.Add(weaponStatistics.GetProps().HandgunTotalSplats, ParadiseLocalizedStrings.Handguns);
					_weaponStatList.Add(weaponStatistics.MachineGunTotalSplats, LocalizedStrings.Machineguns);
					_weaponStatList.Add(weaponStatistics.CannonTotalSplats, LocalizedStrings.Cannons);
					_weaponStatList.Add(weaponStatistics.ShotgunTotalSplats, LocalizedStrings.Shotguns);
					_weaponStatList.Add(weaponStatistics.SplattergunTotalSplats, LocalizedStrings.Splatterguns);
					_weaponStatList.Add(weaponStatistics.LauncherTotalSplats, LocalizedStrings.Launchers);
					_weaponStatList.Add(weaponStatistics.SniperTotalSplats, LocalizedStrings.SniperRifles);

					traverse.SetField("_currentStatsType", 0);
					break;
				case 2:
					_weaponStatList.Add((weaponStatistics.MeleeTotalShotsHit != 0) ? (Mathf.Clamp01(weaponStatistics.MeleeTotalShotsHit / weaponStatistics.MeleeTotalShotsFired) * 100f) : 0f, LocalizedStrings.MeleeWeapons);
					_weaponStatList.Add((weaponStatistics.GetProps().HandgunTotalShotsHit != 0) ? (Mathf.Clamp01(weaponStatistics.GetProps().HandgunTotalShotsHit / weaponStatistics.GetProps().HandgunTotalShotsFired) * 100f) : 0f, ParadiseLocalizedStrings.Handguns);
					_weaponStatList.Add((weaponStatistics.MachineGunTotalShotsHit != 0) ? (Mathf.Clamp01(weaponStatistics.MachineGunTotalShotsHit / weaponStatistics.MachineGunTotalShotsFired) * 100f) : 0f, LocalizedStrings.Machineguns);
					_weaponStatList.Add((weaponStatistics.CannonTotalShotsHit != 0) ? (Mathf.Clamp01(weaponStatistics.CannonTotalShotsHit / weaponStatistics.CannonTotalShotsFired) * 100f) : 0f, LocalizedStrings.Cannons);
					_weaponStatList.Add((weaponStatistics.ShotgunTotalShotsHit != 0) ? (Mathf.Clamp01(weaponStatistics.ShotgunTotalShotsHit / weaponStatistics.ShotgunTotalShotsFired) * 100f) : 0f, LocalizedStrings.Shotguns);
					_weaponStatList.Add((weaponStatistics.SplattergunTotalShotsHit != 0) ? (Mathf.Clamp01(weaponStatistics.SplattergunTotalShotsHit / weaponStatistics.SplattergunTotalShotsFired) * 100f) : 0f, LocalizedStrings.Splatterguns);
					_weaponStatList.Add((weaponStatistics.LauncherTotalShotsHit != 0) ? (Mathf.Clamp01(weaponStatistics.LauncherTotalShotsHit / weaponStatistics.LauncherTotalShotsFired) * 100f) : 0f, LocalizedStrings.Launchers);
					_weaponStatList.Add((weaponStatistics.SniperTotalShotsHit != 0) ? (Mathf.Clamp01(weaponStatistics.SniperTotalShotsHit / weaponStatistics.SniperTotalShotsFired) * 100f) : 0f, LocalizedStrings.SniperRifles);

					traverse.SetField("_currentStatsType", 1);
					break;
				case 3:
					_weaponStatList.Add(weaponStatistics.MeleeTotalShotsHit, LocalizedStrings.MeleeWeapons);
					_weaponStatList.Add(weaponStatistics.GetProps().HandgunTotalShotsHit, ParadiseLocalizedStrings.Handguns);
					_weaponStatList.Add(weaponStatistics.MachineGunTotalShotsHit, LocalizedStrings.Machineguns);
					_weaponStatList.Add(weaponStatistics.CannonTotalShotsHit, LocalizedStrings.Cannons);
					_weaponStatList.Add(weaponStatistics.ShotgunTotalShotsHit, LocalizedStrings.Shotguns);
					_weaponStatList.Add(weaponStatistics.SplattergunTotalShotsHit, LocalizedStrings.Splatterguns);
					_weaponStatList.Add(weaponStatistics.LauncherTotalShotsHit, LocalizedStrings.Launchers);
					_weaponStatList.Add(weaponStatistics.SniperTotalShotsHit, LocalizedStrings.SniperRifles);

					traverse.SetField("_currentStatsType", 0);
					break;
			}

			//if (_weaponStatList.Any(_ => _.Key > 0)) {
				_weaponStatList.Sort((KeyValuePair<float, string> a, KeyValuePair<float, string> b) => -a.Key.CompareTo(b.Key));
			//}

			var _maxWeaponStat = 0f;
			foreach (KeyValuePair<float, string> keyValuePair in _weaponStatList) {
				if (keyValuePair.Key > _maxWeaponStat) {
					_maxWeaponStat = keyValuePair.Key;
				}
			}

			traverse.SetField("_weaponStatList", _weaponStatList);
			traverse.SetField("_maxWeaponStat", _maxWeaponStat);

			return false;
		}

		[HarmonyPatch("DrawWeaponsStatsTab"), HarmonyPrefix]
		public static bool DrawWeaponsStatsTab_Prefix(StatsPageGUI __instance, Rect rect) {
			try {
				var enabled = GUI.enabled;
				GUI.enabled = !traverse.GetField<bool>("_isFilterDropDownOpen");
				GUI.changed = false;

				var index = UnityGUI.Toolbar(new Rect(2f, 5f, rect.width - 4f, 22f), traverse.GetField<int>("_selectedFilterIndex"), traverse.GetField<string[]>("_selectionsToShow"), 4, BlueStonez.tab_medium);

				if (GUI.changed) {
					AutoMonoBehaviour<SfxManager>.Instance.Play2dAudioClip(GameAudio.ButtonClick, 0UL, 1f, 1f);
				}

				if (index != traverse.GetField<int>("_selectedFilterIndex")) {
					traverse.SetField("_selectedFilterIndex", index);
					traverse.InvokeMethod("UpdateWeaponStatList");
				}

				string text = LocalizedStrings.WeaponPerformaceTotal;
				switch (index) {
					case 0:
						text = LocalizedStrings.BestWeaponByDamageDealt;
						break;
					case 1:
						text = LocalizedStrings.BestWeaponByKills;
						break;
					case 2:
						text = LocalizedStrings.BestWeaponByAccuracy;
						break;
					case 3:
						text = LocalizedStrings.BestWeaponByHits;
						break;
				}

				traverse.SetField("_scrollGeneral", GUITools.BeginScrollView(new Rect(0f, 26f, rect.width - 2f, rect.height - 26f), traverse.GetField<Vector2>("_scrollGeneral"), new Rect(0f, 0f, 340f, 680f), false, false, true));
				traverse.InvokeMethod("DrawGroupControl", new Rect(14f, 16f, rect.width - 40f, 646f), text, BlueStonez.label_group_interparkbold_18pt);

				var width = Mathf.RoundToInt((traverse.GetField<Rect>("statsPage").width - 80f) * 0.5f);
				var yIndex = 0;

				foreach (KeyValuePair<float, string> keyValuePair in traverse.GetField<CmunePairList<float, string>>("_weaponStatList")) {
					var _maxWeaponStat = traverse.GetField<float>("_maxWeaponStat");

					var barValue = ((index != 2) ? ((_maxWeaponStat <= 0f) ? 0f : (keyValuePair.Key / _maxWeaponStat)) : (keyValuePair.Key / 100f));
					traverse.InvokeMethod("DrawWeaponStat", new Rect(36f, (32 + yIndex * 76), width, 60f), keyValuePair.Value, keyValuePair.Key, barValue, traverse.GetField<Dictionary<string, Texture2D>>("_weaponIcons")[keyValuePair.Value]);
					yIndex++;
				}

				GUITools.EndScrollView();
				GUI.enabled = enabled;
			} catch (Exception e) {
				Debug.LogError(e);
			}

			return false;
		}
	}
}
