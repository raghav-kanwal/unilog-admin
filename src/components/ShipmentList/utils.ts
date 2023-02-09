export interface ShipmentListColumns {
  shippingProvider: { awb: string; courier: string };
  saleOrder: string;
  customer: { name: string; phone: string };
  shippingPackage: string;
  facility: string;
  trackingStatus: string;
  orderDate: string;
  dispatchDate: string;
  expectedDeliveryDate: string;
  deliveryDate: string;
  attempts: number;
}

export const parseDate = (date: string): string => {
  if (!date) return '-';

  return new Date(date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const mapData = (data: any): ShipmentListColumns[] => {
  if (!data || !data.result || !data.result.tracking_records) return [];

  const mappedData: ShipmentListColumns[] = [];

  data.result.tracking_records.forEach((record: any) => {
    mappedData.push({
      shippingProvider: {
        awb: record.tracking_number,
        courier: record.shipping_source_code,
      },
      saleOrder: record.order_number,
      customer: {
        name: record.customer_name,
        phone: record.customer_phone,
      },
      shippingPackage: record.shipping_package_code,
      facility: record.facility_code,
      trackingStatus: record.current_wismo_display_status,
      orderDate: parseDate(record.order_datetime),
      dispatchDate: parseDate(record.dispatch_datetime),
      expectedDeliveryDate: parseDate(record.expected_delivered_datetime),
      deliveryDate: parseDate(record.delivered_datetime),
      attempts: +record.no_of_items,
    });
  });

  console.log(mappedData);
  return mappedData;
};
