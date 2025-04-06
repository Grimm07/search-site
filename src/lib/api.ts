import { FeedbackPayload, RetrievedContent } from '@/types/search';

export async function listDocuments(
    params: Record<string, any>,
    controller: AbortController
): Promise<{ results: any[] }> {
    const res = await fetch('/api/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        signal: controller.signal,
    });

    if (!res.ok) {
        const message = await res.text();
        throw new Error(message || `${res.status} ${res.statusText}`);
    }

    return await res.json();
}

export async function retrieveDocument(id: string): Promise<RetrievedContent> {
    const res = await fetch(`/api/retrieve/${id}`, { method: 'POST' });

    const contentType = res.headers.get('Content-Type') || '';

    if (contentType.startsWith('image')) {
        // Make sure this Blob is a browser-native one

        return {
            docId: id,
            docId: id,
            contentType: 'image'
        };
    } else {

        return {
            docId: id,
            docId: id,
            contentType: 'text',
        };
    }
}

export async function updateFeedback(payload: FeedbackPayload): Promise<void> {
    const res = await fetch('/api/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const message = await res.text();
        throw new Error(message || `${res.status} ${res.statusText}`);
    }
}
