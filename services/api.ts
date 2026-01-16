
const API_BASE = 'http://127.0.0.1:5000/api';

export async function getArticles() {
    const response = await fetch(`${API_BASE}/articles`);
    if (!response.ok) throw new Error('Failed to fetch articles');
    return response.json();
}

export async function getArticle(id: string) {
    const response = await fetch(`${API_BASE}/articles/${id}`);
    if (!response.ok) throw new Error('Failed to fetch article');
    return response.json();
}

export async function createArticle(article: any) {
    const response = await fetch(`${API_BASE}/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
    });
    if (!response.ok) throw new Error('Failed to create article');
    return response.json();
}

export async function updateArticle(id: string, article: any) {
    const response = await fetch(`${API_BASE}/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
    });
    if (!response.ok) throw new Error('Failed to update article');
    return response.json();
}

export async function deleteArticle(id: string) {
    const response = await fetch(`${API_BASE}/articles/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete article');
    return response.json();
}
