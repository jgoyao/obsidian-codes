import React, {useState, useEffect} from "react";
import { Timekeep } from "@/schema";
import { Store, useStore } from "@/store";
import { App as ObsidianApp } from "obsidian";
import { TimekeepSettings } from "@/settings";
import { AppContext } from "@/contexts/use-app-context";
import TimesheetStart from "@/components/TimesheetStart";
import TimesheetTable from "@/components/TimesheetTable";
import TimesheetCounters from "@/components/TimesheetCounters";
import TimesheetSaveError from "@/components/TimesheetSaveError";
import { SettingsContext } from "@/contexts/use-settings-context";
import { TimekeepStoreContext } from "@/contexts/use-timekeep-store";
import TimesheetExportActions from "@/components/TimesheetExportActions";



export type AppProps = {
	// Obsidian app for creating modals
	app: ObsidianApp;
	// Timekeep state store
	timekeepStore: Store<Timekeep>;
	// Store for save error state
	saveErrorStore: Store<boolean>;
	// Timekeep settings store
	settingsStore: Store<TimekeepSettings>;
	// Callback to save the timekeep
	handleSaveTimekeep: (value: Timekeep) => Promise<void>;
	//Summary data
	summary: string
};

/**
 * Main app component, handles managing the app state and
 * providing the contexts.
 */
export default function App({
	app,
	timekeepStore,
	saveErrorStore,
	settingsStore,
	handleSaveTimekeep,
	summary
}: AppProps) {
	const settings = useStore(settingsStore);
	const saveError = useStore(saveErrorStore);

	return (
		<AppContext.Provider value={app}>
			<SettingsContext.Provider value={settings}>
				<TimekeepStoreContext.Provider value={timekeepStore}>
					{saveError ? (
						// Error page when saving fails
						<TimesheetSaveError
							handleSaveTimekeep={handleSaveTimekeep}
						/>
					) : (
						<div className="timekeep-container">
							{/*<TimesheetCounters />*/}
							{/*<TimesheetTable />*/}
						</div>
					)}
					<div className="timekeep-container">
						<SummaryTable data={summary} />
					</div>
				</TimekeepStoreContext.Provider>
			</SettingsContext.Provider>
		</AppContext.Provider>
	);
}

// Accordion item component
function AccordionItem({ title, content, level, addTotal }) {
    const [isOpen, setIsOpen] = useState(true);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    const calculateTotal = (content) => {
        return Object.values(content).reduce((sum, value) => sum + (typeof value === 'number' ? value : 0), 0);
    };

    const total = calculateTotal(content);

    useEffect(() => {
        addTotal(total);
    }, [total, addTotal]);

    return (
        <div>
            <div onClick={toggleAccordion} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                {title}
            </div>
            {isOpen && (
                <div style={{ paddingLeft: '20px' }}>
                    {typeof content === 'object' && level < 2 ? (
                        <NestedAccordion data={content} level={level + 1} addTotal={addTotal} />
                    ) : (
                        <table>
                            <tbody>
                                {Object.keys(content).map((key) => (
                                    <tr key={key}>
                                        <td>{key}</td>
                                        <td>{content[key]}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td><strong>Total</strong></td>
                                    <td>{total}</td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

// Recursive component to display nested data in accordion
function NestedAccordion({ data, level, addTotal }) {
    return (
        <div>
            {Object.keys(data).map((key) => (
                <AccordionItem key={key} title={key} content={data[key]} level={level} addTotal={addTotal} />
            ))}
        </div>
    );
}

// Main component to display summary data
function SummaryTable({ data }) {
    const [totals, setTotals] = useState([]);

    const addTotal = (total) => {
        setTotals((prevTotals) => {
            if (!prevTotals.includes(total)) {
                return [...prevTotals, total];
            }
            return prevTotals;
        });
    };

    let obj;
    try {
        obj = JSON.parse(data);
    } catch (e) {
        return <p>Invalid data format</p>;
    }
    if (Object.keys(obj).length === 0) {
        return <p>No summary data available</p>;
    }

    const grandTotal = totals.reduce((sum, total) => sum + total, 0);

    return (
        <div>
            <NestedAccordion data={obj} level={0} addTotal={addTotal} />
            <table>
                <tbody>
                    <tr>
                        <td><strong>Grand Total</strong></td>
                        <td>{grandTotal}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}