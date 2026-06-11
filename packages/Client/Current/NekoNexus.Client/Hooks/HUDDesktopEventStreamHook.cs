using HarmonyLib;
using UberStrike.Core.Models;
using UberStrike.Core.Types;

namespace NekoNexus.Client {
	/// <summary>
	/// Adds the name of the weapon a player has been killed with to the killfeed.
	/// </summary>
	[HarmonyPatch(typeof(HUDDesktopEventStream))]
	public static class HUDDesktopEventStreamHook {
		[HarmonyPatch("HandleKilledMessage"), HarmonyPrefix]
		public static bool HandleKilledMessage_Prefix(GameActorInfo shooter, GameActorInfo target, UberstrikeItemClass weapon, BodyPart bodyPart) {
			if (GameState.Current.GameMode == GameModeType.None) {
				return false;
			}

			if (target == null) {
				return false;
			}

			if (shooter == null || shooter == target) {
				GameData.Instance.OnHUDStreamMessage.Fire(target, LocalizedStrings.NKilledThemself, null);
			} else {
				if (!NekoNexusClient.Settings.ShowWeaponInKillfeed)
					return true;

				var weaponName = Singleton<ItemManager>.Instance.GetItemInShop(shooter.CurrentWeaponID).Name;
				string killString;

				if (weapon == UberstrikeItemClass.WeaponMelee) {
					killString = $"[{weaponName}] smacked";
				} else if (bodyPart == BodyPart.Head) {
					killString = $"[{weaponName}] headshot";
				} else if (bodyPart == BodyPart.Nuts) {
					killString = $"[{weaponName}] nutshot";
				} else {
					killString = $"[{weaponName}] killed";
				}

				GameData.Instance.OnHUDStreamMessage.Fire(shooter, killString, target);
			}

			return false;
		}
	}
}
