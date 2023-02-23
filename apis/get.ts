const baseURL = 'https://unilog.unicommerce.com';
// const baseURL = 'http://localhost:4003';

export async function fetchMetaData() {
  const res = await fetch(`${baseURL}/api/system/meta`);

  if (!res.ok) throw new Error(res.statusText);
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

export async function fetchShipmentDetails(trackingNumber: string) {
  const res = await fetch(
    `${baseURL}/shipper/api/tracking-details?tr_number=${trackingNumber}`,
    {
      headers: {
        'APP-KEY': '#$%^SK&SNLSH*^%SF',
      },
    }
  );

  if (!res.ok) throw new Error(res.statusText);
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

export async function fetchExtendedMetaData() {
  const res = await fetch(`${baseURL}/api/system/get_extended_meta`, 
    {
      headers: {
        'APP-KEY': '#$%^SK&SNLSH*^%SF',
      },
    }
  );

  if (!res.ok) throw new Error(res.statusText);
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}