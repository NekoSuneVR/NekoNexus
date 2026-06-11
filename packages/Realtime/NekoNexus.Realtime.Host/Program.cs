using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Xml.Linq;
using Photon.SocketServer;

namespace NekoNexus.Realtime.Host {
	// Replaces PhotonSocketServer.exe. Usage:
	//   NekoNexus.Realtime.Host <Comm|Game|app-name> [--max-peers N] [--port N]
	//                          [--config path\PhotonServer.config] [--binary-path dir]
	// Runs exactly ONE application per process (Comm and Game must be separate processes
	// because NekoNexus uses the ApplicationBase.Instance singleton per application).
	internal static class Program {
		private static ApplicationBase _app;

		private static int Main(string[] args) {
			if (args.Length == 0 || args[0].StartsWith("-")) {
				Console.Error.WriteLine("usage: NekoNexus.Realtime.Host <Comm|Game|app-name> [--max-peers N] [--port N] [--master-host <host>] [--config <file>] [--binary-path <dir>]");
				return 2;
			}

			var opts = ParseArgs(args, out string requestedApp);
			string exeDir = AppDomain.CurrentDomain.BaseDirectory;

			string configPath = opts.ConfigPath ?? FindConfig(exeDir);
			AppEntry entry;
			try {
				entry = ResolveApp(configPath, requestedApp);
			} catch (Exception ex) {
				Console.Error.WriteLine($"Could not resolve application '{requestedApp}': {ex.Message}");
				return 3;
			}

			// Where NekoNexus.Realtime.dll + NekoNexus.Realtime.yml live.
			string binaryPath = opts.BinaryPath
				?? (Directory.Exists(Path.Combine(exeDir, entry.BaseDirectory)) ? Path.Combine(exeDir, entry.BaseDirectory) : exeDir);

			string assemblyPath = LocateAssembly(entry.Assembly, binaryPath, exeDir);
			if (assemblyPath == null) {
				Console.Error.WriteLine($"Could not locate assembly '{entry.Assembly}.dll' near {binaryPath} or {exeDir}.");
				return 4;
			}

			Assembly asm = Assembly.LoadFrom(assemblyPath);
			Type appType = asm.GetType(entry.Type, throwOnError: false);
			if (appType == null) {
				Console.Error.WriteLine($"Type '{entry.Type}' not found in {assemblyPath}.");
				return 5;
			}

			_app = Activator.CreateInstance(appType) as ApplicationBase;
			if (_app == null) {
				Console.Error.WriteLine($"Type '{entry.Type}' is not a Photon.SocketServer.ApplicationBase.");
				return 6;
			}

			// Slot count precedence: --max-peers  >  yml MaxPlayerCount for this app  >  1000.
			int maxPeers = opts.MaxPeers ?? ReadMaxPlayerCount(binaryPath, entry.Name) ?? 1000;

			var hostOptions = new RealtimeHostOptions {
				Port = opts.Port ?? entry.Port,
				MaxPeers = maxPeers,
				BinaryPath = binaryPath,
				ApplicationPath = Path.GetDirectoryName(binaryPath.TrimEnd(Path.DirectorySeparatorChar)) ?? binaryPath,
			};

			// --master-host overrides the yml's MasterHostname (read by the app from this env var).
			if (!string.IsNullOrWhiteSpace(opts.MasterHost)) {
				Environment.SetEnvironmentVariable("PARADISE_MASTER_HOST", opts.MasterHost);
			}
			var masterHost = Environment.GetEnvironmentVariable("PARADISE_MASTER_HOST");

			Console.WriteLine($"[NekoNexus.Realtime.Host] {entry.Name} ({entry.Type})");
			Console.WriteLine($"  UDP port : {hostOptions.Port}");
			Console.WriteLine($"  Max slots: {hostOptions.MaxPeers}   (set with --max-peers; no Photon licence/CCU cap)");
			if (!string.IsNullOrWhiteSpace(masterHost)) Console.WriteLine($"  Master   : {masterHost}   (PARADISE_MASTER_HOST / --master-host)");
			Console.WriteLine($"  Binaries : {binaryPath}");

			Console.CancelKeyPress += (s, e) => { e.Cancel = true; Shutdown(); };
			AppDomain.CurrentDomain.ProcessExit += (s, e) => Shutdown();

			try {
				_app.RunHost(hostOptions);   // blocks until Shutdown()
			} catch (Exception ex) {
				Console.Error.WriteLine($"[NekoNexus.Realtime.Host] fatal: {ex}");
				return 1;
			}

			return 0;
		}

		private static void Shutdown() {
			var app = Interlocked.Exchange(ref _app, null);
			if (app != null) {
				Console.WriteLine("[NekoNexus.Realtime.Host] stopping...");
				try { app.StopHost(); } catch { }
			}
		}

		// ---- config + args --------------------------------------------------------

		private sealed class Options {
			public int? MaxPeers;
			public int? Port;
			public string ConfigPath;
			public string BinaryPath;
			public string MasterHost;
		}

		private sealed class AppEntry {
			public string Name;
			public string Type;
			public string Assembly;
			public string BaseDirectory;
			public int Port;
		}

		private static Options ParseArgs(string[] args, out string requestedApp) {
			requestedApp = args[0];
			var o = new Options();
			for (int i = 1; i < args.Length - 1; i++) {
				switch (args[i]) {
					case "--max-peers": if (int.TryParse(args[++i], out var mp)) o.MaxPeers = mp; break;
					case "--port": if (int.TryParse(args[++i], out var p)) o.Port = p; break;
					case "--config": o.ConfigPath = args[++i]; break;
					case "--binary-path": o.BinaryPath = args[++i]; break;
					case "--master-host": o.MasterHost = args[++i]; break;
				}
			}
			return o;
		}

		private static string FindConfig(string exeDir) {
			foreach (var candidate in new[] {
				Path.Combine(exeDir, "PhotonServer.config"),
				Path.Combine(exeDir, "..", "PhotonServer.config"),
				Path.Combine(exeDir, "photon", "PhotonServer.config"),
				Path.Combine(exeDir, "..", "photon", "PhotonServer.config"),
			}) {
				if (File.Exists(candidate)) return Path.GetFullPath(candidate);
			}
			return null;
		}

		// Maps a friendly name ("Comm"/"Game") or a config Application Name to its Type/Assembly/port.
		private static AppEntry ResolveApp(string configPath, string requestedApp) {
			if (configPath == null || !File.Exists(configPath))
				throw new FileNotFoundException("PhotonServer.config not found (pass --config).");

			var doc = XDocument.Load(configPath);
			var root = doc.Root?.Element("NekoNexusApplication") ?? doc.Root;

			var apps = root.Element("Applications")?.Elements("Application")
				.Select(a => new AppEntry {
					Name = (string)a.Attribute("Name"),
					Type = (string)a.Attribute("Type"),
					Assembly = (string)a.Attribute("Assembly"),
					BaseDirectory = (string)a.Attribute("BaseDirectory") ?? string.Empty,
				}).ToList() ?? new List<AppEntry>();

			if (apps.Count == 0) throw new InvalidOperationException("No <Application> entries in config.");

			// Match by full name, or by trailing token (Comm/Game), case-insensitive.
			AppEntry entry =
				apps.FirstOrDefault(a => string.Equals(a.Name, requestedApp, StringComparison.OrdinalIgnoreCase))
				?? apps.FirstOrDefault(a => a.Name != null && a.Name.EndsWith("." + requestedApp, StringComparison.OrdinalIgnoreCase))
				?? apps.FirstOrDefault(a => a.Type != null && a.Type.IndexOf(requestedApp, StringComparison.OrdinalIgnoreCase) >= 0);

			if (entry == null)
				throw new InvalidOperationException($"app '{requestedApp}' not found. Available: {string.Join(", ", apps.Select(a => a.Name))}");

			// Find the UDP port whose OverrideApplication points at this app.
			var listener = root.Element("UDPListeners")?.Elements("UDPListener")
				.FirstOrDefault(l => string.Equals((string)l.Attribute("OverrideApplication"), entry.Name, StringComparison.OrdinalIgnoreCase));
			entry.Port = listener != null && int.TryParse((string)listener.Attribute("Port"), out var port) ? port : 5055;

			return entry;
		}

		// Reads MaxPlayerCount from the app's section of NekoNexus.Realtime.yml (light scan,
		// no YAML dep): "Comm"/"Game" -> CommApplicationSettings/GameApplicationSettings.
		private static int? ReadMaxPlayerCount(string binaryPath, string appName) {
			try {
				var yml = Path.Combine(binaryPath, "NekoNexus.Realtime.yml");
				if (!File.Exists(yml)) return null;

				string section = appName != null && appName.EndsWith("Comm", StringComparison.OrdinalIgnoreCase)
					? "CommApplicationSettings"
					: "GameApplicationSettings";

				bool inSection = false;
				foreach (var raw in File.ReadAllLines(yml)) {
					var line = raw.TrimEnd();
					if (line.Length == 0 || line.TrimStart().StartsWith("#")) continue;

					if (!line.StartsWith(" ") && !line.StartsWith("\t")) {
						inSection = line.TrimEnd(':', ' ').Equals(section, StringComparison.OrdinalIgnoreCase);
						continue;
					}
					if (inSection) {
						var t = line.Trim();
						if (t.StartsWith("MaxPlayerCount", StringComparison.OrdinalIgnoreCase)) {
							var v = t.Substring(t.IndexOf(':') + 1).Trim();
							if (int.TryParse(v, out var n) && n > 0) return n;
						}
					}
				}
			} catch { /* fall back to default */ }
			return null;
		}

		private static string LocateAssembly(string assemblyName, params string[] dirs) {
			foreach (var dir in dirs.Where(d => !string.IsNullOrEmpty(d))) {
				var candidate = Path.Combine(dir, assemblyName + ".dll");
				if (File.Exists(candidate)) return Path.GetFullPath(candidate);
			}
			return null;
		}
	}
}
