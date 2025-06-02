
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Key, Shield, Database, User } from 'lucide-react';

interface DataVerificationProps {
  userData: any;
}

const DataVerification: React.FC<DataVerificationProps> = ({ userData }) => {
  const [hashInput, setHashInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const verifyHash = () => {
    if (!hashInput.trim()) {
      toast({
        title: "Invalid Hash",
        description: "Please enter a hash key to verify",
        variant: "destructive"
      });
      return;
    }

    // Check if the hash matches the user's stored hash
    if (hashInput === userData.hashKey) {
      setVerificationResult({
        isValid: true,
        userData: userData,
        message: "Hash verification successful! Data integrity confirmed."
      });
      toast({
        title: "Verification Successful",
        description: "Hash matches blockchain record",
      });
    } else {
      setVerificationResult({
        isValid: false,
        message: "Hash verification failed. This hash does not match any records."
      });
      toast({
        title: "Verification Failed",
        description: "Hash does not match blockchain record",
        variant: "destructive"
      });
    }
  };

  const copyHashToClipboard = () => {
    if (userData.hashKey) {
      navigator.clipboard.writeText(userData.hashKey);
      toast({
        title: "Hash Copied",
        description: "Hash key copied to clipboard",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Hash Display */}
      {userData.hashKey && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5 text-green-600" />
              <span>Your Blockchain Hash Key</span>
            </CardTitle>
            <CardDescription>
              This unique hash represents your KYC data on the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="font-mono text-sm break-all mr-4">
                  {userData.hashKey}
                </div>
                <Button onClick={copyHashToClipboard} variant="outline" size="sm">
                  Copy
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>• This hash is generated from your KYC data and timestamp</p>
              <p>• Share this hash to allow others to verify your KYC status</p>
              <p>• The hash cannot be used to retrieve your personal data</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hash Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-orange-500" />
            <span>Verify Hash Key</span>
          </CardTitle>
          <CardDescription>
            Enter a hash key to verify KYC data integrity on blockchain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hashInput">Hash Key</Label>
            <div className="flex space-x-2">
              <Input
                id="hashInput"
                type="text"
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                placeholder="Enter hash key to verify"
                className="font-mono"
              />
              <Button onClick={verifyHash} className="bg-orange-500 hover:bg-orange-600">
                Verify
              </Button>
            </div>
          </div>

          {verificationResult && (
            <div className={`p-4 rounded-lg ${verificationResult.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center space-x-2 mb-2">
                {verificationResult.isValid ? (
                  <Shield className="w-5 h-5 text-green-600" />
                ) : (
                  <Shield className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-medium ${verificationResult.isValid ? 'text-green-800' : 'text-red-800'}`}>
                  {verificationResult.isValid ? 'Verification Successful' : 'Verification Failed'}
                </span>
              </div>
              <p className={`text-sm ${verificationResult.isValid ? 'text-green-700' : 'text-red-700'}`}>
                {verificationResult.message}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* KYC Status Display */}
      {userData.kycData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>KYC Information</span>
            </CardTitle>
            <CardDescription>
              Your verified identity information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">
                  <Badge className={userData.kycStatus === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {userData.kycStatus.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Submitted Date</label>
                <p className="text-gray-900 mt-1">
                  {userData.submittedAt ? new Date(userData.submittedAt).toLocaleDateString() : 'Not submitted'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">PAN Number</label>
                <p className="text-gray-900 mt-1">{userData.kycData.panNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Aadhaar (Masked)</label>
                <p className="text-gray-900 mt-1">
                  ****-****-{userData.kycData.aadhaarNumber.slice(-4)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blockchain Information */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span>Blockchain Information</span>
          </CardTitle>
          <CardDescription>
            Technical details about your data on blockchain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Block Status</label>
              <p className="text-gray-900 mt-1">
                {userData.hashKey ? 'Confirmed' : 'Pending'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Hash Algorithm</label>
              <p className="text-gray-900 mt-1">SHA-256</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Network</label>
              <p className="text-gray-900 mt-1">DecentraKYC Network (Simulated)</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Immutable</label>
              <p className="text-gray-900 mt-1">
                {userData.hashKey ? 'Yes' : 'Not yet recorded'}
              </p>
            </div>
          </div>
          
          {userData.hashKey && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                ✓ Your KYC data has been cryptographically hashed and recorded on blockchain. 
                The original data is not stored on blockchain, ensuring privacy while maintaining verifiability.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataVerification;
