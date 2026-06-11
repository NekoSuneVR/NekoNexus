# Hosting NekoNexus on a domain (HTTPS) + game servers

The most important thing to understand: **NekoNexus has two kinds of traffic, and they're
exposed differently.**

| Traffic | Ports | Protocol | How to expose |
|---|---|---|---|
| Web services (login, shop, files) | 8080 (`/2.0`), 8081 (`/images`,`/updates`) | **HTTP(S)** | reverse proxy / tunnel → **one domain** |
| Realtime game servers (lobby + game) | 5055 (Comm), 5155 (Game) | **UDP** | **direct port-forward** to your public IP |
| Master socket (realtime → web service) | 8082 | TCP, internal | **do not expose** (server-to-server only) |

> ⚠️ The lobby/game servers are **UDP**. Cloudflare Tunnel and nginx/NPM proxy **HTTP only** —
> they **cannot** carry the UDP game traffic. So: web behind the domain, game UDP forwarded
> directly. This is normal for game servers.

## Step 1 — Web behind one HTTPS domain

Pick whichever is easier for you:

### Option A — Cloudflare Tunnel (easiest, no port-forwarding, free HTTPS) ✅ recommended
1. `cloudflared tunnel login`, then `cloudflared tunnel create nekonexus`.
2. Route your hostname to the local web ports. Example `config.yml`:
   ```yaml
   tunnel: <tunnel-id>
   ingress:
     - hostname: nekonexus.yourdomain.com
       path: /2.0/*
       service: http://localhost:8080
     - hostname: nekonexus.yourdomain.com
       path: /images/*
       service: http://localhost:8081
     - hostname: nekonexus.yourdomain.com
       path: /updates/*
       service: http://localhost:8081
     - hostname: nekonexus.yourdomain.com
       service: http://localhost:8081
   ```
3. `cloudflared tunnel run nekonexus`. You now have `https://nekonexus.yourdomain.com`.

### Option B — Nginx Proxy Manager (self-hosted, GUI)
- Forward router ports 80/443 → the NPM host.
- Add a Proxy Host for `nekonexus.yourdomain.com` with custom locations:
  `/2.0` → `http://<server>:8080`, `/images` + `/updates` → `http://<server>:8081`.
- Or just use `misc/reverse-proxy/nginx.conf` / `Caddyfile` directly.

**Easiest to test:** Cloudflare Tunnel — no router changes for the web part.

## Step 2 — Game servers (UDP) on your public IP

The lobby and game servers each have their own `ip:port`:
- Open **UDP 5055** (Comm) and **UDP 5155** (Game) on your firewall, and port-forward them on
  your router to the machine running the realtime servers.
- In the **Admin dashboard → Servers**, set each server's **IP** to your **public IP** (or a DNS
  name that resolves to it) and the correct **Port** (5055 / 5155), and pick the **Region**.
  (Locally you can keep `127.0.0.1`.)

The web service hands these to the client, which connects directly over UDP. If you run multiple
game servers, give each its own UDP port + a row in the dashboard.

## Step 3 — Point the client at the domain

Patch the client at your domain (HTTPS), or set it in-game under
**NekoNexus Settings → Web Service URLs**:
```
https://nekonexus.yourdomain.com
```
For a fresh patch:
```powershell
packages\Client\make-client-patch.ps1 -UberStrikePath "C:\…\UberStrike" -ServerHost nekonexus.yourdomain.com
```
(then edit the generated `NekoNexus.Settings.Client.xml` to use `https://` if you're on TLS).

## Recap
- **Web** → Cloudflare Tunnel (or NPM/nginx) → `https://your-domain` (ports 8080/8081 behind it).
- **Game** → UDP 5055 + 5155 forwarded to your public IP; set that IP in the admin per server.
- **8082 stays internal.**
