import { setupServer } from 'msw/node';
import { msalHandlers } from '@/mocks/msalHandlers'

const server = setupServer(...msalHandlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());