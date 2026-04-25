'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, type UserRole } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, Lock, Mail, Shield } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock user credentials for each role
  const demoAccounts = {
    admin: {
      email: 'admin@evidenx.com',
      password: 'admin123',
      name: 'Administrator',
      description: 'Full access to manage evidence, users, and system settings',
    },
    investigator: {
      email: 'investigator@evidenx.com',
      password: 'inv123',
      name: 'John Investigator',
      description: 'Access to investigate cases and manage evidence',
    },
    user: {
      email: 'user@evidenx.com',
      password: 'user123',
      name: 'Jane User',
      description: 'View-only access to evidence and case information',
    },
  };

  const handleQuickLogin = async (role: UserRole) => {
    const account = demoAccounts[role];
    setSelectedRole(role);
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      setError('Please select a user role');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(email, password, selectedRole);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left side - Branding */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-8 h-8 text-blue-500" />
                <h1 className="text-3xl font-bold">EvidenX</h1>
              </div>
              <p className="text-gray-400">Forensic Evidence Management System</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Select Your Role</h2>
              <div className="space-y-2">
                {Object.entries(demoAccounts).map(([role, account]) => (
                  <button
                    key={role}
                    onClick={() => handleQuickLogin(role as UserRole)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedRole === role
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 bg-gray-900/30 hover:border-gray-600'
                    }`}
                  >
                    <div className="font-semibold capitalize">{role}</div>
                    <div className="text-sm text-gray-400">{account.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-500">
                Demo credentials are auto-filled. Click any role above to select.
              </p>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="flex items-center justify-center">
            <Card className="w-full border-gray-700 bg-gray-900/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  {selectedRole
                    ? `Signing in as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`
                    : 'Select a role to continue'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg flex items-gap-2 gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-gray-800/50 border-gray-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-gray-800/50 border-gray-700"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={!selectedRole || isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Demo accounts only. No real authentication.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer link back to landing */}
        <div className="text-center mt-8">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-300 flex items-center gap-1 justify-center">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}
