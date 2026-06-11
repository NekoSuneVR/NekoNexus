namespace NekoNexus.Realtime.Core {
	public interface IState {
		void OnEnter();
		void OnExit();
		void OnResume();
		void OnUpdate();
	}
}
