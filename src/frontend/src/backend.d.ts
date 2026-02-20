import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
    email?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCoachingTopic(topic: string): Promise<void>;
    addGoals(topic: string, newGoals: Array<string>): Promise<void>;
    addSessionToHistory(session: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAvailability(): Promise<boolean>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCoachingTopics(): Promise<Array<string>>;
    getGoals(user: Principal, topic: string): Promise<Array<string>>;
    getSessionHistory(user: Principal): Promise<{
        __kind__: "Empty";
        Empty: boolean;
    } | {
        __kind__: "Sessions";
        Sessions: Array<string>;
    }>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeGoal(topic: string, goal: string): Promise<{
        __kind__: "Success";
        Success: string;
    } | {
        __kind__: "Failure";
        Failure: string;
    }>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setGoals(topic: string, newGoals: Array<string>): Promise<void>;
    startSession(topic: string): Promise<{
        __kind__: "Error";
        Error: string;
    } | {
        __kind__: "Success";
        Success: string;
    }>;
    toggleAvailability(status: boolean): Promise<void>;
    validateGoal(user: Principal, topic: string, goal: string): Promise<{
        __kind__: "GoalNotFound";
        GoalNotFound: string;
    } | {
        __kind__: "GoalExists";
        GoalExists: string;
    }>;
}
