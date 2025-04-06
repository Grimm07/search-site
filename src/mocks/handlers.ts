import { http, HttpResponse } from 'msw';
import {SearchRequestPayload} from "@/types/search";

export const handlers = [
    // 🔍 Mock /api/list (search) as POST
    http.post('/api/list', async ({ request }) => {
        try {
            const body = (await request.json()) as SearchRequestPayload;

            const key =
                body.key ?? body.uuid ?? body.email ?? body.date ?? body.numericId;

            if (!key) {
                return HttpResponse.json(
                    { error: 'Missing search key' },
                    { status: 400 }
                );
            }

            return HttpResponse.json({
                results: [
                    {
                        id: 'abc-123',
                        title: 'Test Document',
                        thumbnailUrl: '/mock/thumb.png',
                        fields: {
                            Name: 'Jane Doe',
                            Email: 'jane@example.com',
                            Status: 'Active',
                        },
                    },
                ],
            });
        } catch (e) {
            return HttpResponse.json(
                { error: 'Invalid or missing JSON body' },
                { status: 400 }
            );
        }
    }),


    // 📄 Mock /api/retrieve/:id as POST
    http.post('/api/retrieve', async ({ request }) => {
        const body = (await request.json()) as SearchRequestPayload;
        const { id } = body;

        return new HttpResponse(`This is mock content for document ID: ${id}`, {
            headers: { 'Content-Type': 'text/plain' },
        });
    }),

    // ✅ Mock feedback submission
    http.post('/api/update', async ({ request }) => {
        const payload = await request.json();
        console.log('Mock feedback received:', payload);
        return HttpResponse.json({ success: true });
    }),
    http.post('/api/list', async ({ request }) => {
        const body = (await request.json()) as SearchRequestPayload;
        const key = body.key;

        return new Response(
            JSON.stringify({
                results: [
                    {
                        id: 'doc-001',
                        title: `Result for ${key}`,
                        thumbnailUrl: '/mock/thumb.png',
                        fields: {
                            Name: 'John Doe',
                            Email: 'john@example.com',
                            Date: '2024-01-15',
                        },
                    },
                ],
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }),
    // Update handler
    http.post('/api/update', async () => {
        return new Response(null, { status: 200 });
    }),
    http.post('/api/retrieve', async ({  }) => {
        const imageBlob = await fetch('/mock/thumb.png').then((r) => r.blob());

        return new Response(imageBlob, {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
            },
        });
    }), http.post('/api/retrieve-pdf', async ({ }) => {
        const pdfBlob = await fetch('/mock/sample.pdf').then((r) => r.blob());

        return new Response(pdfBlob, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
            },
        });
    }),



// const mockFile = new File(['fake-image-bytes'], 'mock-uuid.png', {
//     type: 'image/png',
// }),

];
