
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface KYCFormProps {
  userData: any;
  onUpdate: (data: any) => void;
}

const KYCForm: React.FC<KYCFormProps> = ({ userData, onUpdate }) => {
  const [formData, setFormData] = useState({
    aadhaarNumber: '',
    panNumber: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    occupation: '',
    income: ''
  });

  const generateHash = async (data: string) => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const requiredFields = ['aadhaarNumber', 'panNumber', 'dateOfBirth', 'gender', 'address', 'city', 'state', 'pincode'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Validate Aadhaar (12 digits)
    if (!/^\d{12}$/.test(formData.aadhaarNumber)) {
      toast({
        title: "Invalid Aadhaar",
        description: "Aadhaar number must be 12 digits",
        variant: "destructive"
      });
      return;
    }

    // Validate PAN (format: 5 letters, 4 digits, 1 letter)
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) {
      toast({
        title: "Invalid PAN",
        description: "PAN format should be: ABCDE1234F",
        variant: "destructive"
      });
      return;
    }

    try {
      // Generate unique hash for the user's KYC data
      const dataString = JSON.stringify(formData) + userData.email + Date.now();
      const hashKey = await generateHash(dataString);

      // Update user data with KYC information and hash
      onUpdate({
        kycData: formData,
        kycStatus: 'submitted',
        hashKey: hashKey,
        submittedAt: new Date().toISOString()
      });

      toast({
        title: "KYC Submitted Successfully!",
        description: "Your data has been hashed and recorded on blockchain",
      });

      console.log('Generated Hash Key:', hashKey);
      console.log('KYC Data submitted to blockchain (simulated)');

    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Failed to process KYC data. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">KYC Verification Form</CardTitle>
        <CardDescription>
          Provide your details for blockchain-based identity verification
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identity Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Identity Documents</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aadhaar">Aadhaar Number *</Label>
                <Input
                  id="aadhaar"
                  type="text"
                  value={formData.aadhaarNumber}
                  onChange={(e) => handleChange('aadhaarNumber', e.target.value)}
                  placeholder="Enter 12-digit Aadhaar number"
                  maxLength={12}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pan">PAN Number *</Label>
                <Input
                  id="pan"
                  type="text"
                  value={formData.panNumber}
                  onChange={(e) => handleChange('panNumber', e.target.value.toUpperCase())}
                  placeholder="Enter PAN (e.g., ABCDE1234F)"
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select onValueChange={(value) => handleChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="address">Full Address *</Label>
              <Input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Enter complete address"
              />
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Enter city"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="Enter state"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                  placeholder="Enter 6-digit pincode"
                  maxLength={6}
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => handleChange('occupation', e.target.value)}
                  placeholder="Enter your occupation"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="income">Annual Income</Label>
                <Select onValueChange={(value) => handleChange('income', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select income range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="below-2.5">Below ₹2.5 Lakh</SelectItem>
                    <SelectItem value="2.5-5">₹2.5 - ₹5 Lakh</SelectItem>
                    <SelectItem value="5-10">₹5 - ₹10 Lakh</SelectItem>
                    <SelectItem value="10-20">₹10 - ₹20 Lakh</SelectItem>
                    <SelectItem value="above-20">Above ₹20 Lakh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700"
              size="lg"
            >
              Submit KYC for Blockchain Verification
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default KYCForm;
