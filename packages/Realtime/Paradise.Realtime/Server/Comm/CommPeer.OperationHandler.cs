using Cmune.DataCenter.Common.Entities;
using log4net;
using PhotonHostRuntimeInterfaces;
using System;
using System.IO;
using UberStrike.Core.Models;
using UberStrike.Core.Serialization;
using UberStrike.Realtime.Client;

namespace Paradise.Realtime.Server.Comm {
	public partial class CommPeer {
		public class OperationHandler : BaseOperationHandler<CommPeer, ICommPeerOperationsType> {
			protected static readonly new ILog Log = LogManager.GetLogger(nameof(CommPeer.OperationHandler));

			public override OperationHandlerId Id => OperationHandlerId.CommPeer;
			public override string HandlerName => "CommPeer.OperationHandler";

			public override void OnOperationRequest(CommPeer peer, byte opCode, MemoryStream bytes) {
#if DEBUG
				switch ((ICommPeerOperationsType)opCode) {
					case ICommPeerOperationsType.SendHeartbeatResponse:
						break;
					default:
						Log.Debug($"{HandlerName}::OnOperationRequest peer:{peer}, OpCode:{(ICommPeerOperationsType)opCode}({opCode})");
						break;
				}
#endif

				switch ((ICommPeerOperationsType)opCode) {
					case ICommPeerOperationsType.AuthenticationRequest:
						AuthenticateRequest(peer, bytes);
						break;

					case ICommPeerOperationsType.SendHeartbeatResponse:
						SendHeartbeatResponse(peer, bytes);
						break;

					default:
						throw new NotSupportedException();
				}
			}

			public override void OnDisconnect(CommPeer peer, DisconnectReason reasonCode, string reasonDetail) {
				Log.Debug($"{peer} Disconnected {reasonCode} -> {reasonDetail}");

				// Remove the peer from the lobby on disconnect: tells everyone else they left
				// (SendPlayerLeft -> their contact entry goes offline) and refreshes the online
				// roster + the master's ActivePlayer list. Without this, disconnected players
				// lingered as "online" forever.
				if (peer.Actor != null && peer.Lobby != null) {
					LobbyManager.Instance.GlobalLobby.Leave(peer);
					LobbyManager.Instance.UpdatePlayerList();
				}
			}

			#region Implementation of ICommPeerOperationsType
			private void AuthenticateRequest(CommPeer peer, MemoryStream bytes) {
				var authToken = StringProxy.Deserialize(bytes);
				var magicHash = StringProxy.Deserialize(bytes);

				DebugOperation(peer, authToken, magicHash);

				if (!peer.Authenticate(authToken, magicHash)) {
					peer.SendError("Failed to authenticate. Please try again later.\n(Magic Hash verification failure)");
					return;
				}

				if (!(UserWebServiceClient.Instance.GetMember(authToken) is var member) || member.CmuneMemberView == null) {
					peer.SendError("Failed to authenticate. Please try again later.\n(Member was null while authenticating)");
					return;
				}

				peer.Member = member;

				var actor = new CommActor(peer, new CommActorInfo {
					AccessLevel = member.CmuneMemberView.PublicProfile.AccessLevel,
					Channel = ChannelType.Steam,
					Cmid = member.CmuneMemberView.PublicProfile.Cmid,
					PlayerName = member.CmuneMemberView.PublicProfile.Name,
				});

				peer.Actor = actor;

				LobbyManager.Instance.GlobalLobby.Join(peer);
				LobbyManager.Instance.UpdatePlayerList();
			}

			private void SendHeartbeatResponse(CommPeer peer, MemoryStream bytes) {
				var authToken = StringProxy.Deserialize(bytes);
				var responseHash = StringProxy.Deserialize(bytes);

				DebugOperation(peer, authToken, responseHash);

				try {
					if (!peer.CheckHeartbeat(responseHash)) {
						peer.SendError("An error occured that forced UberStrike to halt.\n(Heartbeat verification failure)");
					}
				} catch (Exception e) {
					Log.Error("Exception while checking heartbeat", e);
					peer.SendError();
				}
			}
			#endregion

			private void DebugOperation(params object[] data) {
#if DEBUG
				Log.Debug($"{HandlerName}:{new System.Diagnostics.StackTrace().GetFrame(1).GetMethod().Name} -> {string.Join(", ", data)}");
#endif
			}
		}
	}
}
