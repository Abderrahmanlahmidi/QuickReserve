export async function getEvents() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/events`, {
            cache: 'no-store'
        });
        if (!response.ok) return [];
        return response.json();
    } catch {
        return [];
    }
}

export async function getEventById(id: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/events/${id}`, {
            cache: 'no-store'
        });
        if (!response.ok) return null;
        return response.json();
    } catch {
        return null;
    }
}
