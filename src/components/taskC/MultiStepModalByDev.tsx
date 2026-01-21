import React, { useMemo, useState } from "react";
import UserDetailsCardByDev from "../taskA/UserDetailsCardByDev";

export type Role = "Admin" | "Editor" | "Viewer";
export type Step = 1 | 2 | 3;

export type PermissionKey =
    | "BASE_ACCESS"
    | "EXPORT_DATA"
    | "SERVER_CONFIG"
    | "USER_MANAGEMENT"
    | "DELETE_RECORDS";

export type PermissionMode = "required" | "optional" | "forbidden";

export interface PermissionDef {
    key: PermissionKey;
    label: string;
    desc: string;
    modeByRole: Record<Role, PermissionMode>;
}

export interface MultiStepModalProps {
    step: Step;
    onBack: () => void;
    onNext: () => void;
    isSubmitting: boolean;
    submitMsg: string;
    onSubmit: () => void;
    onClearMessage: () => void;
    name: string;
    avatarUrl: string;
    role: Role | "";
    bio: string;
    location: string;
    isOnline: boolean;
    tags: string[];
    onContact: () => void;
    onNameChange: (v: string) => void;
    onAvatarUrlChange: (v: string) => void;
    onRoleChange: (v: Role) => void;
    onBioChange: (v: string) => void;
    onLocationChange: (v: string) => void;
    onIsOnlineChange: (v: boolean) => void;
    onTagsChange: (v: string[]) => void;
    permissions: PermissionDef[];
    optionalSelected: Record<PermissionKey, boolean>;
    onToggleOptional: (key: PermissionKey, checked: boolean) => void;
}

const MultiStepModalByDev: React.FC<MultiStepModalProps> = ({
    step,
    onBack,
    onNext,
    isSubmitting,
    submitMsg,
    onSubmit,
    onClearMessage,
    name,
    avatarUrl,
    role,
    bio,
    location,
    isOnline,
    tags,
    onContact,
    onNameChange,
    onAvatarUrlChange,
    onRoleChange,
    onBioChange,
    onLocationChange,
    onIsOnlineChange,
    onTagsChange,
    permissions,
    optionalSelected,
    onToggleOptional,
}) => {

    const [saveToken, setSaveToken] = useState(0);
    const [pendingAutoNext, setPendingAutoNext] = useState(false);

    const effectivePermissions = useMemo(() => {
        const map: Record<PermissionKey, { checked: boolean; mode: PermissionMode }> = {} as any;

        for (const p of permissions) {
            if (role === "") {
                for (const p of permissions) {
                    map[p.key] = { checked: false, mode: "forbidden" };
                }
                return map;
            }

            const mode = p.modeByRole[role];
            if (mode === "required") map[p.key] = { checked: true, mode };
            else if (mode === "forbidden") map[p.key] = { checked: false, mode };
            else map[p.key] = { checked: Boolean(optionalSelected[p.key]), mode };
        }
        return map;
    }, [permissions, role, optionalSelected]);

    const StepPill = ({ n, label }: { n: Step; label: string }) => {
        const active = step === n;
        const done = step > n;
        return (
            <div
                style={{
                    padding: "8px 12px",
                    borderRadius: 999,
                    border: "1px solid #e5e7eb",
                    background: active ? "#111827" : done ? "#f3f4f6" : "white",
                    color: active ? "white" : "#111827",
                    fontWeight: 800,
                    fontSize: 12,
                    display: "inline-flex",
                    gap: 8,
                    alignItems: "center",
                }}
            >
                <span
                    style={{
                        width: 18,
                        height: 18,
                        borderRadius: 999,
                        background: active ? "white" : "#111827",
                        color: active ? "#111827" : "white",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 900,
                    }}
                >
                    {n}
                </span>
                {label}
            </div>
        );
    };
    const handleNextClick = () => {
        if (step === 1) {
            setPendingAutoNext(true);
            setSaveToken((x) => x + 1);
            return;
        }
        onNext();
    };


    return (
        <div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <StepPill n={1} label="Edit User" />
                <StepPill n={2} label="Assign Permissions" />
                <StepPill n={3} label="Review & Submit" />
            </div>
            <div style={{ marginTop: 14 }}>
                {step === 1 && (
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                            <div style={{ fontWeight: 900, fontSize: 14 }}>Step 1: User Profile</div>
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <UserDetailsCardByDev
                                name={name}
                                avatarUrl={avatarUrl}
                                role={role}
                                bio={bio}
                                location={location}
                                isOnline={isOnline}
                                tags={tags}
                                onContactClick={onContact}
                                editable={true}
                                onNameChange={onNameChange}
                                onAvatarUrlChange={onAvatarUrlChange}
                                onRoleChange={(v) => onRoleChange(v as Role)}
                                onBioChange={onBioChange}
                                onLocationChange={onLocationChange}
                                onIsOnlineChange={onIsOnlineChange}
                                onTagsChange={onTagsChange}
                                hideEditActions={true}
                                requestSaveToken={saveToken}
                                onSaveResult={(ok) => {
                                    if (step === 1 && pendingAutoNext) {
                                        setPendingAutoNext(false);
                                        if (ok) onNext();
                                    }
                                }}
                                roleOptions={[
                                    { value: "Admin", label: "Admin" },
                                    { value: "Editor", label: "Editor" },
                                    { value: "Viewer", label: "Viewer" },
                                ]}
                                rolePlaceholder="Select a role..."
                            />
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <div style={{ fontWeight: 900, fontSize: 14, marginBottom: 10 }}>
                            Step 2: Permissions (role-driven rules)
                        </div>
                        <div
                            style={{
                                border: "1px solid #e5e7eb",
                                borderRadius: 16,
                                background: "white",
                                overflow: "hidden",
                            }}
                        >
                            <div style={{ padding: "12px 14px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                                <div style={{ fontWeight: 900 }}>Role: {role}</div>
                            </div>
                            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>Feature</th>
                                        <th style={thStyle}>Status</th>
                                        <th style={thStyle}>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {permissions.map((p) => {
                                        const info = effectivePermissions[p.key];
                                        const mode = info.mode;

                                        const disabled = mode !== "optional";
                                        const checked = info.checked;

                                        return (
                                            <tr key={p.key}>
                                                <td style={tdStyle}>
                                                    <div style={{ fontWeight: 900 }}>{p.label}</div>
                                                </td>
                                                <td style={tdStyle}>
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        disabled={disabled}
                                                        onChange={(e) => onToggleOptional(p.key, e.target.checked)}
                                                    />
                                                </td>
                                                <td style={tdStyle}>
                                                    <div style={{ fontSize: 12, color: "#6b7280" }}>{p.desc}</div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <div>
                        <div style={{ fontWeight: 900, fontSize: 14, marginBottom: 10 }}>Step 3: Review</div>
                        <div
                            style={{
                                border: "1px solid #e5e7eb",
                                borderRadius: 16,
                                background: "white",
                                padding: 14,
                            }}
                        >
                            <div style={{ display: "grid", gap: 6 }}>
                                <div>
                                    <b>User:</b> {name}
                                </div>
                                <div>
                                    <b>Role:</b> {role}
                                </div>
                                <div>
                                    <b>Location:</b> {location}
                                </div>
                            </div>
                            <div style={{ marginTop: 12, fontWeight: 900 }}>Effective Permissions</div>
                            <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
                                {permissions
                                    .filter((p) => effectivePermissions[p.key].checked)
                                    .map((p) => (
                                        <span
                                            key={p.key}
                                            style={{
                                                fontSize: 12,
                                                padding: "6px 10px",
                                                borderRadius: 999,
                                                border: "1px solid #e5e7eb",
                                                background: "#f9fafb",
                                                fontWeight: 800,
                                            }}
                                        >
                                            {p.label}
                                        </span>
                                    ))}
                            </div>
                            <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                                <button
                                    type="button"
                                    onClick={onSubmit}
                                    disabled={isSubmitting}
                                    style={{
                                        padding: "10px 12px",
                                        borderRadius: 12,
                                        border: "1px solid #111827",
                                        background: "#111827",
                                        color: "white",
                                        cursor: isSubmitting ? "not-allowed" : "pointer",
                                        fontWeight: 900,
                                        opacity: isSubmitting ? 0.7 : 1,
                                        minWidth: 140,
                                    }}
                                >
                                    {isSubmitting ? "Submitting..." : "Submit"}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClearMessage}
                                    style={{
                                        padding: "10px 12px",
                                        borderRadius: 12,
                                        border: "1px solid #e5e7eb",
                                        background: "white",
                                        cursor: "pointer",
                                        fontWeight: 900,
                                        minWidth: 140,
                                    }}
                                >
                                    Clear Message
                                </button>
                            </div>
                            {submitMsg && (
                                <div
                                    style={{
                                        marginTop: 12,
                                        fontWeight: 800,
                                        color: submitMsg.startsWith("✅") ? "#166534" : "#991B1B",
                                    }}
                                >
                                    {submitMsg}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                <button
                    type="button"
                    onClick={() => {
                        setPendingAutoNext(false);
                        onBack();
                    }}
                    disabled={step === 1 || isSubmitting}
                    style={btnSecondary(step === 1 || isSubmitting)}
                >
                    Back
                </button>
                <button
                    type="button"
                    onClick={handleNextClick}
                    disabled={step === 3 || isSubmitting}
                    style={btnPrimary(step === 3 || isSubmitting)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

const thStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "12px 14px",
    fontSize: 12,
    color: "#6b7280",
    fontWeight: 800,
    borderBottom: "1px solid #e5e7eb",
    background: "#f9fafb",
    whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
    padding: "12px 14px",
    borderBottom: "1px solid #e5e7eb",
    verticalAlign: "top",
};

function btnPrimary(disabled: boolean): React.CSSProperties {
    return {
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid #111827",
        background: "#111827",
        color: "white",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 900,
        opacity: disabled ? 0.6 : 1,
        minWidth: 120,
    };
}

function btnSecondary(disabled: boolean): React.CSSProperties {
    return {
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        background: "white",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 900,
        opacity: disabled ? 0.6 : 1,
        minWidth: 120,
    };
}

export default MultiStepModalByDev;
