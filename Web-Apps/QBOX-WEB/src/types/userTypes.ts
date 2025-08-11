import { ReactNode } from "react";

export interface User {
    id: string;
    name: string;
    email: string;
    profilePicture: string;
}


export interface Order {
    id: string;
    customer: string;
    items: string[];
    total: number;
    status: string;
    statusColor: string;
}
