import type { Metadata } from "next";
import { CheckoutView } from "@/components/cart/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Review your order. This is a demo store: no payment is taken and no order is sent.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
