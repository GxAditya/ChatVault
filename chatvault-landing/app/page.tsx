import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import InstallationGuide from "@/components/landing/InstallationGuide";
import SupportedPlatforms from "@/components/landing/SupportedPlatforms";
import Features from "@/components/landing/Features";
import UniqueSection1 from "@/components/landing/UniqueSection1";
import UniqueSection2 from "@/components/landing/UniqueSection2";
import UniqueSection3 from "@/components/landing/UniqueSection3";
import UseCases from "@/components/landing/UseCases";
import DemoSection from "@/components/landing/DemoSection";
import { CTA, Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030304] text-white selection:bg-purple-500/30">
      <section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "ChatVault",
              "applicationCategory": "ProductivityApplication",
              "operatingSystem": "Chrome, Firefox",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "A browser extension to export AI chat conversations to PDF locally.",
              "featureList": [
                "Export ChatGPT to PDF",
                "Export Claude to PDF",
                "Export Gemini to PDF",
                "Dark mode support",
                "Local processing"
              ]
            })
          }}
        />
      </section>
      <Navbar />
      <Hero />
      <InstallationGuide />
      <SupportedPlatforms />
      <Features />
      <UniqueSection1 />
      <UniqueSection2 />
      <UniqueSection3 />
      <DemoSection />
      <UseCases />
      <CTA />
      <Footer />
    </main>
  );
}
