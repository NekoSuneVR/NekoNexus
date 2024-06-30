using log4net;
using log4net.Appender;
using log4net.Config;
using log4net.Core;
using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Xml;
using UnityEngine;

namespace Paradise.Client {
	public static class ParadiseClient {
		public static readonly ILog Log = LogManager.GetLogger(nameof(ParadiseClient));
		public static ParadisePrefs Settings { get; private set; } = new ParadisePrefs();

		private static bool _isExceptionSent = false;

		static ParadiseClient() {
			AppDomain.CurrentDomain.AssemblyResolve += (sender, e) => {
				var assemblyName = new AssemblyName(e.Name).Name;
				var resourceName = Assembly.GetExecutingAssembly().GetManifestResourceNames().FirstOrDefault(_ => _.EndsWith($"{assemblyName}.dll"));

				if (string.IsNullOrEmpty(resourceName))
					return null;

				using (var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName)) {
					return Assembly.Load(new BinaryReader(stream).ReadBytes((int)stream.Length));
				}
			};
		}

		public static void Initialize() {
			Application.RegisterLogCallback(new Application.LogCallback(OnUnityDebugCallback));

			using (var stream = Assembly.GetAssembly(typeof(ParadiseClient)).GetManifestResourceStream("Paradise.Client.log4net.config")) {
				using (var reader = new StreamReader(stream)) {
					var logConfig = new XmlDocument();
					logConfig.LoadXml(reader.ReadToEnd());

					XmlConfigurator.Configure(logConfig.DocumentElement);

					var appender = LogManager.GetLogger(typeof(ParadiseClient)).Logger.Repository.GetAppenders().First() as EventRaisingRollingFileAppender;
					appender.LogEventRaised += delegate (LoggingEvent loggingEvent) {
						DebugLogMessagesPanel.Console.Log(loggingEvent.Level, loggingEvent.RenderedMessage, loggingEvent.TimeStamp);
					};
				}
			}

			Log.Info($"Initializing Paradise (Version {Assembly.GetExecutingAssembly().GetName().Version}) ({Application.platform})");

			ParadiseMainMenuMusicManager.LoadMainMenuMusic();
			RichPresenceClient.Initialize();
		}

		private static void OnUnityDebugCallback(string logString, string stackTrace, LogType logType) {
			Log.Error($"Exception: {logString}\n{stackTrace}");

			if (ApplicationDataManager.IsOnline) {
				if (!_isExceptionSent) {
					_isExceptionSent = true;

					ParadiseWebServiceClient.RecordException(PlayerDataManager.Cmid, ApplicationDataManager.Channel, ApplicationDataManager.Version, logString, stackTrace, DebugLogMessages.Console.ToHTML(), () => { });
				}
			}
		}
	}

	public class EventRaisingRollingFileAppender : RollingFileAppender {
		public event Action<LoggingEvent> LogEventRaised;

		protected override void Append(LoggingEvent loggingEvent) {
			base.Append(loggingEvent);

			LogEventRaised?.Invoke(loggingEvent);
		}
	}
}
