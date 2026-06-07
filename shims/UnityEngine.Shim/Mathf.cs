using System;

namespace UnityEngine {
	// Managed re-implementation of UnityEngine.Mathf (Unity semantics, float-based).
	public static class Mathf {
		public const float PI = 3.14159274f;
		public const float Infinity = float.PositiveInfinity;
		public const float NegativeInfinity = float.NegativeInfinity;
		public const float Deg2Rad = 0.0174532924f;
		public const float Rad2Deg = 57.29578f;
		public const float Epsilon = 1.401298E-45f;

		public static float Abs(float f) => Math.Abs(f);
		public static int Abs(int value) => Math.Abs(value);

		public static float Min(float a, float b) => a < b ? a : b;
		public static int Min(int a, int b) => a < b ? a : b;
		public static float Min(params float[] values) {
			if (values.Length == 0) return 0f;
			float m = values[0];
			for (int i = 1; i < values.Length; i++) if (values[i] < m) m = values[i];
			return m;
		}
		public static int Min(params int[] values) {
			if (values.Length == 0) return 0;
			int m = values[0];
			for (int i = 1; i < values.Length; i++) if (values[i] < m) m = values[i];
			return m;
		}

		public static float Max(float a, float b) => a > b ? a : b;
		public static int Max(int a, int b) => a > b ? a : b;
		public static float Max(params float[] values) {
			if (values.Length == 0) return 0f;
			float m = values[0];
			for (int i = 1; i < values.Length; i++) if (values[i] > m) m = values[i];
			return m;
		}
		public static int Max(params int[] values) {
			if (values.Length == 0) return 0;
			int m = values[0];
			for (int i = 1; i < values.Length; i++) if (values[i] > m) m = values[i];
			return m;
		}

		public static float Pow(float f, float p) => (float)Math.Pow(f, p);
		public static float Exp(float power) => (float)Math.Exp(power);
		public static float Log(float f, float p) => (float)Math.Log(f, p);
		public static float Log(float f) => (float)Math.Log(f);
		public static float Log10(float f) => (float)Math.Log10(f);

		public static float Ceil(float f) => (float)Math.Ceiling(f);
		public static float Floor(float f) => (float)Math.Floor(f);
		public static float Round(float f) => (float)Math.Round(f, MidpointRounding.ToEven);
		public static int CeilToInt(float f) => (int)Math.Ceiling(f);
		public static int FloorToInt(float f) => (int)Math.Floor(f);
		public static int RoundToInt(float f) => (int)Math.Round(f, MidpointRounding.ToEven);

		public static float Sign(float f) => f >= 0f ? 1f : -1f;

		public static float Sqrt(float f) => (float)Math.Sqrt(f);
		public static float Sin(float f) => (float)Math.Sin(f);
		public static float Cos(float f) => (float)Math.Cos(f);
		public static float Tan(float f) => (float)Math.Tan(f);
		public static float Asin(float f) => (float)Math.Asin(f);
		public static float Acos(float f) => (float)Math.Acos(f);
		public static float Atan(float f) => (float)Math.Atan(f);
		public static float Atan2(float y, float x) => (float)Math.Atan2(y, x);

		public static float Clamp(float value, float min, float max) => value < min ? min : (value > max ? max : value);
		public static int Clamp(int value, int min, int max) => value < min ? min : (value > max ? max : value);
		public static float Clamp01(float value) => value < 0f ? 0f : (value > 1f ? 1f : value);

		public static float Lerp(float a, float b, float t) => a + (b - a) * Clamp01(t);
		public static float LerpUnclamped(float a, float b, float t) => a + (b - a) * t;
		public static float LerpAngle(float a, float b, float t) {
			float delta = Repeat(b - a, 360f);
			if (delta > 180f) delta -= 360f;
			return a + delta * Clamp01(t);
		}

		public static float MoveTowards(float current, float target, float maxDelta) {
			if (Math.Abs(target - current) <= maxDelta) return target;
			return current + Sign(target - current) * maxDelta;
		}
		public static float MoveTowardsAngle(float current, float target, float maxDelta) {
			float dt = DeltaAngle(current, target);
			if (-maxDelta < dt && dt < maxDelta) return target;
			target = current + dt;
			return MoveTowards(current, target, maxDelta);
		}

		public static float SmoothStep(float from, float to, float t) {
			t = Clamp01(t);
			t = -2f * t * t * t + 3f * t * t;
			return to * t + from * (1f - t);
		}

		public static float Repeat(float t, float length) => Clamp(t - (float)Math.Floor(t / length) * length, 0f, length);
		public static float PingPong(float t, float length) {
			t = Repeat(t, length * 2f);
			return length - Math.Abs(t - length);
		}

		public static float DeltaAngle(float current, float target) {
			float delta = Repeat(target - current, 360f);
			if (delta > 180f) delta -= 360f;
			return delta;
		}

		public static bool Approximately(float a, float b)
			=> Math.Abs(b - a) < Math.Max(1E-06f * Math.Max(Math.Abs(a), Math.Abs(b)), Epsilon * 8f);

		public static float InverseLerp(float a, float b, float value) {
			if (a == b) return 0f;
			return Clamp01((value - a) / (b - a));
		}

		public static float RotateTowards(float current, float target, float maxDelta) => MoveTowardsAngle(current, target, maxDelta);
	}
}
