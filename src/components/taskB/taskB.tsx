import { useState } from "react";
import UserDetailsCardByDev from "../taskA/UserDetailsCardByDev";
import TeamMembershipDashboardByDev, { type Member } from "./TeamMembershipDashboardByDev";

interface TaskBProps {
    onClose: () => void;
}

const TaskB: React.FC<TaskBProps> = ({ onClose }) => {

    const [members, setMembers] = useState<Member[]>([]);
    const [query, setQuery] = useState<string>("");
    const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

    const handleContact = (name: string) => {
        console.log("Contact:", name);
        alert(`Connecting you to ${name}...`);
    };

    const handleEditMember = (id: string) => setEditingMemberId(id);

    const handleAddMember = () => {
        const newMember: Member = {
            id: crypto.randomUUID(),
            name: "",
            avatarUrl: "",
            role: "",
            bio: "",
            location: "",
            isOnline: false,
            tags: [],
            isNew: true,
        };

        setMembers((prev) => [newMember, ...prev]);
        setEditingMemberId(newMember.id);
    };

    const handleDeleteMember = (memberId: string) => {
        setMembers((prev) => prev.filter((m) => m.id !== memberId));

        if (editingMemberId === memberId) {
            setEditingMemberId(null);
        }
    };

    const updateMember = (id: string, patch: Partial<Member>) => {
        setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
    };

    const onCancelEdit = (memberId: string) => {
        const m = members.find(x => x.id === memberId)

        if (!m) {
            setEditingMemberId(null)
            return;
        }

        const isEmptyRequired = m?.name.trim() === "" && m?.role.trim() === "" && m?.location.trim() === "" && m?.tags.length === 0

        if (isEmptyRequired) {
            setMembers(prev => prev.filter(x => x.id !== memberId));
        }
        setEditingMemberId(null);
    }

    const renderEditingMember = () => {
        const member = members.find(m => m.id === editingMemberId)

        if (!member) return null;

        return (
            <UserDetailsCardByDev
                name={member.name}
                avatarUrl={member.avatarUrl}
                role={member.role}
                bio={member.bio}
                location={member.location}
                isOnline={member.isOnline}
                tags={member.tags}
                editable
                onContactClick={() => handleContact(member.name)}
                onNameChange={(v) => updateMember(member.id, { name: v })}
                onAvatarUrlChange={(v) => updateMember(member.id, { avatarUrl: v })}
                onRoleChange={(v) => updateMember(member.id, { role: v })}
                onBioChange={(v) => updateMember(member.id, { bio: v })}
                onLocationChange={(v) => updateMember(member.id, { location: v })}
                onIsOnlineChange={(v) => updateMember(member.id, { isOnline: v })}
                onTagsChange={(v) => updateMember(member.id, { tags: v })}
                onCancelEdit={() => onCancelEdit(member.id)}
                onSaveEdit={() => setEditingMemberId(null)}
                roleOptions={[
                    { value: "Admin", label: "Admin" },
                    { value: "Editor", label: "Editor" },
                    { value: "Viewer", label: "Viewer" },
                ]}
                rolePlaceholder="Select a role..."
                startInEdit={true}
            />
        )
    }

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
                <button onClick={onClose}>x</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, minHeight: 0 }}>
                <div style={{ padding: '2rem' }}>
                    {!editingMemberId && <TeamMembershipDashboardByDev
                        members={members}
                        query={query}
                        canDelete={true}
                        onQueryChange={setQuery}
                        onContact={handleContact}
                        onEditMember={handleEditMember}
                        onAddMember={handleAddMember}
                        onDeleteMember={handleDeleteMember}
                    />}
                    {editingMemberId && renderEditingMember()}
                </div>
                <div style={{ padding: '2rem' }}>
                </div>
            </div>
        </div>
    )
}

export default TaskB;