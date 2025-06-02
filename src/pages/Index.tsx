
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoginForm from '@/components/LoginForm';
import SignupForm from '@/components/SignupForm';
import KYCDashboard from '@/components/KYCDashboard';
import { Shield, Database, Key } from 'lucide-react';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [activeForm, setActiveForm] = useState<'login' | 'signup' | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('dkyc_current_user');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  const handleLogin = (email: string) => {
    setCurrentUser(email);
    localStorage.setItem('dkyc_current_user', email);
    setActiveForm(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('dkyc_current_user');
    setActiveForm(null);
  };

  if (currentUser) {
    return <KYCDashboard user={currentUser} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-green-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DecentraKYC India</h1>
                <p className="text-sm text-gray-600">Blockchain-Powered Identity Verification</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-4 bg-orange-500 rounded-sm"></div>
              <div className="w-6 h-4 bg-white border border-gray-300 rounded-sm"></div>
              <div className="w-6 h-4 bg-green-600 rounded-sm"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!activeForm && (
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Secure. Decentralized. Trusted.
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              India's first blockchain-based KYC platform. Your identity, your control, 
              verified on an immutable ledger with unique cryptographic hashes.
            </p>
            
            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="border-orange-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Shield className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <CardTitle className="text-green-700">Blockchain Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Your KYC data is secured with cryptographic hashes on blockchain, 
                    ensuring immutability and transparency.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="border-green-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Database className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <CardTitle className="text-orange-600">Decentralized Storage</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    No central authority controls your data. Distributed storage 
                    ensures your privacy and data sovereignty.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="border-orange-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Key className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <CardTitle className="text-green-700">Unique Hash Identity</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Each user gets a unique cryptographic hash key to verify 
                    and access their KYC data instantly.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div className="space-x-4">
              <Button 
                onClick={() => setActiveForm('login')} 
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                Login to Your Account
              </Button>
              <Button 
                onClick={() => setActiveForm('signup')} 
                variant="outline" 
                size="lg"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                Create New Account
              </Button>
            </div>
          </div>
        )}

        {activeForm === 'login' && (
          <div className="max-w-md mx-auto">
            <LoginForm onLogin={handleLogin} onSwitchToSignup={() => setActiveForm('signup')} />
            <div className="text-center mt-4">
              <Button variant="ghost" onClick={() => setActiveForm(null)}>
                ← Back to Home
              </Button>
            </div>
          </div>
        )}

        {activeForm === 'signup' && (
          <div className="max-w-md mx-auto">
            <SignupForm onSignup={handleLogin} onSwitchToLogin={() => setActiveForm('login')} />
            <div className="text-center mt-4">
              <Button variant="ghost" onClick={() => setActiveForm(null)}>
                ← Back to Home
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 DecentraKYC India. Empowering digital identity through blockchain technology.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Built with security, privacy, and transparency at its core.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
