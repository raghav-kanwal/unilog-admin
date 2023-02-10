import { ShipmentListColumns } from '../ShipmentList/utils';

export interface ShipmentDetailsColumns extends ShipmentListColumns {
  customer: { name: string; phone: string; email: string };
  trackingNumber: string;
  shippingType: string;
  paymentMethod: string;
  totalPrice: string;
  deliveryAddress: string;
  customerFeedback: string;
  lineItems: any[];
  trackingEvents: any[];
}
