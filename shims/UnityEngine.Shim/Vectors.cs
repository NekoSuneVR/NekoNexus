using System;

namespace UnityEngine {
	// Managed re-implementation of UnityEngine.Vector3 (server-safe subset, Unity semantics).
	[Serializable]
	public struct Vector3 : IEquatable<Vector3> {
		public const float kEpsilon = 1E-05f;

		public float x;
		public float y;
		public float z;

		public Vector3(float x, float y, float z) { this.x = x; this.y = y; this.z = z; }
		public Vector3(float x, float y) { this.x = x; this.y = y; this.z = 0f; }

		public static Vector3 zero => new Vector3(0f, 0f, 0f);
		public static Vector3 one => new Vector3(1f, 1f, 1f);
		public static Vector3 up => new Vector3(0f, 1f, 0f);
		public static Vector3 down => new Vector3(0f, -1f, 0f);
		public static Vector3 left => new Vector3(-1f, 0f, 0f);
		public static Vector3 right => new Vector3(1f, 0f, 0f);
		public static Vector3 forward => new Vector3(0f, 0f, 1f);
		public static Vector3 back => new Vector3(0f, 0f, -1f);

		public float this[int index] {
			get {
				switch (index) { case 0: return x; case 1: return y; case 2: return z; default: throw new IndexOutOfRangeException("Invalid Vector3 index!"); }
			}
			set {
				switch (index) { case 0: x = value; break; case 1: y = value; break; case 2: z = value; break; default: throw new IndexOutOfRangeException("Invalid Vector3 index!"); }
			}
		}

		public float magnitude => (float)Math.Sqrt(x * x + y * y + z * z);
		public float sqrMagnitude => x * x + y * y + z * z;

		public Vector3 normalized {
			get {
				float m = magnitude;
				return m > kEpsilon ? new Vector3(x / m, y / m, z / m) : zero;
			}
		}

		public void Normalize() {
			float m = magnitude;
			if (m > kEpsilon) { x /= m; y /= m; z /= m; } else { x = y = z = 0f; }
		}

		public void Set(float newX, float newY, float newZ) { x = newX; y = newY; z = newZ; }

		public static Vector3 operator +(Vector3 a, Vector3 b) => new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
		public static Vector3 operator -(Vector3 a, Vector3 b) => new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
		public static Vector3 operator -(Vector3 a) => new Vector3(-a.x, -a.y, -a.z);
		public static Vector3 operator *(Vector3 a, float d) => new Vector3(a.x * d, a.y * d, a.z * d);
		public static Vector3 operator *(float d, Vector3 a) => new Vector3(a.x * d, a.y * d, a.z * d);
		public static Vector3 operator /(Vector3 a, float d) => new Vector3(a.x / d, a.y / d, a.z / d);
		public static bool operator ==(Vector3 a, Vector3 b) => (a - b).sqrMagnitude < kEpsilon * kEpsilon;
		public static bool operator !=(Vector3 a, Vector3 b) => !(a == b);

		public static float Dot(Vector3 a, Vector3 b) => a.x * b.x + a.y * b.y + a.z * b.z;
		public static Vector3 Cross(Vector3 a, Vector3 b) => new Vector3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
		public static float Distance(Vector3 a, Vector3 b) => (a - b).magnitude;
		public static float Magnitude(Vector3 a) => a.magnitude;
		public static float SqrMagnitude(Vector3 a) => a.sqrMagnitude;
		public static Vector3 Normalize(Vector3 v) => v.normalized;

		public static Vector3 Lerp(Vector3 a, Vector3 b, float t) {
			t = Mathf.Clamp01(t);
			return new Vector3(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t);
		}
		public static Vector3 LerpUnclamped(Vector3 a, Vector3 b, float t)
			=> new Vector3(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t);

		public static Vector3 MoveTowards(Vector3 current, Vector3 target, float maxDistanceDelta) {
			Vector3 d = target - current;
			float m = d.magnitude;
			if (m <= maxDistanceDelta || m < 1E-06f) return target;
			return current + d / m * maxDistanceDelta;
		}

		public static Vector3 Min(Vector3 a, Vector3 b) => new Vector3(Mathf.Min(a.x, b.x), Mathf.Min(a.y, b.y), Mathf.Min(a.z, b.z));
		public static Vector3 Max(Vector3 a, Vector3 b) => new Vector3(Mathf.Max(a.x, b.x), Mathf.Max(a.y, b.y), Mathf.Max(a.z, b.z));
		public static Vector3 Scale(Vector3 a, Vector3 b) => new Vector3(a.x * b.x, a.y * b.y, a.z * b.z);

		public static float Angle(Vector3 from, Vector3 to) {
			float denom = (float)Math.Sqrt(from.sqrMagnitude * to.sqrMagnitude);
			if (denom < 1E-15f) return 0f;
			float dot = Mathf.Clamp(Dot(from, to) / denom, -1f, 1f);
			return (float)Math.Acos(dot) * 57.29578f;
		}

		public bool Equals(Vector3 other) => x == other.x && y == other.y && z == other.z;
		public override bool Equals(object other) => other is Vector3 v && Equals(v);
		public override int GetHashCode() => x.GetHashCode() ^ (y.GetHashCode() << 2) ^ (z.GetHashCode() >> 2);
		public override string ToString() => $"({x:F1}, {y:F1}, {z:F1})";
	}

	[Serializable]
	public struct Vector2 : IEquatable<Vector2> {
		public float x;
		public float y;

		public Vector2(float x, float y) { this.x = x; this.y = y; }

		public static Vector2 zero => new Vector2(0f, 0f);
		public static Vector2 one => new Vector2(1f, 1f);

		public float magnitude => (float)Math.Sqrt(x * x + y * y);
		public float sqrMagnitude => x * x + y * y;
		public Vector2 normalized { get { float m = magnitude; return m > 1E-05f ? new Vector2(x / m, y / m) : zero; } }

		public static Vector2 operator +(Vector2 a, Vector2 b) => new Vector2(a.x + b.x, a.y + b.y);
		public static Vector2 operator -(Vector2 a, Vector2 b) => new Vector2(a.x - b.x, a.y - b.y);
		public static Vector2 operator *(Vector2 a, float d) => new Vector2(a.x * d, a.y * d);
		public static Vector2 operator /(Vector2 a, float d) => new Vector2(a.x / d, a.y / d);
		public static bool operator ==(Vector2 a, Vector2 b) => (a - b).sqrMagnitude < 9.9999994E-11f;
		public static bool operator !=(Vector2 a, Vector2 b) => !(a == b);

		public static float Dot(Vector2 a, Vector2 b) => a.x * b.x + a.y * b.y;
		public static float Distance(Vector2 a, Vector2 b) => (a - b).magnitude;

		public bool Equals(Vector2 other) => x == other.x && y == other.y;
		public override bool Equals(object other) => other is Vector2 v && Equals(v);
		public override int GetHashCode() => x.GetHashCode() ^ (y.GetHashCode() << 2);
		public override string ToString() => $"({x:F1}, {y:F1})";

		public static implicit operator Vector2(Vector3 v) => new Vector2(v.x, v.y);
		public static implicit operator Vector3(Vector2 v) => new Vector3(v.x, v.y, 0f);
	}
}
