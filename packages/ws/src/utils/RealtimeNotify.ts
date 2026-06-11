import NekoNexusService from '@/NekoNexusService';
import { WebSocketPacketType } from '@/ServiceHosts/WebSocket';

/**
 * Best-effort realtime nudges to the Comm server so an online player's client refreshes the
 * relevant panel instantly - the same push model friend requests already use - instead of waiting
 * for a manual refresh or the slow inbox poll. The Comm server looks the target up by cmid and
 * pushes the matching lobby event; if the player is offline it's a harmless no-op.
 *
 * Every call swallows its own errors: realtime delivery must never break the web service response
 * (e.g. if the Comm server is momentarily disconnected, the data is still saved and shows on refresh).
 */
export const RealtimeNotify = {
  /** New mail (or a System announcement) arrived for TargetCmid -> client pulls in that message. */
  async inboxMessage(targetCmid: number, messageId: number): Promise<void> {
    try {
      await NekoNexusService.Instance.SocketHost.SendToCommServer(WebSocketPacketType.NotifyInboxMessage, {
        TargetCmid: targetCmid,
        MessageId: messageId,
      });
    } catch {
      /* realtime is best-effort */
    }
  },

  /** A clan/contact invitation was created for TargetCmid -> client refreshes its requests list. */
  async inboxRequests(targetCmid: number): Promise<void> {
    try {
      await NekoNexusService.Instance.SocketHost.SendToCommServer(WebSocketPacketType.NotifyInboxRequests, {
        TargetCmid: targetCmid,
      });
    } catch {
      /* realtime is best-effort */
    }
  },

  /** The clan roster changed -> TargetCmid's client refreshes its clan view. */
  async clanMembers(targetCmid: number): Promise<void> {
    try {
      await NekoNexusService.Instance.SocketHost.SendToCommServer(WebSocketPacketType.NotifyClanMembers, {
        TargetCmid: targetCmid,
      });
    } catch {
      /* realtime is best-effort */
    }
  },

  /** Push a clan chat line (e.g. a "X joined the clan" system message) to online member TargetCmid. */
  async clanChat(targetCmid: number, fromCmid: number, name: string, message: string): Promise<void> {
    try {
      await NekoNexusService.Instance.SocketHost.SendToCommServer(WebSocketPacketType.NotifyClanChat, {
        TargetCmid: targetCmid,
        Cmid: fromCmid,
        Name: name,
        Message: message,
      });
    } catch {
      /* realtime is best-effort */
    }
  },
};

export default RealtimeNotify;
