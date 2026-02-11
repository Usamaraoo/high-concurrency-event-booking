export interface Event {
    id: string;
    name: string;
    user_id: string;
    price_cents: number;
    seats: number;
    available_seats: number;
    created_at: string;
}
