using System;

namespace UnityEngine {
	[Serializable]
	public struct Color : IEquatable<Color> {
		public float r, g, b, a;

		public Color(float r, float g, float b, float a) { this.r = r; this.g = g; this.b = b; this.a = a; }
		public Color(float r, float g, float b) { this.r = r; this.g = g; this.b = b; this.a = 1f; }

		public static Color white => new Color(1f, 1f, 1f, 1f);
		public static Color black => new Color(0f, 0f, 0f, 1f);
		public static Color clear => new Color(0f, 0f, 0f, 0f);
		public static Color red => new Color(1f, 0f, 0f, 1f);
		public static Color green => new Color(0f, 1f, 0f, 1f);
		public static Color blue => new Color(0f, 0f, 1f, 1f);

		public float this[int index] {
			get { switch (index) { case 0: return r; case 1: return g; case 2: return b; case 3: return a; default: throw new IndexOutOfRangeException("Invalid Color index!"); } }
			set { switch (index) { case 0: r = value; break; case 1: g = value; break; case 2: b = value; break; case 3: a = value; break; default: throw new IndexOutOfRangeException("Invalid Color index!"); } }
		}

		public static Color operator +(Color a, Color b) => new Color(a.r + b.r, a.g + b.g, a.b + b.b, a.a + b.a);
		public static Color operator -(Color a, Color b) => new Color(a.r - b.r, a.g - b.g, a.b - b.b, a.a - b.a);
		public static Color operator *(Color a, float d) => new Color(a.r * d, a.g * d, a.b * d, a.a * d);
		public static Color operator *(Color a, Color b) => new Color(a.r * b.r, a.g * b.g, a.b * b.b, a.a * b.a);
		public static bool operator ==(Color lhs, Color rhs) => (Vector4)lhs == (Vector4)rhs;
		public static bool operator !=(Color lhs, Color rhs) => !(lhs == rhs);

		public static Color Lerp(Color a, Color b, float t) {
			t = Mathf.Clamp01(t);
			return new Color(a.r + (b.r - a.r) * t, a.g + (b.g - a.g) * t, a.b + (b.b - a.b) * t, a.a + (b.a - a.a) * t);
		}

		public static implicit operator Color(Color32 c) => new Color(c.r / 255f, c.g / 255f, c.b / 255f, c.a / 255f);
		public static implicit operator Color32(Color c) => new Color32(
			(byte)(Mathf.Clamp01(c.r) * 255f), (byte)(Mathf.Clamp01(c.g) * 255f),
			(byte)(Mathf.Clamp01(c.b) * 255f), (byte)(Mathf.Clamp01(c.a) * 255f));

		public bool Equals(Color other) => r == other.r && g == other.g && b == other.b && a == other.a;
		public override bool Equals(object other) => other is Color c && Equals(c);
		public override int GetHashCode() => ((Vector4)this).GetHashCode();
		public override string ToString() => $"RGBA({r:F3}, {g:F3}, {b:F3}, {a:F3})";

		private struct Vector4 {
			public float x, y, z, w;
			public static implicit operator Vector4(Color c) { return new Vector4 { x = c.r, y = c.g, z = c.b, w = c.a }; }
			public static bool operator ==(Vector4 a, Vector4 b) { float dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z, dw = a.w - b.w; return dx * dx + dy * dy + dz * dz + dw * dw < 9.9999994E-11f; }
			public static bool operator !=(Vector4 a, Vector4 b) => !(a == b);
			public override bool Equals(object o) => o is Vector4 v && this == v;
			public override int GetHashCode() => x.GetHashCode() ^ (y.GetHashCode() << 2) ^ (z.GetHashCode() >> 2) ^ (w.GetHashCode() >> 1);
		}
	}

	[Serializable]
	public struct Color32 {
		public byte r, g, b, a;
		public Color32(byte r, byte g, byte b, byte a) { this.r = r; this.g = g; this.b = b; this.a = a; }
		public override string ToString() => $"RGBA({r}, {g}, {b}, {a})";
	}
}
