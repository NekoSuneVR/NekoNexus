using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Paradise.Client {
	public class ParadisePopupDialog : IPopupDialog {
		protected Vector2 _size = new Vector2(460f, 240f);

		protected PopupSystem.AlertType _alertType;

		protected string _okCaption = string.Empty;
		protected string _cancelCaption = string.Empty;
		protected string _auxCaption = string.Empty;

		protected Action _callbackOk;
		protected Action _callbackCancel;
		protected Action _callbackAux;

		public string Text { get; set; }
		public string Title { get; set; }

		public bool HideOnOK { get; set; } = true;
		public bool HideOnCancel { get; set; } = true;
		public bool HideOnAux { get; set; } = false;

		public bool IsOkButtonEnabled { get; set; } = true;
		public bool IsCancelButtonEnabled { get; set; } = true;
		public bool IsAuxButtonEnabled { get; set; } = true;

		public GuiDepth Depth {
			get {
				return GuiDepth.Popup;
			}
		}

		public ParadisePopupDialog(string title, string text, PopupSystem.AlertType flag, string okCaption, Action ok, string cancelCaption, Action cancel, string auxCaption, Action aux) {
			Text = text;
			Title = title;
			_alertType = flag;

			_callbackOk = ok;
			_callbackCancel = cancel;
			_callbackAux = aux;

			_okCaption = okCaption;
			_cancelCaption = cancelCaption;
			_auxCaption = auxCaption;
		}

		public ParadisePopupDialog(string title, string text) : this(title, text, PopupSystem.AlertType.None, string.Empty, null, String.Empty, null, String.Empty, null) { }

		public void OnGUI() {
			Rect rect = new Rect((Screen.width - _size.x) * 0.5f, (Screen.height - _size.y - 56f) * 0.5f, _size.x, _size.y);

			GUI.BeginGroup(rect, GUIContent.none, PopupSkin.window);
			GUI.Label(new Rect(0f, 0f, _size.x, 56f), Title, PopupSkin.title);

			DrawPopupWindow();

			switch (_alertType) {
				case PopupSystem.AlertType.OK:
					DoOKButton();
					break;
				case PopupSystem.AlertType.OKCancel:
					DoOKCancelButtons();
					break;
				case PopupSystem.AlertType.Cancel:
					DoCancelButton();
					break;
			}

			GUI.EndGroup();
		}

		protected void DrawPopupWindow() {
			GUI.Label(new Rect(17f, 55f, _size.x - 34f, _size.y - 100f), Text, PopupSkin.label);
		}

		private void DoOKButton() {
			var rect = new Rect((_size.x - 120f) * 0.5f, _size.y - 40f, 120f, 32f);

			if (!string.IsNullOrEmpty(_auxCaption)) {
				rect = new Rect(_size.x * 0.5f - 125f, _size.y - 40f, 120f, 32f);
			}

			GUI.enabled = IsOkButtonEnabled;
			if (GUITools.Button(rect, new GUIContent((!string.IsNullOrEmpty(_okCaption)) ? _okCaption : LocalizedStrings.OkCaps), PopupSkin.button)) {
				if (HideOnOK)
					PopupSystem.HideMessage(this);

				_callbackOk?.Invoke();
			}
			GUI.enabled = true;

			if (!string.IsNullOrEmpty(_auxCaption)) {
				rect = new Rect(_size.x * 0.5f + 5f, _size.y - 40f, 120f, 32f);

				GUI.enabled = IsAuxButtonEnabled;
				if (GUITools.Button(rect, new GUIContent(_auxCaption), PopupSkin.button)) {
					if (HideOnAux)
						PopupSystem.HideMessage(this);

					_callbackAux?.Invoke();
				}
				GUI.enabled = true;
			}
		}

		private void DoOKCancelButtons() {
			var btnWidth = 120f;
			var rect = new Rect(_size.x * 0.5f - 125f, _size.y - 40f, btnWidth, 32f);

			if (!string.IsNullOrEmpty(_auxCaption)) {
				btnWidth = (_size.x - (4 * 5f)) / 3;
				rect = new Rect(5f, _size.y - 40f, btnWidth, 32f);
			}

			GUI.enabled = IsOkButtonEnabled;
			if (GUITools.Button(rect, new GUIContent((!string.IsNullOrEmpty(_okCaption)) ? _okCaption : LocalizedStrings.OkCaps), PopupSkin.button)) {
				if (HideOnOK)
					PopupSystem.HideMessage(this);

				_callbackOk?.Invoke();
			}
			GUI.enabled = true;

			rect = new Rect(_size.x * 0.5f + 5f, _size.y - 40f, btnWidth, 32f);

			if (!string.IsNullOrEmpty(_auxCaption)) {
				rect = new Rect((_size.x / 2) - (btnWidth / 2), _size.y - 40f, btnWidth, 32f);
			}

			GUI.enabled = IsCancelButtonEnabled;
			if (GUITools.Button(rect, new GUIContent((!string.IsNullOrEmpty(_cancelCaption)) ? _cancelCaption : LocalizedStrings.CancelCaps), PopupSkin.button)) {
				if (HideOnCancel)
					PopupSystem.HideMessage(this);

				_callbackCancel?.Invoke();
			}
			GUI.enabled = true;

			if (!string.IsNullOrEmpty(_auxCaption)) {
				rect = new Rect(_size.x - (btnWidth + 5), _size.y - 40f, btnWidth, 32f);

				GUI.enabled = IsAuxButtonEnabled;
				if (GUITools.Button(rect, new GUIContent(_auxCaption), PopupSkin.button)) {
					if (HideOnAux)
						PopupSystem.HideMessage(this);

					_callbackAux?.Invoke();
				}
				GUI.enabled = true;
			}
		}

		private void DoCancelButton() {
			//GUIStyle guistyle = PopupSkin.button;
			//PopupSystem.ActionType actionType = this._actionType;
			//if (actionType != PopupSystem.ActionType.Negative) {
			//	if (actionType == PopupSystem.ActionType.Positive) {
			//		guistyle = PopupSkin.button_green;
			//	}
			//} else {
			//	guistyle = PopupSkin.button_red;
			//}
			//Rect rect = new Rect((this._size.x - 120f) * 0.5f, this._size.y - 40f, 120f, 32f);
			//GUIContent guicontent = new GUIContent((!string.IsNullOrEmpty(this._cancelCaption)) ? this._cancelCaption : LocalizedStrings.CancelCaps);
			//bool flag;
			//if (this._allowAudio) {
			//	flag = GUITools.Button(rect, guicontent, guistyle);
			//} else {
			//	flag = GUI.Button(rect, guicontent, guistyle);
			//}
			//if (flag) {
			//	PopupSystem.HideMessage(this);
			//	if (this._callbackCancel != null) {
			//		this._callbackCancel();
			//	}
			//}
		}

		public void OnHide() { }
	}
}
