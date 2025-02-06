import React from "react";
import moment from "moment";
import * as path from "path";
import { existsSync } from "fs";
import { Notice } from "obsidian";
import { Platform } from "obsidian";
import { mkdir, writeFile } from "fs/promises";
import { PdfExportBehavior } from "@/settings";
import { stripTimekeepRuntimeData } from "@/schema";
import { createCSV, createMarkdownTable } from "@/export";
import { useSettings } from "@/contexts/use-settings-context";
import { useTimekeepStore } from "@/contexts/use-timekeep-store";

export default function TimekeepExportActions() {
	const settings = useSettings();
	const timekeepStore = useTimekeepStore();

	const onCopyMarkdown = () => {
		const timekeep = timekeepStore.getState();
		const currentTime = moment();
		const output = createMarkdownTable(timekeep, settings, currentTime);

		navigator.clipboard
			.writeText(output)
			.then(() => new Notice("Copied markdown to clipboard", 1500))
			.catch((error) => console.error("Failed to copy export", error));
	};

	const onCopyCSV = () => {
		const timekeep = timekeepStore.getState();
		const currentTime = moment();
		const output = createCSV(timekeep, settings, currentTime);

		navigator.clipboard
			.writeText(output)
			.then(() => new Notice("Copied CSV to clipboard", 1500))
			.catch((error) => console.error("Failed to copy export", error));
	};

	const onCopyJSON = () => {
		const timekeep = timekeepStore.getState();
		const output = JSON.stringify(
			stripTimekeepRuntimeData(timekeep),
			undefined,
			settings.formatCopiedJSON ? 4 : undefined
		);

		navigator.clipboard
			.writeText(output)
			.then(() => new Notice("Copied JSON to clipboard", 1500))
			.catch((error) => console.error("Failed to copy export", error));
	};

	const onSavePDF = async () => {
		const timekeep = timekeepStore.getState();

		// Pdf exports don't work in mobile mode
		if (Platform.isMobileApp) return;

		// Dynamic imports to prevent them from causing errors when loaded (Because they are unsupported on mobile)
		const electron = require("electron");
		const { pdf } = require("@/pdf");
		const pdfModule = require("@/components/pdf");

		const currentTime = moment();

		// Prompt user for save location
		const result = await electron.remote.dialog.showSaveDialog({
			title: "Save timesheet",
			defaultPath: "Timesheet.pdf",
			filters: [{ extensions: ["pdf"], name: "PDF" }],
			properties: ["showOverwriteConfirmation", "createDirectory"],
		});

		if (result.canceled) {
			return;
		}

		const outputPath = result.filePath;
		if (outputPath === undefined) {
			return;
		}
		const TimesheetPdf = pdfModule.default;

		// Create the PDF
		const createdPdf = pdf(
			<TimesheetPdf
				data={timekeep}
				title={settings.pdfTitle}
				footnote={settings.pdfFootnote}
				currentTime={currentTime}
				settings={settings}
			/>
		);

		// Create a blob from the PDF
		const buffer = await createdPdf.toBuffer();

		const fullOutputPath = path.normalize(outputPath);
		const fullOutputDir = path.dirname(fullOutputPath);

		// Create output directory if missing
		if (!existsSync(fullOutputDir)) {
			await mkdir(fullOutputDir);
		}

		try {
			await writeFile(outputPath, buffer);

			new Notice("Export successful", 1500);

			// Open the directory using the system explorer
			if (settings.pdfExportBehavior == PdfExportBehavior.OPEN_PATH) {
				electron.remote.shell.showItemInFolder(fullOutputPath);
			}

			// Open the exported file
			if (settings.pdfExportBehavior == PdfExportBehavior.OPEN_FILE) {
				await electron.remote.shell.openPath(fullOutputPath);
			}
		} catch (error) {
			console.error("Failed to write pdf file", error);
		}
	};

	return (
		<div className="timekeep-actions">
			<button onClick={onCopyMarkdown}>Copy Markdown</button>
			<button onClick={onCopyCSV}>Copy CSV</button>
			<button onClick={onCopyJSON}>Copy JSON</button>
			{!Platform.isMobileApp && (
				<button onClick={onSavePDF}>Save PDF</button>
			)}
		</div>
	);
}
