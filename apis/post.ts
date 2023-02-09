const baseURL = 'http://localhost:4003';

export async function fetchShipmentList(
  searchText: string,
  from: string,
  to: string
) {
  const res = await fetch(`${baseURL}/shipper/api/tracking-list`, {
    method: 'POST',
    headers: {
      'APP-KEY': '#$%^SK&SNLSH*^%SF',
    },
    body: JSON.stringify({
      search_text: searchText,
      from,
      to,
    }),
  });

  if (!res.ok) throw new Error(res.statusText);
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}
