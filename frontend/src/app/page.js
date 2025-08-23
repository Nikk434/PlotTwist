'use client'
import LoginPage from "./auth/login/page";
// import TreatmentEditor from "./components/tiptap";
// import Tiptap from "./components/tiptap";
import MatchSettings from "./components/MatchStart";

export default function Home() {
  const handleStartMatch = (settings) => {
    console.log('Match settings:', settings)
    // Navigate to the actual match/editor
  }

  const handleCancel = () => {
    // Navigate back or close modal
  }

  
  return (
    // <LoginPage />
    <MatchSettings
    onStartMatch={handleStartMatch}
    onCancel={handleCancel}
  />
    // ,    
    // <TreatmentEditor/>
  );
}