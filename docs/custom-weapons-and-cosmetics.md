# Custom weapons & cosmetics (incl. the "Nyan Cat Gun")

## What's possible purely in data (no client work)
A shop weapon/gear item is just a row in `packages/ws/src/seed/shop.json`. You can add new items,
re-tune stats, and price them **as long as the item's `PrefabName` points at a prefab that already
ships inside the client**. The client looks the weapon model/projectile up by `PrefabName`, so a
data-only item always *re-uses* an existing weapon's visuals.

We shipped a novelty example: **Nyan Cat Cannon** (`ID 20144`, weapon class 6 / launcher). It clones
the Cannon (`PrefabName: "Cannon"`), with a rainbow-themed name/description, Tier 4, faster rockets,
and a premium price (2800 Credits / 45000 Points, permanent). It is fully buyable and usable today —
but it **looks like a Cannon firing rockets**, not literal Nyan Cats.

## What needs real asset work (a custom Nyan Cat projectile)
Making the gun actually fire flying Nyan Cats (rainbow trail, pop-tart cat sprite, the song) requires
new **Unity assets** that are *not* in the stock client:
1. A weapon prefab + a projectile prefab (mesh/sprite + particle/trail + audio).
2. Building those into an **AssetBundle** the client can load by name.
3. Loading that bundle in the NekoNexus client mod and registering the new `PrefabName`, then
   pointing the shop item at it.

Steps 1-2 are art/Unity-editor tasks (can't be done from server code). Once the bundle exists, wiring
it into `packages/Client/Current/NekoNexus.Client` (load bundle on startup, map `PrefabName ->` the
bundled prefab) and setting the shop item's `PrefabName` to it is straightforward code.

**Recommendation:** ship the data-only Nyan Cat Cannon now (done), and treat the real Nyan visuals as
a follow-up that starts with an artist/Unity asset. If you can provide a `.unity3d` AssetBundle with a
`NyanCatProjectile` prefab, the client-side loader is a small addition.

## Adding more cosmetic items
Gear (hats/faces/gloves/etc.) lives under `shop.json` `GearItems` with an `ItemClass` per slot and a
`PrefabName`. Same rule: data-only items must reuse a shipped prefab. New visuals need an AssetBundle.
Prices are set the same way (Currency 1 = Credits, 2 = Points; Duration 5 = Permanent) and applied to
existing databases by running `seed` (see the shop economy commit).
