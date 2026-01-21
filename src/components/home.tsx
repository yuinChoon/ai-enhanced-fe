import { useCallback, useState } from "react";
import TaskA from "./taskA/taskA";
import TaskB from "./taskB/taskB";
import TaskC from "./taskC/taskC";

const Home: React.FC = () => {
    const [selectedTask, setSelectedTask] = useState<string>("Home")

    const goHome = useCallback(() => {
        setSelectedTask("Home");
    }, []);

    const renderPage = () => {
        switch (selectedTask) {
            case "A":
                return <TaskA onClose={goHome} />
            case "B":
                return <TaskB onClose={goHome} />
            case "C":
                return <TaskC onClose={goHome} />
            default:
                return renderHome()
        }
    }

    const renderHome = () => (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ padding: '2rem', height: '100%' }}>
                <div style={{ paddingBottom: '8px' }}>
                    <h2 style={{ margin: 0 }}>Hi, I am Yuin Choon Ng</h2>
                    <p style={{ margin: 0 }}>This project is used for evaluating LLM capabilities in automated frontend engineering</p>
                </div>
                <div style={{ paddingBottom: '8px' }}>
                    <h3 style={{ margin: 0 }}>Task A</h3>
                    <p style={{ margin: 0 }}>
                        <strong>Goal: </strong>
                        Build a reusable user profile card with clear separation between display, edit, and committed data using controlled props.
                    </p>
                    <p style={{ margin: 0 }}>
                        <strong>Core Challenge: </strong>
                        LLM-generated code often collapses display and edit state, producing components that work in isolation but are hard to reuse or extend.
                    </p>
                </div>
                <div style={{ paddingBottom: '8px' }}>
                    <h3 style={{ margin: 0 }}>Task B</h3>
                    <p style={{ margin: 0 }}>
                        <strong>Goal: </strong>
                        Implement a team membership interface that composes list and editor components while coordinating edit flows across views.
                    </p>
                    <p style={{ margin: 0 }}>
                        <strong>Core Challenge: </strong>
                        LLM-assisted implementations frequently misplace state ownership, embedding page-level logic inside reusable components.
                    </p>
                </div>
                <div style={{ paddingBottom: '8px' }}>
                    <h3 style={{ margin: 0 }}>Task C</h3>
                    <p style={{ margin: 0 }}>
                        <strong>Goal: </strong>
                        Design a multi-step workflow for configuring role-based permissions with dynamic rule evaluation and final review.
                    </p>
                    <p style={{ margin: 0 }}>
                        <strong>Core Challenge: </strong>
                        LLM-generated code often ignores invalid intermediate states and weakens type guarantees, leading to subtle logic and consistency errors.
                    </p>
                </div>
            </div>
            <div style={{ padding: "2rem", height: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: 0.5, color: "#111827", }}>
                    Tasks
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, }}>
                    {[
                        { key: "A", label: "A" },
                        { key: "B", label: "B" },
                        { key: "C", label: "C" },
                    ].map((t) => {
                        const active = selectedTask === t.key;

                        return (
                            <div
                                key={t.key}
                                onClick={() => setSelectedTask(t.key)}
                                style={{ cursor: "pointer", height: 64, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, border: active ? "2px solid #111827" : "1px solid #e5e7eb", background: active ? "#111827" : "white", color: active ? "white" : "#111827", transition: "all 120ms ease", }}>
                                {t.label}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )

    return renderPage()
}

export default Home;