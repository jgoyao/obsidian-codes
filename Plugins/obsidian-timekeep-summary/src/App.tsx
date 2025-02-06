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

                    <div>
						<SummaryTable data={summary} />
					</div>
                    <br></br>

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
					
				</TimekeepStoreContext.Provider>
			</SettingsContext.Provider>
		</AppContext.Provider>
	);
}

// Accordion item component
function AccordionItem({ title, content, level, addTotal, addKeySum }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    const calculateTotal = (content) => {
        return Object.values(content).reduce((sum, value) => sum + (typeof value === 'number' ? value : 0), 0);
    };

    const total = calculateTotal(content);

    useEffect(() => {
        addTotal(total);
        if (level === 0) {
            addKeySum(title, total);
        }
    }, [total, addTotal, addKeySum, title, level]);

    return (
        <div>
            <div onClick={toggleAccordion} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                {title}
            </div>
            {isOpen && (
                <div style={{ paddingLeft: '20px' }}>
                    {typeof content === 'object' && level < 2 ? (
                        <NestedAccordion data={content} level={level + 1} addTotal={addTotal} addKeySum={addKeySum} />
                    ) : (
                        <table>
                            <tbody>
                                {Object.keys(content).map((key) => (
                                    <tr key={key}>
                                        <td>{key}</td>
                                        <td>{content[key]} h.</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td><strong>Total</strong></td>
                                    <td>{total} h.</td>
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
function NestedAccordion({ data, level, addTotal, addKeySum }) {
    const calculateNestedTotal = (data) => {
        return Object.values(data).reduce((sum, value) => {
            if (typeof value === 'number') {
                return sum + value;
            } else if (typeof value === 'object') {
                return sum + calculateNestedTotal(value);
            }
            return sum;
        }, 0);
    };

    useEffect(() => {
        if (level === 0) {
            Object.keys(data).forEach((key) => {
                const nestedTotal = calculateNestedTotal(data[key]);
                addKeySum(key, nestedTotal);
            });
        }
    }, [data, level, addKeySum]);

    return (
        <div>
            {Object.keys(data).map((key) => (
                <AccordionItem key={key} title={key} content={data[key]} level={level} addTotal={addTotal} addKeySum={addKeySum} />
            ))}
        </div>
    );
}

// Main component to display summary data
function SummaryTable({ data }) {
    const [totals, setTotals] = useState([]);
    const [keySums, setKeySums] = useState({});

    const addTotal = (total) => {
        setTotals((prevTotals) => {
            if (!prevTotals.includes(total)) {
                return [...prevTotals, total];
            }
            return prevTotals;
        });
    };

    const addKeySum = (key, sum) => {
        setKeySums((prevKeySums) => ({
            ...prevKeySums,
            [key]: sum,
        }));
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
            <table>
                <thead>
                    <tr>
                        <td>Summary</td>
                        <td>Total Hours (1610 h.)</td>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(keySums).map((key) => (
                        <tr key={key}>
                            <td><strong>{key} Sum</strong></td>
                            <td>{keySums[key]} h.</td>
                        </tr>
                    ))}
                    <tr>
                        <td><strong>Current status</strong></td>
                        <td>{grandTotal} h.</td>
                    </tr>
                </tbody>
            </table>
            <hr></hr>
            <h1>Detailed</h1>
            <NestedAccordion data={obj} level={0} addTotal={addTotal} addKeySum={addKeySum} />
        </div>
    );
}