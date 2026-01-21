import React, { useEffect, useMemo, useState } from "react";

interface UserDetailsCardByDevProps {
    name?: string;
    avatarUrl?: string;
    role?: string;
    bio?: string;
    location?: string;
    isOnline?: boolean;
    tags?: string[];
    onContactClick?: () => void;
    onNameChange?: (value: string) => void;
    onAvatarUrlChange?: (value: string) => void;
    onRoleChange?: (value: string) => void;
    onBioChange?: (value: string) => void;
    onLocationChange?: (value: string) => void;
    onIsOnlineChange?: (value: boolean) => void;
    onTagsChange?: (value: string[]) => void;
    onCancelEdit?: () => void;
    onSaveEdit?: () => void;
    onSaveResult?: (ok: boolean) => void;
    editable?: boolean;
    hideEditActions?: boolean;
    requestSaveToken?: number;
    roleOptions?: Array<{ value: string; label: string }>;
    rolePlaceholder?: string;
    startInEdit?: boolean;
}

const UserDetailsCardByDev: React.FC<UserDetailsCardByDevProps> = ({
    name = "",
    avatarUrl = "",
    role = "",
    bio = "",
    location = "",
    isOnline = false,
    tags = [],
    onContactClick,
    onNameChange,
    onAvatarUrlChange,
    onRoleChange,
    onBioChange,
    onLocationChange,
    onIsOnlineChange,
    onTagsChange,
    onCancelEdit,
    onSaveEdit,
    onSaveResult,
    editable = false,
    hideEditActions = false,
    requestSaveToken = undefined,
    roleOptions = [],
    rolePlaceholder = "",
    startInEdit = false,
}) => {
    const statusColor = isOnline ? "#22c55e" : "#ef4444";

    const hasData = name.trim().length > 0 || role.trim().length > 0 || location.trim().length > 0 || bio.trim().length > 0 || tags.length > 0;

    const [isEditing, setIsEditing] = useState<boolean>(() => startInEdit || !hasData);
    const [draftName, setDraftName] = useState<string>(name);
    const [draftAvatarUrl, setDraftAvatarUrl] = useState<string>(avatarUrl);
    const [draftRole, setDraftRole] = useState<string>(role);
    const [draftBio, setDraftBio] = useState<string>(bio);
    const [draftLocation, setDraftLocation] = useState<string>(location);
    const [draftIsOnline, setDraftIsOnline] = useState<boolean>(isOnline);
    const [draftTagsText, setDraftTagsText] = useState<string>(tags.join(", "));
    const [errorMsg, setErrorMsg] = useState<string>("");

    const draftTags = useMemo(() => {
        return draftTagsText.split(",").map((s) => s.trim()).filter(Boolean);
    }, [draftTagsText]);

    useEffect(() => {
        if (!isEditing) {
            setDraftName(name);
            setDraftAvatarUrl(avatarUrl);
            setDraftRole(role);
            setDraftBio(bio);
            setDraftLocation(location);
            setDraftIsOnline(isOnline);
            setDraftTagsText(tags.join(", "));
        }
    }, [name, avatarUrl, role, bio, location, isOnline, tags, isEditing]);

    const handleStartEdit = () => {
        if (!editable) return;
        setErrorMsg("");
        setDraftName(name);
        setDraftAvatarUrl(avatarUrl);
        setDraftRole(role);
        setDraftBio(bio);
        setDraftLocation(location);
        setDraftIsOnline(isOnline);
        setDraftTagsText(tags.join(", "));
        setIsEditing(true);
    };

    const handleCancel = () => {
        setErrorMsg("");
        setDraftName(name);
        setDraftAvatarUrl(avatarUrl);
        setDraftRole(role);
        setDraftBio(bio);
        setDraftLocation(location);
        setDraftIsOnline(isOnline);
        setDraftTagsText(tags.join(", "));
        setIsEditing(false);
        onCancelEdit?.();
    };

    const handleSave = (keepEditing: boolean, silent: boolean) => {
        const err = validateDraft();
        if (err) {
            setErrorMsg(err);
            onSaveResult?.(false);
            return;
        }
        setErrorMsg("");
        onNameChange?.(draftName);
        onAvatarUrlChange?.(draftAvatarUrl);
        onRoleChange?.(draftRole);
        onBioChange?.(draftBio);
        onLocationChange?.(draftLocation);
        onIsOnlineChange?.(draftIsOnline);
        onTagsChange?.(draftTags);
        !silent && alert("Saved successfully");
        if (keepEditing) {
            setIsEditing(true);
        } else {
            setIsEditing(false);
            onSaveEdit?.();
        }
        onSaveResult?.(true);
    };

    const validateDraft = () => {
        const trimmedName = draftName.trim();
        const trimmedRole = draftRole.trim();
        const trimmedLocation = draftLocation.trim();
        const trimmedAvatar = draftAvatarUrl.trim();
        const trimmedBio = draftBio.trim();

        if (trimmedName.length < 2) return "Name must be at least 2 characters.";
        if (!trimmedRole) return "Role is required.";
        if (!trimmedLocation) return "Location is required.";
        if (trimmedBio.length > 300) return "Bio must be 300 characters or less.";

        if (trimmedAvatar) {
            try {
                const u = new URL(trimmedAvatar);
                if (u.protocol !== "http:" && u.protocol !== "https:") {
                    return "Avatar URL must start with http:// or https://";
                }
            } catch {
                return "Avatar URL is invalid.";
            }
        }

        if (draftTags.length === 0) return "Please add at least 1 tag.";
        if (draftTags.length > 8) return "Tags cannot exceed 8.";
        for (const t of draftTags) {
            if (t.length > 20) return "Each tag must be 20 characters or less.";
        }

        return "";
    };

    useEffect(() => {
        if (!editable) return;
        if (requestSaveToken === undefined || requestSaveToken === 0) return;

        handleSave(true, true);
    }, [requestSaveToken]);


    return (
        <div style={{ height: '100%', border: "1px solid #111827", borderRadius: 16, }}>
            {!isEditing && <div style={{ padding: "1.25rem", overflow: "auto", }}>
                {editable && (
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <button
                            type="button"
                            onClick={handleStartEdit}
                            style={{ padding: "8px 10px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#f8f8f8", cursor: "pointer", fontWeight: 600, }}
                        >
                            Edit
                        </button>
                    </div>
                )}
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ position: "relative", width: 120, height: 120 }}>
                        <img
                            src={avatarUrl}
                            style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", display: "block", }}
                        />
                        <span
                            aria-label={isOnline ? "online" : "offline"}
                            title={isOnline ? "Online" : "Offline"}
                            style={{ position: "absolute", right: 6, bottom: 6, width: 18, height: 18, borderRadius: "50%", background: statusColor, border: "3px solid white", boxShadow: "0 2px 6px rgba(0,0,0,0.15)", }}
                        />
                    </div>
                </div>
                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>
                        {name}
                    </div>
                    <div style={{ marginTop: 6, fontSize: 14, color: "#6b7280" }}>
                        {role}
                    </div>
                    <p style={{ marginTop: 12, marginBottom: 0, fontSize: 14, lineHeight: 1.5, color: "#374151", }}>
                        {bio}
                    </p>
                    <div style={{ marginTop: 12, fontSize: 14, color: "#374151" }}>
                        <span style={{ fontWeight: 600 }}>Location:</span> {location}
                    </div>
                    <div style={{ marginTop: 12, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8, }}>
                        {tags.map((t) => (
                            <span
                                key={t}
                                style={{ fontSize: 12, padding: "6px 10px", borderRadius: 999, border: "1px solid #e5e7eb", background: "#f9fafb", color: "#374151", }}
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={onContactClick}
                        disabled={!onContactClick}
                        style={{ marginTop: 16, width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid #111827", background: "#111827", color: "white", fontWeight: 600, cursor: onContactClick ? "pointer" : "not-allowed", opacity: onContactClick ? 1 : 0.6, }}
                    >
                        Contact
                    </button>
                </div>
            </div>}
            {isEditing && (
                <div style={{ padding: "1.25rem", overflow: "auto", }}>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>Edit Profile</div>
                    <Field label="Name">
                        <input
                            value={draftName}
                            onChange={(e) => setDraftName(e.target.value)}
                            style={inputStyle(false)}
                        />
                    </Field>
                    <Field label="Avatar URL">
                        <input
                            value={draftAvatarUrl}
                            onChange={(e) => setDraftAvatarUrl(e.target.value)}
                            style={inputStyle(false)}
                        />
                    </Field>
                    <Field label="Role">
                        <select
                            value={draftRole}
                            onChange={(e) => setDraftRole(e.target.value)}
                            style={inputStyle(false)}
                        >
                            <option value="">{rolePlaceholder ?? "Select a role..."}</option>
                            {roleOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Bio">
                        <textarea
                            value={draftBio}
                            onChange={(e) => setDraftBio(e.target.value)}
                            rows={4}
                            style={{ ...inputStyle(false), resize: "vertical" }}
                        />
                    </Field>
                    <Field label="Location">
                        <input
                            value={draftLocation}
                            onChange={(e) => setDraftLocation(e.target.value)}
                            style={inputStyle(false)}
                        />
                    </Field>
                    <Field label="Online Status">
                        <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                            <input
                                type="checkbox"
                                checked={draftIsOnline}
                                onChange={(e) => setDraftIsOnline(e.target.checked)}
                            />
                            {draftIsOnline ? "Online" : "Offline"}
                        </label>
                    </Field>
                    <Field label="Tags (comma-separated)">
                        <input
                            value={draftTagsText}
                            onChange={(e) => setDraftTagsText(e.target.value)}
                            style={inputStyle(false)}
                        />
                    </Field>
                    <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12, }}>
                        Tip: tags example — React, TypeScript, CSS
                    </div>
                    {errorMsg && (
                        <div style={{ marginTop: 8, marginBottom: 12, padding: "10px 12px", borderRadius: 12, background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#991B1B", fontSize: 13, fontWeight: 600, }}>
                            {errorMsg}
                        </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 12, }}>
                        {!hideEditActions && (<div style={{ display: "flex", gap: 8 }}>
                            <button
                                type="button"
                                onClick={handleCancel}
                                style={{ padding: "8px 12px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#e5e7eb", cursor: "pointer", fontWeight: 600, }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSave(false, false)}
                                style={{ padding: "8px 12px", borderRadius: 12, border: "1px solid #111827", background: "#111827", color: "white", cursor: "pointer", fontWeight: 600, }}
                            >
                                Save
                            </button>
                        </div>)}
                    </div>
                </div>
            )}
        </div>
    );
};

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>{label}</div>
            {children}
        </div>
    );
}

function inputStyle(disabled?: boolean): React.CSSProperties {
    return {
        width: "100%",
        boxSizing: "border-box",
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        outline: "none",
        opacity: disabled ? 0.6 : 1,
        background: disabled ? "#f9fafb" : "white",
    };
}

export default UserDetailsCardByDev;
