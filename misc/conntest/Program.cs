using System;
using System.Threading;
using ExitGames.Client.Photon;

// Connects to a Paradise realtime server using the SAME PhotonPeer shim the game uses,
// to prove the LiteNetLib transport accepts connections. Usage: conntest <ip:port> [appId]
class Listener : IPhotonPeerListener {
    public void OnEvent(EventData e) => Console.WriteLine($"  <- event {e.Code}");
    public void OnOperationResponse(OperationResponse r) => Console.WriteLine($"  <- opresponse {r.OperationCode} rc={r.ReturnCode}");
    public void OnStatusChanged(StatusCode s) => Console.WriteLine($"  status: {s}");
    public void DebugReturn(DebugLevel l, string m) => Console.WriteLine($"  debug[{l}]: {m}");
}

class Program {
    static int Main(string[] args) {
        var endpoint = args.Length > 0 ? args[0] : "127.0.0.1:5055";
        var appId = args.Length > 1 ? args[1] : "2.0";
        Console.WriteLine($"Connecting to {endpoint} (appId '{appId}') via PhotonPeer shim...");

        var listener = new Listener();
        var peer = new PhotonPeer(listener, ConnectionProtocol.Udp);
        if (!peer.Connect(endpoint, appId)) { Console.WriteLine("Connect() returned false"); return 2; }

        var last = peer.PeerState;
        for (int i = 0; i < 250; i++) {       // up to ~5s
            peer.Service();
            if (peer.PeerState != last) { Console.WriteLine($"  peerState: {peer.PeerState}"); last = peer.PeerState; }
            if (peer.PeerState == PeerStateValue.Connected) {
                Console.WriteLine("CONNECTED — sending a test operation (op 1, like the auth request)...");
                var dict = new System.Collections.Generic.Dictionary<byte, object> { { 0, new byte[] { 1, 2, 3, 4 } } };
                bool sent = peer.OpCustom(1, dict, true, 0, false);
                Console.WriteLine("  OpCustom returned: " + sent);
                for (int j = 0; j < 50; j++) { peer.Service(); Thread.Sleep(20); }  // ~1s to let server process + reply
                peer.Disconnect();
                return 0;
            }
            Thread.Sleep(20);
        }
        Console.WriteLine($"TIMED OUT — never connected (final state {peer.PeerState}).");
        peer.Disconnect();
        return 1;
    }
}
