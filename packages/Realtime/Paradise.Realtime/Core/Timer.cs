namespace Paradise.Realtime.Core {
	public sealed class Timer : BaseTimer {
		private float nextElapsed;

		public Timer(ILoop loop, float interval) : base(loop, interval) { }

		public override void Reset() {
			ResetNextElapsed();
			IsEnabled = false;
		}

		public override bool Tick() {
			if (IsEnabled && Loop.Time >= nextElapsed) {
				OnElapsed();
				ResetNextElapsed();

				return true;
			}

			return false;
		}

		/* Calculate the time of when the next Elapsed should happen. */
		private void ResetNextElapsed() => nextElapsed = Loop.Time + Interval;
	}
}
