async function parseResponseBody<TResponse>(response: Response): Promise<TResponse> {
  const rawBody = await response.text();
  return (rawBody ? JSON.parse(rawBody) : undefined) as TResponse;
}

export async function apiGet<TResponse>(url: string): Promise<TResponse> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error(`GET ${url} — ${response.status}`);
  return parseResponseBody<TResponse>(response);
}

export async function apiPost<TResponse>(url: string, body: unknown): Promise<TResponse> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`POST ${url} — ${response.status}`);
  return parseResponseBody<TResponse>(response);
}
