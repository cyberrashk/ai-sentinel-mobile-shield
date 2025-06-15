
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { MobileNavigation } from '../components/MobileNavigation';
import { HomeTab } from '../components/HomeTab';
import { FeaturesTab } from '../components/FeaturesTab';
import { VPNTab } from '../components/VPNTab';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab />;
      case 'features':
        return <FeaturesTab />;
      case 'vpn':
        return <VPNTab />;
      default:
        return <HomeTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Header />
      <main className="container mx-auto px-4 py-8 pb-24">
        {renderActiveTab()}
      </main>
      <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
