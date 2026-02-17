import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type WritingID = bigint;
export interface Writing {
    id: WritingID;
    categories: Array<CategoryID>;
    title: string;
    content: string;
    contentWarnings: Array<string>;
    submissions: bigint;
    author?: Principal;
    state: WritingState;
    parentPageId?: WritingID;
}
export type CategoryID = bigint;
export interface UserProfile {
    name: string;
}
export interface Category {
    id: CategoryID;
    status: Status;
    title: string;
    subcategoryIds: Array<CategoryID>;
    parentCategoryId?: CategoryID;
    supportedLanguages: Array<string>;
    focusBannerUrl: string;
}
export enum Status {
    active = "active",
    inactive = "inactive"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum WritingState {
    pending = "pending",
    published = "published",
    rejected = "rejected",
    draft = "draft"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    associateCategory(writingId: WritingID, categoryId: CategoryID): Promise<void>;
    categoryHasLanguages(categoryId: CategoryID, languages: Array<string>): Promise<boolean>;
    createCategory(title: string, parentCategoryId: CategoryID | null, supportedLanguages: Array<string>, focusBannerUrl: string, status: Status): Promise<CategoryID>;
    deleteCategory(id: CategoryID): Promise<void>;
    deleteWriting(id: WritingID): Promise<void>;
    getActiveChildCategories(parentCategoryId: CategoryID | null): Promise<Array<Category>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(parentCategoryId: CategoryID | null): Promise<Array<Category>>;
    getCategory(id: CategoryID): Promise<Category>;
    getPublishedWritings(): Promise<Array<Writing>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWriting(id: WritingID): Promise<Writing>;
    isCallerAdmin(): Promise<boolean>;
    migrateWritings(): Promise<bigint>;
    publishWriting(id: WritingID): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitWriting(title: string, categoryIds: Array<CategoryID>, content: string, contentWarningList: Array<string>): Promise<WritingID>;
    unpublishWriting(id: WritingID): Promise<void>;
    updateCategory(id: CategoryID, title: string, parentCategoryId: CategoryID | null, supportedLanguages: Array<string>, focusBannerUrl: string, status: Status): Promise<void>;
    updateWriting(id: WritingID, title: string, content: string, categoryIds: Array<CategoryID>, contentWarningList: Array<string>): Promise<void>;
}
