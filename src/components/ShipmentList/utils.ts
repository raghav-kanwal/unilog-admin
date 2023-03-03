export interface ShipmentListColumns {
  shippingProvider: { awb: string; courier: string };
  orderDetails: {
    saleOrder: string, 
    shippingPackage: string,
  }
  customer: { name: string; phone: string };
  facility: string;
  trackingStatus: string;
  orderDate: string;
  dispatchDate: string;
  expectedDeliveryDate: string;
  deliveryDate: string;
  attempts: number;
  courierStatus: string;
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
      orderDetails: {
        saleOrder: record.order_number,
        shippingPackage: record.shipping_package_code
      },
      customer: {
        name: record.customer_name,
        phone: record.customer_phone,
      },
      facility: record.facility_code,
      trackingStatus: record.current_wismo_display_status,
      orderDate: parseDate(record.order_datetime),
      dispatchDate: parseDate(record.dispatch_datetime),
      expectedDeliveryDate: parseDate(record.expected_delivered_datetime),
      deliveryDate: parseDate(record.delivered_datetime),
      attempts: +record.no_of_items,
      courierStatus: record.courier_status || '-'
    });
  });

  return mappedData;
};
