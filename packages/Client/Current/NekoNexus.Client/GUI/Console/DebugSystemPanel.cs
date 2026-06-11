using UnityEngine;

namespace NekoNexus.Client {
	internal class DebugSystemPanel : IDebugPage {
		public string Title => "System Info";

		public void Draw() {
			NekoNexusGUITools.DrawGroup("System Info", delegate {
				NekoNexusGUITools.DrawTextField("Device Name", SystemInfo.deviceName);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Device Model", SystemInfo.deviceModel);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Device Identifier", SystemInfo.deviceUniqueIdentifier);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Device Type", SystemInfo.deviceType);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Operating System", SystemInfo.operatingSystem);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("CPU Type", SystemInfo.processorType);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("CPU Core Count", SystemInfo.processorCount);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Usable Memory", $"{SystemInfo.systemMemorySize} MB");

				GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

				GUILayout.Toggle(SystemInfo.supportsAccelerometer, "Supports Accelerometer", BlueStonez.toggle);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				GUILayout.Toggle(SystemInfo.supportsGyroscope, "Supports Gyroscope", BlueStonez.toggle);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				GUILayout.Toggle(SystemInfo.supportsLocationService, "Supports Location Services", BlueStonez.toggle);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				GUILayout.Toggle(SystemInfo.supportsVibration, "Supports Vibration", BlueStonez.toggle);

			});

			GUILayout.Space(NekoNexusGUITools.SECTION_SPACING);

			NekoNexusGUITools.DrawGroup("GPU Info", delegate {
				NekoNexusGUITools.DrawTextField("Manufacturer", SystemInfo.graphicsDeviceVendor);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Model", SystemInfo.graphicsDeviceName);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Vendor ID", $"{SystemInfo.graphicsDeviceVendorID:x4}");
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Product ID", $"{SystemInfo.graphicsDeviceID:x4}");
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Driver Version", SystemInfo.graphicsDeviceVersion);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Usable Memory", $"{SystemInfo.graphicsMemorySize} MB");
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Shader Level", SystemInfo.graphicsShaderLevel);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Pixel Fill Rate", SystemInfo.graphicsPixelFillrate);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Supported Render Target Count", SystemInfo.supportedRenderTargetCount);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Max Texture Size", SystemInfo.maxTextureSize);

				GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

				GUILayout.Toggle(SystemInfo.supports3DTextures, "Supports 3D Textures", BlueStonez.toggle);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				GUILayout.Toggle(SystemInfo.supportsComputeShaders, "Supports Compute Shaders", BlueStonez.toggle);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				GUILayout.Toggle(SystemInfo.supportsImageEffects, "Supports Image Effects", BlueStonez.toggle);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				GUILayout.Toggle(SystemInfo.supportsInstancing, "Supports Instancing", BlueStonez.toggle);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				GUILayout.Toggle(SystemInfo.supportsRenderTextures, "Supports Render Textures", BlueStonez.toggle);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				GUILayout.Toggle(SystemInfo.supportsRenderToCubemap, "Supports Render to Cubemap", BlueStonez.toggle);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				GUILayout.Toggle(SystemInfo.supportsShadows, "Supports Shadows", BlueStonez.toggle);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				GUILayout.Toggle(SystemInfo.supportsSparseTextures, "Supports Sparse Textures", BlueStonez.toggle);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Supports Stencil", SystemInfo.supportsStencil);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				GUILayout.Toggle(SystemInfo.supportsVertexPrograms, "Supports Vertex Programs", BlueStonez.toggle);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("NPOT Support", SystemInfo.npotSupport);
			});

			GUILayout.Space(NekoNexusGUITools.SECTION_SPACING);

			NekoNexusGUITools.DrawGroup("Graphics Overrides", delegate {
				var pixelLightCount = (float)QualitySettings.pixelLightCount;
				NekoNexusGUITools.DrawSlider("Pixel Light Count", ref pixelLightCount, 0, 10, delegate (float value) {
					GUILayout.Label(Mathf.RoundToInt(value).ToString(), BlueStonez.label_interparkbold_11pt_left, GUILayout.Width(NekoNexusGUITools.SLIDER_VALUE_WIDTH), GUILayout.Height(22f));
				});

				if (pixelLightCount != QualitySettings.pixelLightCount) {
					QualitySettings.pixelLightCount = Mathf.RoundToInt(pixelLightCount);
				}

				GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

				var masterTextureLimit = (float)QualitySettings.masterTextureLimit;
				NekoNexusGUITools.DrawSlider("Master Texture Limit", ref masterTextureLimit, 0, 10, delegate (float value) {
					GUILayout.Label(Mathf.RoundToInt(value).ToString(), BlueStonez.label_interparkbold_11pt_left, GUILayout.Width(NekoNexusGUITools.SLIDER_VALUE_WIDTH), GUILayout.Height(22f));
				});

				if (masterTextureLimit != QualitySettings.masterTextureLimit) {
					QualitySettings.masterTextureLimit = Mathf.RoundToInt(masterTextureLimit);
				}

				GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

				var maxQueuedFrames = (float)QualitySettings.maxQueuedFrames;
				NekoNexusGUITools.DrawSlider("Max Queued Frames", ref maxQueuedFrames, -1, 10, delegate (float value) {
					GUILayout.Label(Mathf.RoundToInt(value).ToString(), BlueStonez.label_interparkbold_11pt_left, GUILayout.Width(NekoNexusGUITools.SLIDER_VALUE_WIDTH), GUILayout.Height(22f));
				});

				if (maxQueuedFrames != QualitySettings.maxQueuedFrames) {
					QualitySettings.maxQueuedFrames = Mathf.RoundToInt(maxQueuedFrames);
				}

				GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

				var maxLODLevel = (float)QualitySettings.maximumLODLevel;
				NekoNexusGUITools.DrawSlider("Max LOD Level", ref maxLODLevel, 0, 7, delegate (float value) {
					GUILayout.Label(Mathf.RoundToInt(value).ToString(), BlueStonez.label_interparkbold_11pt_left, GUILayout.Width(NekoNexusGUITools.SLIDER_VALUE_WIDTH), GUILayout.Height(22f));
				});

				if (maxLODLevel != QualitySettings.maximumLODLevel) {
					QualitySettings.maximumLODLevel = Mathf.RoundToInt(maxLODLevel);
				}

				GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

				var vsync = (float)QualitySettings.vSyncCount;
				NekoNexusGUITools.DrawSlider("Vertical Sync", ref vsync, 0, 2, delegate (float value) {
					GUILayout.Label(Mathf.RoundToInt(value).ToString(), BlueStonez.label_interparkbold_11pt_left, GUILayout.Width(NekoNexusGUITools.SLIDER_VALUE_WIDTH), GUILayout.Height(22f));
				});

				if (vsync != QualitySettings.vSyncCount) {
					QualitySettings.vSyncCount = Mathf.RoundToInt(vsync);
				}

				GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

				var antiAliasing = (float)QualitySettings.antiAliasing;
				NekoNexusGUITools.DrawSlider("Anti Aliasing", ref antiAliasing, 0, 4, delegate (float value) {
					GUILayout.Label(Mathf.RoundToInt(value).ToString(), BlueStonez.label_interparkbold_11pt_left, GUILayout.Width(NekoNexusGUITools.SLIDER_VALUE_WIDTH), GUILayout.Height(22f));
				});

				if (antiAliasing != QualitySettings.antiAliasing) {
					QualitySettings.antiAliasing = Mathf.RoundToInt(antiAliasing);
				}

				GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

				var anisotropicFiltering = (float)QualitySettings.anisotropicFiltering;
				NekoNexusGUITools.DrawSlider("Anisotropic Filtering", ref anisotropicFiltering, 0, 2, delegate (float value) {
					GUILayout.Label(Mathf.RoundToInt(value).ToString(), BlueStonez.label_interparkbold_11pt_left, GUILayout.Width(NekoNexusGUITools.SLIDER_VALUE_WIDTH), GUILayout.Height(22f));
				});

				if (anisotropicFiltering != (int)QualitySettings.anisotropicFiltering) {
					QualitySettings.anisotropicFiltering = (AnisotropicFiltering)Mathf.RoundToInt(anisotropicFiltering);
				}

				GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

				var lodBias = (float)QualitySettings.lodBias;
				NekoNexusGUITools.DrawSlider("LOD Bias", ref lodBias, 0, 4, delegate (float value) {
					GUILayout.Label(Mathf.RoundToInt(value).ToString(), BlueStonez.label_interparkbold_11pt_left, GUILayout.Width(NekoNexusGUITools.SLIDER_VALUE_WIDTH), GUILayout.Height(22f));
				});

				if (lodBias != QualitySettings.lodBias) {
					QualitySettings.lodBias = Mathf.RoundToInt(lodBias);
				}

				GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

				var globalMaxLOD = (float)Shader.globalMaximumLOD;
				NekoNexusGUITools.DrawSlider("Global Max LOD", ref globalMaxLOD, 100, 600, delegate (float value) {
					GUILayout.Label(Mathf.RoundToInt(value).ToString(), BlueStonez.label_interparkbold_11pt_left, GUILayout.Width(NekoNexusGUITools.SLIDER_VALUE_WIDTH), GUILayout.Height(22f));
				});

				if (globalMaxLOD != Shader.globalMaximumLOD) {
					Shader.globalMaximumLOD = Mathf.RoundToInt(globalMaxLOD);
				}
			});
		}
	}
}
