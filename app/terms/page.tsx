import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = { title: "Terms", description: "Terms for this demo site." };

export default function TermsPage() {
  return (
    <LegalPage title="Terms">
      <p>JUICY is a fictional brand. This website is a design and engineering demo, and nothing on it is an offer to sell.</p>
      <h2>Prices and offers</h2>
      <p>All prices, bundles and seasonal offers are demonstration content. No payments are processed and no orders are fulfilled.</p>
      <h2>Reviews</h2>
      <p>Testimonials on this site are samples written for the demo, not real customer reviews.</p>
      <h2>Imagery</h2>
      <p>Illustrations are original to this site. Any photographic imagery is AI generated with openly licensed models, and is labeled as such where it appears.</p>
    </LegalPage>
  );
}
