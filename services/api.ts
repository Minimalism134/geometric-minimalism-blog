
const API_BASE = '/api';

export async function getArticles() {
    const response = await fetch(`${API_BASE}/articles`);
    if (!response.ok) throw new Error('获取文章列表失败');
    return response.json();
}

export async function getArticle(id: string) {
    const response = await fetch(`${API_BASE}/articles/${id}`);
    if (!response.ok) throw new Error('获取文章详情失败');
    return response.json();
}

export async function createArticle(article: any) {
    const response = await fetch(`${API_BASE}/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
    });
    if (!response.ok) throw new Error('创建文章失败');
    return response.json();
}

export async function updateArticle(id: string, article: any) {
    const response = await fetch(`${API_BASE}/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
    });
    if (!response.ok) throw new Error('更新文章失败');
    return response.json();
}

export async function deleteArticle(id: string) {
    const response = await fetch(`${API_BASE}/articles/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('删除文章失败');
    return response.json();
}

export async function getSeries() {
    const response = await fetch(`${API_BASE}/series`);
    if (!response.ok) throw new Error('获取系列列表失败');
    return response.json();
}

export async function createSeries(series: any) {
    const response = await fetch(`${API_BASE}/series`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(series),
    });
    if (!response.ok) throw new Error('创建系列失败');
    return response.json();
}

export async function updateSeries(id: string, series: any) {
    const response = await fetch(`${API_BASE}/series/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(series),
    });
    if (!response.ok) throw new Error('更新系列失败');
    return response.json();
}

export async function deleteSeries(id: string) {
    const response = await fetch(`${API_BASE}/series/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('删除系列失败');
    return response.json();
}
