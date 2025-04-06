import {http, HttpResponse} from 'msw';

export const msalHandlers = [
  http.post('https://login.microsoftonline.com/*/oauth2/v2.0/token', () => {
    return HttpResponse.json({ access_token: 'mock-token', expires_in: 3600 });
  })
];
