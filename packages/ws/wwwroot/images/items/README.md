# Item icons for the web shop

The website shop (`/shop`) and inventory/loadout views look for each item's icon at:

```
/images/items/<ItemID>.png
```

(served by the file server from this folder, e.g. `images/items/1001.png`). When an icon
is missing the page falls back to a coloured placeholder showing the item's initial, so the
shop works with or without icons — drop icons in here to make it look right.

## Where the IDs come from

`<ItemID>` is the `ID` column of the shop catalogue tables (`ShopWeaponItems`,
`ShopGearItems`, `ShopQuickItems`, `ShopFunctionalItems`). The same ID the game uses.

## Getting the actual game icons

The real icons live inside the UberStrike client's Unity **AssetBundles** (the in-game shop
loads them by the item's `PrefabName`). They are not shipped as loose PNGs anywhere in this
repo, so they have to be extracted once from the client assets:

1. Open the client's item asset bundle (see
   `packages/ws/wwwroot/UberStrike/Items/4.3.10/ItemAssetBundle.xml` for the prefab list)
   with a Unity asset tool (e.g. AssetStudio / AssetRipper).
2. Export each item's icon texture (usually a sprite named after the prefab) as PNG.
3. Rename each PNG to `<ItemID>.png` (map prefab -> ID via the `PrefabName`/`ID` columns)
   and copy it into this folder.

A square image (e.g. 128x128 or 256x256) with transparency looks best in the grid.

## Deploy

This folder is served by the file server container; after adding icons, redeploy / sync the
`wwwroot` the file server mounts (same place map icons live). No DB change is needed — the URL
is derived from the item ID.
