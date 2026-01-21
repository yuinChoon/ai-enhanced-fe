import React, { useMemo, useState } from "react";
import MultiStepModalByDev, { type PermissionDef, type PermissionKey, type Role, type Step } from "./MultiStepModalByDev";

interface TaskCProps {
    onClose: () => void;
}

const PERMISSIONS: PermissionDef[] = [
    {
        key: "BASE_ACCESS",
        label: "Basic Access Right",
        desc: "Basic accress right",
        modeByRole: { Admin: "required", Editor: "required", Viewer: "required" },
    },
    {
        key: "EXPORT_DATA",
        label: "Data Exportation",
        desc: "Only Admin AND Editor (optional)",
        modeByRole: { Admin: "optional", Editor: "optional", Viewer: "forbidden" },
    },
    {
        key: "SERVER_CONFIG",
        label: "Server Configuration",
        desc: "Only Admin (required)",
        modeByRole: { Admin: "required", Editor: "forbidden", Viewer: "forbidden" },
    },
    {
        key: "USER_MANAGEMENT",
        label: "User Management",
        desc: "Only Admin (required)",
        modeByRole: { Admin: "required", Editor: "forbidden", Viewer: "forbidden" },
    },
    {
        key: "DELETE_RECORDS",
        label: "History Management",
        desc: "Only Admin (optional)",
        modeByRole: { Admin: "optional", Editor: "forbidden", Viewer: "forbidden" },
    },
];

const TaskC: React.FC<TaskCProps> = ({ onClose }) => {
    const [step, setStep] = useState<Step>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMsg, setSubmitMsg] = useState("");
    const [name, setName] = useState<string>("")
    const [avatarUrl, setAvatarUrl] = useState<string>("")
    const [role, setRole] = useState<Role | "">("")
    const [bio, setBio] = useState<string>("")
    const [location, setLocation] = useState<string>("")
    const [isOnline, setIsOnline] = useState<boolean>(false)
    const [tags, setTags] = useState<Array<string>>([])
    const [optionalSelected, setOptionalSelected] = useState<Record<PermissionKey, boolean>>({
        BASE_ACCESS: false,
        EXPORT_DATA: false,
        SERVER_CONFIG: false,
        USER_MANAGEMENT: false,
        DELETE_RECORDS: false,
    });

    const optionalAllowedKeys = useMemo(() => {
        if (role === "") return [];
        return PERMISSIONS.filter((p) => p.modeByRole[role] === "optional").map((p) => p.key);
    }, [role]);

    const sanitizeOptionalSelectedForRole = (nextRole: Role) => {
        const allowed = PERMISSIONS.filter((p) => p.modeByRole[nextRole] === "optional").map((p) => p.key);
        setOptionalSelected((prev) => {
            const next = { ...prev };
            for (const k of Object.keys(next) as PermissionKey[]) {
                if (!allowed.includes(k)) next[k] = false;
            }
            return next;
        });
    };

    const handleRoleChange = (v: Role) => {
        setRole(v);
        sanitizeOptionalSelectedForRole(v);
    };

    const handleToggleOptional = (key: PermissionKey, checked: boolean) => {
        if (!optionalAllowedKeys.includes(key)) return;
        setOptionalSelected((prev) => ({ ...prev, [key]: checked }));
    };

    const onBack = () => {
        setSubmitMsg("");
        if (step === 2) setStep(1);
        if (step === 3) setStep(2);
    };

    const onNext = () => {
        setSubmitMsg("");
        if (step === 1) setStep(2);
        if (step === 2) setStep(3);
    };

    const onSubmit = async () => {
        setIsSubmitting(true);
        setSubmitMsg("");

        await new Promise((r) => setTimeout(r, 900));
        const ok = Math.random() < 0.85;

        setSubmitMsg(ok ? "✅ Permissions saved successfully." : "❌ Failed to save. Please try again.");
        setIsSubmitting(false);
    };

    const onClearMessage = () => setSubmitMsg("");

    const onContact = () => {
        console.log("Signal received! The user clicked the contact button");
        alert("Connecting you to a software engineer...");
    };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "end" }}>
                <button onClick={onClose}>x</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", flex: 1 }}>
                <div style={{ padding: "2rem" }}>
                    <MultiStepModalByDev
                        step={step}
                        onBack={onBack}
                        onNext={onNext}
                        isSubmitting={isSubmitting}
                        submitMsg={submitMsg}
                        onSubmit={onSubmit}
                        onClearMessage={onClearMessage}
                        permissions={PERMISSIONS}
                        optionalSelected={optionalSelected}
                        onToggleOptional={handleToggleOptional}
                        name={name}
                        avatarUrl={avatarUrl}
                        role={role}
                        bio={bio}
                        location={location}
                        isOnline={isOnline}
                        tags={tags}
                        onContact={onContact}
                        onNameChange={setName}
                        onAvatarUrlChange={setAvatarUrl}
                        onRoleChange={handleRoleChange}
                        onBioChange={setBio}
                        onLocationChange={setLocation}
                        onIsOnlineChange={setIsOnline}
                        onTagsChange={setTags}
                    />
                </div>

                <div style={{ padding: "2rem", textAlign: "center" }} />
            </div>
        </div>
    );
};

export default TaskC;
