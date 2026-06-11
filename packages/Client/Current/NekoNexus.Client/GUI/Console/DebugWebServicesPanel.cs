using System.Text;
using UberStrike.WebService.Unity;
using UnityEngine;

namespace NekoNexus.Client {
	internal class DebugWebServicesPanel : IDebugPage {
		public string Title => "Web Services";

		private readonly StringBuilder requestLog = new StringBuilder();
		private string currentLog = string.Empty;

		private Vector2 consoleScrollPos;
		private bool autoScroll = true;

		public DebugWebServicesPanel() {
			Configuration.RequestLogger = delegate (string log) {
				requestLog.AppendLine(log);
				currentLog = requestLog.ToString();

				if (autoScroll) consoleScrollPos.y = float.MaxValue;
			};
		}

		public void Draw() {
			NekoNexusGUITools.DrawGroup("Web Services", delegate {
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Inbound Traffic", NekoNexusGUITools.FormatSize(WebServiceStatistics.TotalBytesIn));
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Outbound Traffic", NekoNexusGUITools.FormatSize(WebServiceStatistics.TotalBytesOut));

				foreach (var keyValuePair in WebServiceStatistics.Data) {
					GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

					var statistic = keyValuePair.Value;
					NekoNexusGUITools.DrawTextField(keyValuePair.Key, $"count: {statistic.Counter}/{statistic.FailCounter} | time: {statistic.Time:F2} | data: {NekoNexusGUITools.FormatSize(statistic.IncomingBytes)}/{NekoNexusGUITools.FormatSize(statistic.OutgoingBytes)}");
				}
			});

			GUILayout.Space(NekoNexusGUITools.SECTION_SPACING);

			NekoNexusGUITools.DrawGroup("Log", delegate {
				autoScroll = GUILayout.Toggle(autoScroll, "Enable Auto Scroll", BlueStonez.toggle);

				GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

				consoleScrollPos = GUILayout.BeginScrollView(consoleScrollPos, false, true, GUIStyle.none, BlueStonez.verticalScrollbar, BlueStonez.scrollView, GUILayout.Height(300f));
				GUILayout.TextArea(currentLog, BlueStonez.textArea);
				GUILayout.EndScrollView();
			});
		}
	}
}
