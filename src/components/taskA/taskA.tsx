import { useState } from "react";
import UserDetailsCardByDev from "./UserDetailsCardByDev";

interface TaskAProps {
    onClose: () => void;
}

const TaskA: React.FC<TaskAProps> = ({ onClose }) => {
    const [name, setName] = useState<string>("")
    const [avatarUrl, setAvatarUrl] = useState<string>("")
    const [role, setRole] = useState<string>("")
    const [bio, setBio] = useState<string>("")
    const [location, setLocation] = useState<string>("")
    const [isOnline, setIsOnline] = useState<boolean>(false)
    const [tags, setTags] = useState<Array<string>>([])

    const handleContact = () => {
        console.log("Signal received! The user clicked the contact button")
        alert("Connecting you to a software engineer...")
    }

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
                <button onClick={onClose}>x</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1 }}>
                <div style={{ padding: '2rem' }}>
                    <UserDetailsCardByDev
                        name={name}
                        avatarUrl={avatarUrl}
                        role={role}
                        bio={bio}
                        location={location}
                        isOnline={isOnline}
                        tags={tags}
                        onContactClick={handleContact}
                        onNameChange={setName}
                        onAvatarUrlChange={setAvatarUrl}
                        onRoleChange={setRole}
                        onBioChange={setBio}
                        onLocationChange={setLocation}
                        onIsOnlineChange={setIsOnline}
                        onTagsChange={setTags}
                        editable={true}
                        roleOptions={[
                            { value: "Admin", label: "Admin" },
                            { value: "Editor", label: "Editor" },
                            { value: "Viewer", label: "Viewer" },
                        ]}
                        rolePlaceholder="Select a role..."
                    />
                </div>
                <div style={{ padding: '2rem' }}>
                </div>
            </div>
        </div>
    )
}

export default TaskA;