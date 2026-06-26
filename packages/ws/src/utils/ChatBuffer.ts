/*
 * In-memory ring buffer of recent lobby chat, so the website can show the same chat as in-game.
 * Populated from the lobby ChatMessage the Comm server forwards (in-game -> web), and from web
 * posts (web -> in-game, which also broadcast to lobby peers via the Comm server).
 */

interface ChatMsg {
  id: number;
  cmid: number;
  name: string;
  text: string;
  time: number; // unix ms
}

class ChatBufferImpl {
  private buf: ChatMsg[] = [];
  private seq = 0;
  private static readonly MAX = 100;

  push(cmid: number, name: string, text: string): void {
    const clean = String(text ?? '').slice(0, 200);
    if (!clean.trim()) return;
    this.seq += 1;
    this.buf.push({ id: this.seq, cmid: Number(cmid) || 0, name: String(name ?? ''), text: clean, time: Date.now() });
    if (this.buf.length > ChatBufferImpl.MAX) this.buf.shift();
  }

  /** Messages newer than `sinceId` (0/undefined = the last ~50). */
  recent(sinceId = 0): ChatMsg[] {
    return sinceId > 0 ? this.buf.filter((m) => m.id > sinceId) : this.buf.slice(-50);
  }

  get lastId(): number {
    return this.seq;
  }
}

const ChatBuffer = new ChatBufferImpl();
export default ChatBuffer;
