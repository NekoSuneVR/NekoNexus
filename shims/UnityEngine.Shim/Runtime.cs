using System;

namespace UnityEngine {
	// Server-side stand-ins for Unity engine globals. These are headless: there is no
	// frame loop or scene, so values come from wall-clock / process state where it makes sense.

	public static class Debug {
		public static void Log(object message) => Console.WriteLine($"[Log] {message}");
		public static void Log(object message, object context) => Console.WriteLine($"[Log] {message}");
		public static void LogWarning(object message) => Console.WriteLine($"[Warning] {message}");
		public static void LogWarning(object message, object context) => Console.WriteLine($"[Warning] {message}");
		public static void LogError(object message) => Console.Error.WriteLine($"[Error] {message}");
		public static void LogError(object message, object context) => Console.Error.WriteLine($"[Error] {message}");
		public static void LogException(Exception exception) => Console.Error.WriteLine($"[Exception] {exception}");
		public static void LogFormat(string format, params object[] args) => Console.WriteLine("[Log] " + string.Format(format, args));
		public static void LogErrorFormat(string format, params object[] args) => Console.Error.WriteLine("[Error] " + string.Format(format, args));

		public static void Assert(bool condition) { if (!condition) Console.Error.WriteLine("[Assert] Assertion failed"); }
		public static void Assert(bool condition, object message) { if (!condition) Console.Error.WriteLine($"[Assert] {message}"); }
	}

	public static class Time {
		private static readonly DateTime Start = DateTime.UtcNow;
		public static float time => (float)(DateTime.UtcNow - Start).TotalSeconds;
		public static float realtimeSinceStartup => time;
		public static float deltaTime => 0.016f;
		public static float fixedDeltaTime => 0.016f;
		public static float unscaledTime => time;
		public static float unscaledDeltaTime => 0.016f;
		public static float timeScale = 1f;
		public static int frameCount => (int)(time * 60f);
	}

	public static class Application {
		public static string productName => "UberStrike";
		public static string version => "4.7.1";
		public static string unityVersion => "4.7.1f1";
		public static bool isPlaying => true;
		public static bool isEditor => false;
		public static RuntimePlatform platform => RuntimePlatform.LinuxPlayer;
		public static string persistentDataPath => AppDomain.CurrentDomain.BaseDirectory;
		public static string dataPath => AppDomain.CurrentDomain.BaseDirectory;
	}

	public enum RuntimePlatform { WindowsPlayer = 2, LinuxPlayer = 13, OSXPlayer = 1 }

	public static class Screen {
		public static int width => 1920;
		public static int height => 1080;
	}

	// Unity's static Random facade (server uses a thread-safe shared instance).
	public static class Random {
		[ThreadStatic] private static System.Random _rng;
		private static System.Random Rng => _rng ?? (_rng = new System.Random(unchecked(Environment.TickCount * 31 + System.Threading.Thread.CurrentThread.ManagedThreadId)));

		public static float value => (float)Rng.NextDouble();
		public static float Range(float min, float max) => min + (float)Rng.NextDouble() * (max - min);
		public static int Range(int min, int max) => min >= max ? min : Rng.Next(min, max);
		public static void InitState(int seed) => _rng = new System.Random(seed);
		public static Vector3 insideUnitSphere {
			get {
				double u = Rng.NextDouble() * 2 - 1, v = Rng.NextDouble() * 2 - 1, w = Rng.NextDouble() * 2 - 1;
				return new Vector3((float)u, (float)v, (float)w) * (float)Math.Pow(Rng.NextDouble(), 1.0 / 3.0);
			}
		}
	}

	[Serializable]
	public struct Rect {
		public float x, y, width, height;
		public Rect(float x, float y, float width, float height) { this.x = x; this.y = y; this.width = width; this.height = height; }
		public float xMin => x; public float yMin => y; public float xMax => x + width; public float yMax => y + height;
		public bool Contains(Vector2 point) => point.x >= xMin && point.x < xMax && point.y >= yMin && point.y < yMax;
		public override string ToString() => $"(x:{x:F2}, y:{y:F2}, width:{width:F2}, height:{height:F2})";
	}

	// Minimal object/component graph. Server code references the types but does not drive a scene.
	public class Object {
		public string name { get; set; } = string.Empty;
		public override string ToString() => name;
		public static void Destroy(Object obj) { }
		public static void DontDestroyOnLoad(Object target) { }
	}

	public class GameObject : Object {
		public bool activeSelf { get; private set; } = true;
		public GameObject() { }
		public GameObject(string name) { this.name = name; }
		public void SetActive(bool value) { activeSelf = value; }
		public T GetComponent<T>() where T : class => null;
		public T AddComponent<T>() where T : Component, new() => new T();
		// Headless: there is no scene graph, so lookups never find anything.
		public static GameObject Find(string name) => null;
		public static GameObject FindWithTag(string tag) => null;
	}

	// IMGUI no-ops: server code references these in OnGUI paths that never run headless.
	public static class GUILayout {
		public static void BeginArea(Rect screenRect) { }
		public static void BeginArea(Rect screenRect, string text) { }
		public static void EndArea() { }
		public static void BeginHorizontal(params object[] options) { }
		public static void EndHorizontal() { }
		public static void BeginVertical(params object[] options) { }
		public static void EndVertical() { }
		public static void Label(string text, params object[] options) { }
		public static void Label(object image, params object[] options) { }
		public static bool Button(string text, params object[] options) => false;
		public static void Space(float pixels) { }
		public static void FlexibleSpace() { }
	}

	public static class GUI {
		public static void Label(Rect position, string text) { }
		public static bool Button(Rect position, string text) => false;
	}

	public class Component : Object {
		public GameObject gameObject { get; } = new GameObject();
	}

	public sealed class Coroutine { }

	public class MonoBehaviour : Component {
		public bool enabled { get; set; } = true;
		// Headless server build: coroutines are never scheduled (this code path is client-only).
		public Coroutine StartCoroutine(System.Collections.IEnumerator routine) => null;
		public Coroutine StartCoroutine(string methodName) => null;
		public void StopCoroutine(System.Collections.IEnumerator routine) { }
		public void StopCoroutine(Coroutine routine) { }
		public void StopAllCoroutines() { }
		public void Invoke(string methodName, float time) { }
		public void CancelInvoke() { }
	}

	public class ScriptableObject : Object { }

	// Attributes used by serialized view models. No-ops on the server.
	[AttributeUsage(AttributeTargets.Field, Inherited = true, AllowMultiple = false)]
	public sealed class SerializeFieldAttribute : Attribute { }

	[AttributeUsage(AttributeTargets.Field | AttributeTargets.Property, Inherited = true, AllowMultiple = false)]
	public sealed class HideInInspectorAttribute : Attribute { }

	public enum RuntimeInitializeLoadType { AfterSceneLoad, BeforeSceneLoad, AfterAssembliesLoaded, BeforeSplashScreen, SubsystemRegistration }

	[AttributeUsage(AttributeTargets.Method, AllowMultiple = false)]
	public sealed class RuntimeInitializeOnLoadMethodAttribute : Attribute {
		public RuntimeInitializeOnLoadMethodAttribute() { }
		public RuntimeInitializeOnLoadMethodAttribute(RuntimeInitializeLoadType loadType) { }
	}
}
