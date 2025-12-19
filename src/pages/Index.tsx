import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ClassesSection from "@/components/ClassesSection";
import About from "@/components/About";
import Leaderboard from "@/components/Leaderboard";
import Rewards from "@/components/Rewards";
import ProfilePreview from "@/components/ProfilePreview";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import type { UserRole } from "@/data/mockData";

const Index = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>("student");

  return (
    <div className="min-h-screen">
      <Header currentRole={currentRole} onRoleChange={setCurrentRole} />
      <main>
        <Hero />
        <About />
        <ClassesSection />
        <Leaderboard />
        <Rewards />
        <ProfilePreview />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
