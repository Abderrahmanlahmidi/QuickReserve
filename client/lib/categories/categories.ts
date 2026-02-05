export async function getCategories() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/categories`, {
            cache: 'force-cache'
        });
        if (!response.ok) return [];
        return response.json();
    } catch (e) {
        return [];
    }
}