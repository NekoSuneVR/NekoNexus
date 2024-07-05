using System;
using System.Collections.Generic;
using System.Linq;

namespace Paradise.Realtime.Core {
	internal class BalancingLoopScheduler : ILoopScheduler, IDisposable {
		private readonly Dictionary<ILoop, LoopScheduler> loops = new Dictionary<ILoop, LoopScheduler>();
		private readonly List<LoopScheduler> schedulers = new List<LoopScheduler>(new LoopScheduler[Environment.ProcessorCount * 2]);
		private bool isDisposed;

		public float TickRate { get; private set; }
		public float TickInterval {
			get { return 1000 / TickRate; }
		}

		public IReadOnlyCollection<LoopScheduler> Schedulers => schedulers.AsReadOnly();

		public BalancingLoopScheduler(float tickRate) {
			if (tickRate <= 0)
				throw new ArgumentOutOfRangeException(nameof(tickRate), "Tick rate cannot be less or equal to 0.");

			TickRate = tickRate;

			for (var i = 0; i < schedulers.Count; i++) {
				schedulers[i] = new LoopScheduler(tickRate);
				schedulers[i].Start();
				schedulers[i].Pause();
			}
		}

		public void Dispose() {
			if (isDisposed)
				return;

			foreach (var scheduler in schedulers) {
				scheduler.Dispose();
			}

			loops.Clear();
			isDisposed = true;
		}

		public void Schedule(ILoop loop) {
			var scheduler = GetLeastLoadScheduler();
			System.Diagnostics.Debug.Assert(scheduler != null);
			scheduler.Schedule(loop);
			loops.Add(loop, scheduler);

			if (scheduler.IsPaused) {
				scheduler.Resume();
			}
		}

		public bool Unschedule(ILoop loop) {
			if (!loops.TryGetValue(loop, out var scheduler)) {
				return false;
			}

			System.Diagnostics.Debug.Assert(!scheduler.IsPaused);
			var result = scheduler.Unschedule(loop) & loops.Remove(loop);

			if (scheduler.Loops.Count == 0) {
				scheduler.Pause();
			}

			return result;
		}

		public float GetLoad() {
			var sum = 0f;

			foreach (var scheduler in schedulers) {
				sum += scheduler.GetLoad();
			}

			return sum / schedulers.Count;
		}

		private LoopScheduler GetLeastLoadScheduler() {
			var minScheduler = default(LoopScheduler);
			var minLoad = float.PositiveInfinity;

			foreach (var scheduler in schedulers) {
				var load = scheduler.GetLoad();

				if (load < minLoad) {
					minLoad = load;
					minScheduler = scheduler;
				}
			}

			if (minScheduler == null) {
				minScheduler = schedulers.FirstOrDefault();
			}

			return minScheduler;
		}
	}
}
