using System;

namespace UnityEngine {
	// Managed re-implementation of UnityEngine.Quaternion (Unity semantics, left-handed Y-up).
	[Serializable]
	public struct Quaternion : IEquatable<Quaternion> {
		public float x, y, z, w;

		public Quaternion(float x, float y, float z, float w) { this.x = x; this.y = y; this.z = z; this.w = w; }

		public static Quaternion identity => new Quaternion(0f, 0f, 0f, 1f);

		public float this[int index] {
			get { switch (index) { case 0: return x; case 1: return y; case 2: return z; case 3: return w; default: throw new IndexOutOfRangeException("Invalid Quaternion index!"); } }
			set { switch (index) { case 0: x = value; break; case 1: y = value; break; case 2: z = value; break; case 3: w = value; break; default: throw new IndexOutOfRangeException("Invalid Quaternion index!"); } }
		}

		public void Set(float newX, float newY, float newZ, float newW) { x = newX; y = newY; z = newZ; w = newW; }

		public static Quaternion operator *(Quaternion a, Quaternion b) => new Quaternion(
			a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
			a.w * b.y + a.y * b.w + a.z * b.x - a.x * b.z,
			a.w * b.z + a.z * b.w + a.x * b.y - a.y * b.x,
			a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z);

		public static Vector3 operator *(Quaternion rotation, Vector3 point) {
			float x2 = rotation.x * 2f, y2 = rotation.y * 2f, z2 = rotation.z * 2f;
			float xx = rotation.x * x2, yy = rotation.y * y2, zz = rotation.z * z2;
			float xy = rotation.x * y2, xz = rotation.x * z2, yz = rotation.y * z2;
			float wx = rotation.w * x2, wy = rotation.w * y2, wz = rotation.w * z2;
			return new Vector3(
				(1f - (yy + zz)) * point.x + (xy - wz) * point.y + (xz + wy) * point.z,
				(xy + wz) * point.x + (1f - (xx + zz)) * point.y + (yz - wx) * point.z,
				(xz - wy) * point.x + (yz + wx) * point.y + (1f - (xx + yy)) * point.z);
		}

		public static bool operator ==(Quaternion a, Quaternion b) => Dot(a, b) > 0.999999f;
		public static bool operator !=(Quaternion a, Quaternion b) => !(a == b);

		public static float Dot(Quaternion a, Quaternion b) => a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;

		private float Length => (float)Math.Sqrt(x * x + y * y + z * z + w * w);
		private Quaternion Normalized {
			get { float m = Length; return m < 1E-06f ? identity : new Quaternion(x / m, y / m, z / m, w / m); }
		}

		public static Quaternion Inverse(Quaternion r) {
			float n = r.x * r.x + r.y * r.y + r.z * r.z + r.w * r.w;
			if (n < 1E-06f) return identity;
			float inv = 1f / n;
			return new Quaternion(-r.x * inv, -r.y * inv, -r.z * inv, r.w * inv);
		}

		public static Quaternion AngleAxis(float angle, Vector3 axis) {
			axis = axis.normalized;
			float rad = angle * Mathf.Deg2Rad * 0.5f;
			float s = (float)Math.Sin(rad);
			return new Quaternion(axis.x * s, axis.y * s, axis.z * s, (float)Math.Cos(rad)).Normalized;
		}

		public static Quaternion Euler(float x, float y, float z) {
			float cx = (float)Math.Cos(x * Mathf.Deg2Rad * 0.5f), sx = (float)Math.Sin(x * Mathf.Deg2Rad * 0.5f);
			float cy = (float)Math.Cos(y * Mathf.Deg2Rad * 0.5f), sy = (float)Math.Sin(y * Mathf.Deg2Rad * 0.5f);
			float cz = (float)Math.Cos(z * Mathf.Deg2Rad * 0.5f), sz = (float)Math.Sin(z * Mathf.Deg2Rad * 0.5f);
			// Unity rotation order: Z, X, Y (applied as Y * X * Z)
			return new Quaternion(
				cy * sx * cz + sy * cx * sz,
				sy * cx * cz - cy * sx * sz,
				cy * cx * sz - sy * sx * cz,
				cy * cx * cz + sy * sx * sz).Normalized;
		}
		public static Quaternion Euler(Vector3 euler) => Euler(euler.x, euler.y, euler.z);

		public static Quaternion Lerp(Quaternion a, Quaternion b, float t) {
			t = Mathf.Clamp01(t);
			if (Dot(a, b) < 0f) b = new Quaternion(-b.x, -b.y, -b.z, -b.w);
			return new Quaternion(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t, a.w + (b.w - a.w) * t).Normalized;
		}

		public static Quaternion Slerp(Quaternion a, Quaternion b, float t) {
			t = Mathf.Clamp01(t);
			float dot = Dot(a, b);
			if (dot < 0f) { b = new Quaternion(-b.x, -b.y, -b.z, -b.w); dot = -dot; }
			if (dot > 0.9995f) return Lerp(a, b, t);
			float theta0 = (float)Math.Acos(dot);
			float theta = theta0 * t;
			float sinTheta = (float)Math.Sin(theta);
			float sinTheta0 = (float)Math.Sin(theta0);
			float s0 = (float)Math.Cos(theta) - dot * sinTheta / sinTheta0;
			float s1 = sinTheta / sinTheta0;
			return new Quaternion(a.x * s0 + b.x * s1, a.y * s0 + b.y * s1, a.z * s0 + b.z * s1, a.w * s0 + b.w * s1).Normalized;
		}

		public static Quaternion LookRotation(Vector3 forward, Vector3 up) {
			forward = forward.normalized;
			Vector3 right = Vector3.Cross(up, forward).normalized;
			up = Vector3.Cross(forward, right);
			float m00 = right.x, m01 = right.y, m02 = right.z;
			float m10 = up.x, m11 = up.y, m12 = up.z;
			float m20 = forward.x, m21 = forward.y, m22 = forward.z;
			float trace = m00 + m11 + m22;
			Quaternion q = default;
			if (trace > 0f) {
				float s = (float)Math.Sqrt(trace + 1f) * 2f;
				q.w = 0.25f * s; q.x = (m12 - m21) / s; q.y = (m20 - m02) / s; q.z = (m01 - m10) / s;
			} else if (m00 > m11 && m00 > m22) {
				float s = (float)Math.Sqrt(1f + m00 - m11 - m22) * 2f;
				q.w = (m12 - m21) / s; q.x = 0.25f * s; q.y = (m01 + m10) / s; q.z = (m02 + m20) / s;
			} else if (m11 > m22) {
				float s = (float)Math.Sqrt(1f + m11 - m00 - m22) * 2f;
				q.w = (m20 - m02) / s; q.x = (m01 + m10) / s; q.y = 0.25f * s; q.z = (m12 + m21) / s;
			} else {
				float s = (float)Math.Sqrt(1f + m22 - m00 - m11) * 2f;
				q.w = (m01 - m10) / s; q.x = (m02 + m20) / s; q.y = (m12 + m21) / s; q.z = 0.25f * s;
			}
			return q.Normalized;
		}
		public static Quaternion LookRotation(Vector3 forward) => LookRotation(forward, Vector3.up);

		public static Quaternion FromToRotation(Vector3 fromDirection, Vector3 toDirection) {
			Vector3 from = fromDirection.normalized, to = toDirection.normalized;
			float d = Vector3.Dot(from, to);
			if (d >= 1f - 1E-06f) return identity;
			if (d <= -1f + 1E-06f) {
				Vector3 axis = Vector3.Cross(Vector3.right, from);
				if (axis.sqrMagnitude < 1E-06f) axis = Vector3.Cross(Vector3.up, from);
				return AngleAxis(180f, axis.normalized);
			}
			Vector3 c = Vector3.Cross(from, to);
			float s = (float)Math.Sqrt((1f + d) * 2f);
			float invs = 1f / s;
			return new Quaternion(c.x * invs, c.y * invs, c.z * invs, s * 0.5f).Normalized;
		}

		public bool Equals(Quaternion other) => x == other.x && y == other.y && z == other.z && w == other.w;
		public override bool Equals(object other) => other is Quaternion q && Equals(q);
		public override int GetHashCode() => x.GetHashCode() ^ (y.GetHashCode() << 2) ^ (z.GetHashCode() >> 2) ^ (w.GetHashCode() >> 1);
		public override string ToString() => $"({x:F1}, {y:F1}, {z:F1}, {w:F1})";
	}
}
