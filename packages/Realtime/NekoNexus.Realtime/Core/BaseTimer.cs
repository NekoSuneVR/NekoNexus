using System;
using System.Runtime.CompilerServices;

namespace NekoNexus.Realtime.Core {
	public abstract class BaseTimer : ITimer {
		private float interval;
		protected ILoop Loop { get; }

		public BaseTimer(ILoop loop, TimeSpan interval) : this(loop, (float)interval.TotalMilliseconds) { }

		protected BaseTimer(ILoop loop, float interval) {
			ThrowInterval(interval, nameof(interval));
			Loop = loop ?? throw new ArgumentNullException(nameof(loop));
			this.interval = interval;
			Reset();
		}

		public bool IsEnabled { get; set; }

		public float Interval {
			get => interval;
			set {
				ThrowInterval(value, nameof(value));
				Reset();
				interval = value;
			}
		}

		public event Action Elapsed;
		public void Start() => IsEnabled = true;
		public void Stop() => IsEnabled = false;

		public void Restart() {
			Reset();
			Start();
		}

		public abstract void Reset();
		public abstract bool Tick();

		protected void OnElapsed() {
			Elapsed?.Invoke();
		}

		[MethodImpl(MethodImplOptions.NoInlining)]
		private static void ThrowInterval(float value, string paramName) {
			if (value <= 0) {
				throw new ArgumentOutOfRangeException(paramName, "Interval cannot be less or equal to 0.");
			}
		}
	}
}
