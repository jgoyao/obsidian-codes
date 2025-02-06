import { Moment } from "moment";
import { Store, createStore } from "@/store";
import { TimekeepSettingsTab } from "@/settings-tab";
import { PluginManifest, App as ObsidianApp } from "obsidian";
import { Plugin, MarkdownPostProcessorContext } from "obsidian";
import { SortOrder, defaultSettings, TimekeepSettings } from "@/settings";
import {
	load,
	loadSummary,
	isKeepRunning,
	isEntryRunning,
	getRunningEntry,
	getEntryDuration,
	getTotalDuration,
	extractTimekeepCodeblocks,
} from "@/timekeep";

import { Timekeep, TimeEntry } from "./schema";
import { TimekeepMarkdownView } from "./views/timekeep-markdown-view";

export default class TimekeepPlugin extends Plugin {
	settingsStore: Store<TimekeepSettings>;

	extractTimekeepCodeblocks: (value: string) => Timekeep[];
	isKeepRunning: (timekeep: Timekeep) => boolean;
	isEntryRunning: (entry: TimeEntry) => boolean;
	getRunningEntry: (entries: TimeEntry[]) => TimeEntry | null;
	getEntryDuration: (entry: TimeEntry, currentTime: Moment) => number;
	getTotalDuration: (entries: TimeEntry[], currentTime: Moment) => number;

	constructor(app: ObsidianApp, manifest: PluginManifest) {
		super(app, manifest);

		const saveSettings = this.saveData.bind(this);

		const settingsStore = createStore(defaultSettings);

		// Subscribe to settings changes to save them
		settingsStore.subscribe(() => {
			saveSettings(settingsStore.getState());
		});

		this.settingsStore = settingsStore;

		// Expose API functions
		this.extractTimekeepCodeblocks = extractTimekeepCodeblocks;
		this.isKeepRunning = isKeepRunning;
		this.isEntryRunning = isEntryRunning;
		this.getRunningEntry = getRunningEntry;
		this.getEntryDuration = getEntryDuration;
		this.getTotalDuration = getTotalDuration;
	}

	async onload(): Promise<void> {
		const loadedSettings: TimekeepSettings = Object.assign(
			{},
			defaultSettings,
			await this.loadData()
		);

		// Compatibility with old reverse segment order
		if (loadedSettings.reverseSegmentOrder) {
			delete loadedSettings.reverseSegmentOrder;
			loadedSettings.sortOrder = SortOrder.REVERSE_INSERTION;
		}

		// Load saved settings and combine with defaults
		this.settingsStore.setState(loadedSettings);

		this.addSettingTab(new TimekeepSettingsTab(this.app, this));

		this.registerMarkdownCodeBlockProcessor(
			"timekeep_s",
			async (
				source: string,
				el: HTMLElement,
				context: MarkdownPostProcessorContext
			) => {
				let loadResult = load(source);

				const activeFile = this.app.workspace.getActiveFile();
				if (activeFile) {
				  const currentFile = activeFile.path;
				  const folderPath = currentFile.substring(0, currentFile.lastIndexOf('/')); // Get the folder path from the current file path
				  const loadResultSummary = await loadSummary('', this.app, folderPath); // Pass the folder path to the load function
				  //editor.replaceSelection('\n```timekeep_s\n' + loadResult+'\n```\n');
				  if (loadResult.success == true)
				  {
				  	loadResult = { success: loadResult.success, timekeep: loadResult.timekeep, summary: loadResultSummary};
				  }
				} else {
				  console.error("No active file found.");
				}
				

				context.addChild(
					new TimekeepMarkdownView(
						el,
						this.app,
						this.settingsStore,
						context,
						loadResult
					)
				);
			}
		);


		this.addCommand({
			id: `insert`,
			name: `Insert Tracker Summary`,
			editorCallback: (e) => {
				e.replaceSelection('\n```timekeep_s\n{"entries": []}\n```\n');
			},
		});
	}
}
