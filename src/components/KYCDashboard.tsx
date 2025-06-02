
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import KYCForm from './KYCForm';
import DataVerification from './DataVerification';
import { Shield, User, Key, Database } from 'lucide-react';

interface KYCDashboardProps {
  user: string;
  onLogout: () => void;
}

interface UserData {
  email: string;
  fullName: string;
  phone: string;
  kycStatus: 'pending' | 'submitted' | 'verified';
  hashKey: string | null;
  createdAt?: string;
  kycData?: any;
}

const KYCDashboard: React.FC<KYCDashboardProps> = ({ user, onLogout }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const storedUserData = localStorage.getItem(`dkyc_user_${user}`);
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, [user]);

  const updateUserData = (newData: Partial<UserData>) => {
    if (userData) {
      const updatedData = { ...userData, ...newData };
      setUserData(updatedData);
      localStorage.setItem(`dkyc_user_${user}`, JSON.stringify(updatedData));
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
                <h1 className="text-xl font-bold text-gray-900">DecentraKYC Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome, {userData.fullName}</p>
              </div>
            </div>
            <Button onClick={onLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="kyc">KYC Form</TabsTrigger>
            <TabsTrigger value="verify">Verify Data</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Status Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-orange-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">KYC Status</CardTitle>
                  <User className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <Badge className={getStatusColor(userData.kycStatus)}>
                    {userData.kycStatus.toUpperCase()}
                  </Badge>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Hash Key</CardTitle>
                  <Key className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  {userData.hashKey ? (
                    <div className="text-xs font-mono text-gray-600 break-all">
                      {userData.hashKey.substring(0, 16)}...
                    </div>
                  ) : (
                    <span className="text-gray-500">Not generated</span>
                  )}
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blockchain Status</CardTitle>
                  <Database className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <Badge className={userData.hashKey ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {userData.hashKey ? 'Recorded' : 'Pending'}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your basic account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-gray-900">{userData.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{userData.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{userData.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Account Created</label>
                    <p className="text-gray-900">{new Date(userData.createdAt || '').toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
                <CardDescription>Complete your KYC verification</CardDescription>
              </CardHeader>
              <CardContent>
                {userData.kycStatus === 'pending' && (
                  <div className="space-y-2">
                    <p className="text-gray-700">Complete your KYC form to get started with blockchain verification.</p>
                    <Button onClick={() => setActiveTab('kyc')} className="bg-orange-500 hover:bg-orange-600">
                      Start KYC Process
                    </Button>
                  </div>
                )}
                {userData.kycStatus === 'submitted' && (
                  <div className="space-y-2">
                    <p className="text-green-700">✓ KYC submitted! Your data has been hashed and recorded on blockchain.</p>
                    <Button onClick={() => setActiveTab('verify')} className="bg-green-600 hover:bg-green-700">
                      Verify Your Data
                    </Button>
                  </div>
                )}
                {userData.kycStatus === 'verified' && (
                  <div className="space-y-2">
                    <p className="text-green-700">✓ KYC verified! Your identity is secured on blockchain.</p>
                    <Button onClick={() => setActiveTab('verify')} className="bg-green-600 hover:bg-green-700">
                      View Verification Details
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kyc">
            <KYCForm userData={userData} onUpdate={updateUserData} />
          </TabsContent>

          <TabsContent value="verify">
            <DataVerification userData={userData} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default KYCDashboard;
