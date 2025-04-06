// UserPage.tsx
import { use } from 'react';
import { fetchUser } from '@/api/APIHandler';

export function UserPage({ userId }: { userId: string }) {
    const user = use(fetchUser(userId)); // React 19 automatically waits
    return <div>{user.name}</div>;
}
