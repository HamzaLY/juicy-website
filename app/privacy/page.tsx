import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = { title: "Privacy", description: "How this demo site handles your information." };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy">
      <p>This is a demonstration website for a fictional brand. Replace this page with a real privacy policy before launching a real business.</p>
      <h2>What the site stores</h2>
      <p>Your order is saved in your own browser (local storage) so it is still there if you reload the page. It never leaves your device. Clearing your browser data removes it.</p>
      <h2>What the site sends</h2>
      <p>Nothing. The demo checkout does not send your name or order anywhere, and there are no analytics, ads or tracking cookies.</p>
      <h2>Fonts and media</h2>
      <p>Fonts, images and videos are served from this site itself. No third-party requests are made when you browse.</p>
    </LegalPage>
  );
}
