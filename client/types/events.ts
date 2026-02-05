import { Category } from "./categories";

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    capacity: number;
    status: string;
    categoryId: string;
}

export interface EventExploreProps {
    initialEvents: Event[];
    categories: Category[];
}