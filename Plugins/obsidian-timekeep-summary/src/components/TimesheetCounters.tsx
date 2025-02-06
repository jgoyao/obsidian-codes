import moment from "moment";
import { useStore } from "@/store";
import { Timekeep } from "@/schema";
import React, { useState, useEffect } from "react";
import { useSettings } from "@/contexts/use-settings-context";
import { useTimekeepStore } from "@/contexts/use-timekeep-store";
import { formatDurationLong, formatDurationShort } from "@/utils";
import {
	isKeepRunning,
	getRunningEntry,
	getTotalDuration,
	getEntryDuration,
	getTotalDurationOnDay,
} from "@/timekeep";

type TimingState = {
	running: boolean;
	current: string;
	currentShort: string;
	monday: string;
	mondayShort: string;
	tuesday: string;
	tuesdayShort: string;
	wednesday: string;
	wednesdayShort: string;
	thursday: string;
	thursdayShort: string;
	friday: string;
	fridayShort: string;
	total: string;
	totalShort: string;
};

/**
 * Gets the timing state for the provided timekeep
 *
 * @param timekeep The timekeep to get the state for
 * @returns The timing state
 */
function getTimingState(timekeep: Timekeep): TimingState {
	const currentTime = moment();
	const total = getTotalDuration(timekeep.entries, currentTime);
	const monday = getTotalDurationOnDay(timekeep.entries, currentTime,1);
	const tuesday = getTotalDurationOnDay(timekeep.entries, currentTime,2);
	const wednesday = getTotalDurationOnDay(timekeep.entries, currentTime,3);
	const thursday = getTotalDurationOnDay(timekeep.entries, currentTime,4);
	const friday = getTotalDurationOnDay(timekeep.entries, currentTime,5);
	const runningEntry = getRunningEntry(timekeep.entries);
	const current = runningEntry
		? getEntryDuration(runningEntry, currentTime)
		: 0;

	return {
		running: runningEntry !== null,
		current: formatDurationLong(current),
		currentShort: formatDurationShort(current),
		monday: formatDurationLong(monday),
		mondayShort: formatDurationShort(monday),
		tuesday: formatDurationLong(tuesday),
		tuesdayShort: formatDurationShort(tuesday),
		wednesday: formatDurationLong(wednesday),
		wednesdayShort: formatDurationShort(wednesday),
		thursday: formatDurationLong(thursday),
		thursdayShort: formatDurationShort(thursday),
		friday: formatDurationLong(friday),
		fridayShort: formatDurationShort(friday),
		total: formatDurationLong(total),
		totalShort: formatDurationShort(total),
	};
}

export default function TimesheetCounters() {
	const settings = useSettings();
	const timekeepStore = useTimekeepStore();
	const timekeep = useStore(timekeepStore);

	const [timing, setTiming] = useState<TimingState>(getTimingState(timekeep));

	// Update the current timings every second
	useEffect(() => {
		const updateTiming = () => setTiming(getTimingState(timekeep));

		// Initial update
		updateTiming();

		// Only schedule further updates if we are running
		if (isKeepRunning(timekeep)) {
			const intervalID = window.setInterval(updateTiming, 1000);

			return () => {
				clearInterval(intervalID);
			};
		}
	}, [timekeep]);

	return (
		<div>
			<div className="timekeep-timers">
				{timing.running  && (
					<div className="timekeep-timer">
						<span className="timekeep-timer-value">
							{timing.current}
						</span>
						{settings.showDecimalHours && (
							<span className="timekeep-timer-value-small">
								{timing.currentShort}
							</span>
						)}
						<span>Current</span>
					</div>
				)}
				<div className="timekeep-timer">
					<span className="timekeep-timer-value">{timing.totalShort}</span>
					{settings.showDecimalHours && (
						<span className="timekeep-timer-value-small">
							{timing.totalShort}
						</span>
					)}
					<span>Total</span>
				</div>
			</div>
			<div className="timekeep-timers">
			<div className="timekeep-timer">
					<span className="timekeep-timer-value">{timing.mondayShort}</span>
					{settings.showDecimalHours && (
						<span className="timekeep-timer-value-small">
							{timing.monday}
						</span>
					)}
					<span>Mon</span>
				</div>
				<div className="timekeep-timer">
					<span className="timekeep-timer-value">{timing.tuesdayShort}</span>
					{settings.showDecimalHours && (
						<span className="timekeep-timer-value-small">
							{timing.tuesday}
						</span>
					)}
					<span>Tue</span>
				</div>
				<div className="timekeep-timer">
					<span className="timekeep-timer-value">{timing.wednesdayShort}</span>
					{settings.showDecimalHours && (
						<span className="timekeep-timer-value-small">
							{timing.wednesday}
						</span>
					)}
					<span>Wed</span>
				</div>
				<div className="timekeep-timer">
					<span className="timekeep-timer-value">{timing.thursdayShort}</span>
					{settings.showDecimalHours && (
						<span className="timekeep-timer-value-small">
							{timing.thursday}
						</span>
					)}
					<span>Thu</span>
				</div>
				<div className="timekeep-timer">
					<span className="timekeep-timer-value">{timing.fridayShort}</span>
					{settings.showDecimalHours && (
						<span className="timekeep-timer-value-small">
							{timing.friday}
						</span>
					)}
					<span>Fri</span>
				</div>
			</div>
		</div>
	);
}
