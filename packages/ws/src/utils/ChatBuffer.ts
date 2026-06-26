/*
 * In-memory ring buffers of recent chat, so the website can show the same chat as in-game.
 *
 *  - Global lobby chat: one shared ring, fed from the ChatMessage the Comm server forwards
 *    (in-game -> web) and from web posts (web -> in-game, broadcast to lobby peers).
 *  - Clan chat: one ring per clan (GroupId), fed from the ClanChatMessage the Comm server forwards
 *    (in-game -> web) and from web posts (web -> in-game, broadcast to that clan's online members).
 *
 * Friend DMs are persisted in the DB by the admin service (a real thread/history), so they don't
 * live here - the ws only relays a DM into the in-game whisper channel.
 */

interface ChatMsg {
  id: number;
  cmid: number;
  name: string;
  text: string;
  time: number; // unix ms
}

class Ring {
  private buf: ChatMsg[] = [];
  private seq = 0;
  private readonly max: number;

  constructor(max = 100) {
    this.max = max;
  }

  push(cmid: number, name: string, text: string): void {
    const clean = String(text ?? '').slice(0, 200);
    if (!clean.trim()) return;
    this.seq += 1;
    this.buf.push({ id: this.seq, cmid: Number(cmid) || 0, name: String(name ?? ''), text: clean, time: Date.now() });
    if (this.buf.length > this.max) this.buf.shift();
  }

  /** Messages newer than `sinceId` (0/undefined = the last ~50). */
  recent(sinceId = 0): ChatMsg[] {
    return sinceId > 0 ? this.buf.filter((m) => m.id > sinceId) : this.buf.slice(-50);
  }

  get lastId(): number {
    return this.seq;
  }
}

class ChatBufferImpl {
  private global = new Ring(100);
  private clans = new Map<number, Ring>();

  private clanRing(groupId: number): Ring {
    let r = this.clans.get(groupId);
    if (!r) {
      r = new Ring(60);
      this.clans.set(groupId, r);
    }
    return r;
  }

  // ----- global lobby chat -----
  push(cmid: number, name: string, text: string): void {
    this.global.push(cmid, name, text);
  }
  recent(sinceId = 0): ChatMsg[] {
    return this.global.recent(sinceId);
  }
  get lastId(): number {
    return this.global.lastId;
  }

  // ----- clan chat (per GroupId) -----
  pushClan(groupId: number, cmid: number, name: string, text: string): void {
    if (!(Number(groupId) > 0)) return;
    this.clanRing(Number(groupId)).push(cmid, name, text);
  }
  recentClan(groupId: number, sinceId = 0): ChatMsg[] {
    if (!(Number(groupId) > 0)) return [];
    return this.clanRing(Number(groupId)).recent(sinceId);
  }
  clanLastId(groupId: number): number {
    if (!(Number(groupId) > 0)) return 0;
    return this.clanRing(Number(groupId)).lastId;
  }
}

const ChatBuffer = new ChatBufferImpl();
export default ChatBuffer;
