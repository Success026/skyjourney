export interface User {
    id: string;
    name: string;
    email: string;
    password?: string; // Optional for security reasons
    createdAt: Date;
    updatedAt: Date;
}

export interface UserProfile {
    userId: string;
    bio?: string;
    profilePicture?: string;
    preferences?: UserPreferences;
}

export interface UserPreferences {
    language: string;
    notificationsEnabled: boolean;
}