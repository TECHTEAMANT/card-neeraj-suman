import { useState, useEffect } from "react";
import ParticleBackground from "@/components/ParticleBackground";
import Header from "@/components/Header";
import ProfileHero from "@/components/ProfileHero";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import EfficiencyAnalyzer from "@/components/EfficiencyAnalyzer";
import ActionButtons, { downloadVCard } from "@/components/ActionButtons";
import Footer from "@/components/Footer";
import { profile } from "@/lib/profile";

interface Lead {
  name: string;
  phone: string;
  timestamp: Date;
}

const Index = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    document.title = `${profile.name} | Digital Business Card`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute(
        "content",
        `Connect with ${profile.name} — ${profile.title}`
      );
    }

    // Auto trigger vCard download if requested via query string or QR scan
    const params = new URLSearchParams(window.location.search);
    if (params.get("vcard") || params.get("save")) {
      setTimeout(() => {
        downloadVCard();
      }, 500);
    }
  }, []);

  const handleLeadCapture = (name: string, phone: string) => {
    const newLead: Lead = {
      name,
      phone,
      timestamp: new Date(),
    };
    setLeads([...leads, newLead]);
    
    // Store in localStorage for persistence
    const storedLeads = JSON.parse(localStorage.getItem("captured_leads") || "[]");
    localStorage.setItem("captured_leads", JSON.stringify([...storedLeads, newLead]));
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Animated Background */}
      <ParticleBackground />
      
      {/* Sticky Header with Icons */}
      <Header />
      
      {/* Main Content */}
      <main className="relative z-10 max-w-md mx-auto">
        {/* Profile Hero Section (Name, Photo, Title, Company, Bio, Office Address, Location & Tags) */}
        <ProfileHero />

        {/* Contact & Social Action Buttons */}
        <ActionButtons />

        {/* Lead Capture Form (Commented Out for now) */}
        {/* <LeadCaptureForm onLeadCapture={handleLeadCapture} /> */}

        {/* Footer Area with Efficiency Analyzer */}
        <div className="mt-8">
          <EfficiencyAnalyzer />
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default Index;
