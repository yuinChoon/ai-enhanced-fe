import React, { useMemo } from "react";

export interface Member {
    id: string;
    name: string;
    avatarUrl: string;
    role: string;
    bio: string;
    location: string;
    isOnline: boolean;
    tags: string[];
    isNew?: boolean;
}

interface TeamMembershipDashboardProps {
    members?: Member[];
    query?: string;
    canDelete?: boolean;
    onQueryChange?: (value: string) => void;
    onContact?: (name: string) => void;
    onEditMember?: (memberId: string) => void;
    onAddMember?: () => void;
    onDeleteMember?: (memberId: string) => void;
}

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
};

const rowEven: React.CSSProperties = { background: "white" };
const rowOdd: React.CSSProperties = { background: "#fcfcfd" };

const TeamMembershipDashboardByDev: React.FC<TeamMembershipDashboardProps> = ({
    members = [],
    query = "",
    canDelete = false,
    onQueryChange,
    onContact,
    onEditMember,
    onAddMember,
    onDeleteMember
}) => {
    const filteredMembers = useMemo(() => {
        const q = query.trim().toLowerCase();
        return members.filter((m) => {
            const hitQuery =
                !q ||
                m.name.toLowerCase().includes(q) ||
                m.role.toLowerCase().includes(q) ||
                m.location.toLowerCase().includes(q);

            return hitQuery;
        });
    }, [members, query]);

    const getInitials = (name: string): string => {
        if (!name) return "";

        const parts = name.trim().split(/\s+/);

        if (parts.length === 1) {
            return parts[0].slice(0, 2).toUpperCase();
        }

        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    const handleTableAction = (e: React.ChangeEvent<HTMLSelectElement>, member: Member) => {
        const actionValue = e.target.value;
        const action = actionValue.toLowerCase()

        switch (action) {
            case "edit":
                onEditMember?.(member.id);
                break;
            case "delete":
                onDeleteMember?.(member.id);
                break;
            case "contact":
                onContact?.(member.name);
                break;
            default:
                break;
        }
    }

    return (
        <div>
            <div>
                <h2 style={{ margin: 0 }}>Team Membership & Permissions</h2>
                <p style={{ margin: "6px 0 0 0", color: "#6b7280" }}>
                    Search, filter, and update roles inline.
                </p>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                <input
                    value={query}
                    onChange={(e) => onQueryChange?.(e.target.value)}
                    placeholder="Search by name / role / location..."
                    style={{
                        flex: "1 1 260px",
                        minWidth: 240,
                        padding: "10px 12px",
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                        outline: "none",
                        boxSizing: "border-box",
                    }}
                />
                <button
                    type="button"
                    onClick={onAddMember}
                    style={{
                        padding: "10px 14px",
                        borderRadius: 12,
                        border: "1px solid #111827",
                        background: "#111827",
                        color: "white",
                        fontWeight: 700,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                    }}
                >
                    Add
                </button>
            </div>
            <div style={{ marginTop: 18, overflow: "auto" }}>
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "separate",
                        borderSpacing: 0,
                        border: "1px solid #e5e7eb",
                        borderRadius: 16,
                        overflow: "hidden",
                        background: "white",
                    }}
                >
                    <thead>
                        <tr>
                            <th style={thStyle}>Action</th>
                            <th style={thStyle}>Member</th>
                            <th style={thStyle}>Current Role</th>
                            <th style={thStyle}>Location</th>
                            <th style={thStyle}>Tags</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.map((m, idx) => (
                            <tr key={m.id} style={idx % 2 === 0 ? rowEven : rowOdd}>
                                <td style={tdStyle}>
                                    <select
                                        onChange={(e) => handleTableAction(e, m)}
                                        style={{ borderRadius: 12, }}
                                    >
                                        <option value="All" >All</option>
                                        <option value="Edit" >Edit</option>
                                        {canDelete && <option value="Delete" >Delete</option>}
                                        <option value="Contact" >Contact</option>
                                    </select>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                                        {m.avatarUrl ? (
                                            <img
                                                src={m.avatarUrl}
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: "50%",
                                                    objectFit: "cover",
                                                    flex: "0 0 auto",
                                                }} />
                                        ) : (
                                            <div
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: "50%",
                                                    background: "#9ca3af",
                                                    color: "white",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: 14,
                                                    fontWeight: 700,
                                                    userSelect: "none",
                                                }}
                                            >
                                                {getInitials(m.name)}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td style={tdStyle}>
                                    <span
                                        style={{
                                            display: "inline-block",
                                            padding: "6px 10px",
                                            borderRadius: 999,
                                            border: "1px solid #e5e7eb",
                                            background: "#f9fafb",
                                            fontSize: 12,
                                            fontWeight: 700,
                                        }}
                                    >
                                        {m.role}
                                    </span>
                                </td>
                                <td style={tdStyle}>{m.location}</td>
                                <td style={tdStyle}>
                                    <div style={{ display: "flex", flexWrap: "nowrap", gap: 6, overflowX: "auto", maxWidth: 220, paddingBottom: 2, }}>
                                        {m.tags.map((t) => (
                                            <span
                                                key={t}
                                                style={{
                                                    flex: "0 0 auto",
                                                    fontSize: 12,
                                                    padding: "4px 8px",
                                                    borderRadius: 999,
                                                    border: "1px solid #e5e7eb",
                                                    background: "white",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredMembers.length === 0 && (
                            <tr>
                                <td style={tdStyle} colSpan={6}>
                                    <div style={{ color: "#6b7280" }}>No members match the current search/filter.</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default TeamMembershipDashboardByDev;
