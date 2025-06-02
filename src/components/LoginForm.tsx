
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginFormProps {
  onLogin: (email: string) => void;
  onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Check if user exists in localStorage
    const userData = localStorage.getItem(`dkyc_user_${email}`);
    if (!userData) {
      setError('User not found. Please sign up first.');
      return;
    }

    const user = JSON.parse(userData);
    if (user.password !== password) {
      setError('Invalid password');
      return;
    }

    onLogin(email);
  };

  return (
    <Card className="border-orange-200">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-gray-900">Login to DecentraKYC</CardTitle>
        <CardDescription>
          Access your blockchain-secured KYC dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="border-gray-300 focus:border-orange-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="border-gray-300 focus:border-orange-500"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            Login
          </Button>
          
          <div className="text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <Button variant="link" onClick={onSwitchToSignup} className="text-green-600 p-0">
              Sign up here
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
