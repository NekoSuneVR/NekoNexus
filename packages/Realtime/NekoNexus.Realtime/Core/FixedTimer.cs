namespace NekoNexus.Realtime.Core {
	public sealed class FixedTimer : BaseTimer {
		private float accumulatedTime;
		private float tickTime;

		public FixedTimer(ILoop loop, float interval) : base(loop, interval) {
			/* Space. */
		}

		public override void Reset() {
			tickTime = 0;
			accumulatedTime = 0;
			IsEnabled = false;
		}

		public override bool Tick() {
			if (!IsEnabled)
				return false;

			/* Check if Tick() was called in the same ILoop.Tick() call. */
			if (tickTime != Loop.Time) {
				tickTime = Loop.Time;
				accumulatedTime += Loop.DeltaTime;
			}

			if (accumulatedTime >= Interval) {
				OnElapsed();
				accumulatedTime -= Interval;

				return true;
			}

			return false;
		}
	}
}
