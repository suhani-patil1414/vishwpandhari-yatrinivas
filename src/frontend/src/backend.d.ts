import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Booking {
    id: bigint;
    status: BookingStatus;
    checkIn: string;
    owner: Principal;
    createdAt: bigint;
    guestName: string;
    email: string;
    checkOut: string;
    phone: string;
    roomType: RoomType;
    numberOfGuests: bigint;
}
export interface UserProfile {
    name: string;
}
export enum BookingStatus {
    cancelled = "cancelled",
    pending = "pending",
    confirmed = "confirmed"
}
export enum RoomType {
    deluxe = "deluxe",
    standard = "standard",
    family = "family"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBooking(guestName: string, email: string, phone: string, checkIn: string, checkOut: string, roomType: RoomType, numberOfGuests: bigint): Promise<bigint>;
    deleteBooking(id: bigint): Promise<void>;
    getAllBookings(): Promise<Array<Booking>>;
    getBooking(id: bigint): Promise<Booking | null>;
    getCallerBookings(): Promise<Array<Booking>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBookingStatus(id: bigint, status: BookingStatus): Promise<void>;
}
