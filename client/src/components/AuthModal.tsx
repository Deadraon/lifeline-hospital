import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, User, Activity } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AuthModal({ open, onOpenChange, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { name: formData.name } },
        });
        if (error) throw error;
        toast.success('Account created successfully!');
        onSuccess();
        onOpenChange(false);
        window.location.href = '/dashboard';
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        toast.success('Welcome back!');
        onSuccess();
        onOpenChange(false);
        // Check if admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
        if (profile?.role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/dashboard';
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
        <div className="bg-primary/5 p-6 sm:p-8 flex flex-col items-center justify-center border-b border-primary/10">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 mb-4">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900 mb-1">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            {mode === 'login' 
              ? 'Enter your credentials to access your account' 
              : 'Join Lifeline Hospital to manage your appointments'}
          </DialogDescription>
        </div>

        <div className="p-6 sm:p-8 pt-6 bg-white">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
            <button type="button" onClick={() => setMode('login')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                mode === 'login' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}>Login</button>
            <button type="button" onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                mode === 'signup' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}>Sign Up</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2 relative">
                <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input id="name" placeholder="John Doe" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    className="pl-9 bg-gray-50 border-gray-200 focus:bg-white focus:ring-primary/20" required />
                </div>
              </div>
            )}
            <div className="space-y-2 relative">
              <Label htmlFor="email" className="text-gray-700">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input id="email" type="email" placeholder="hello@example.com" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  className="pl-9 bg-gray-50 border-gray-200 focus:bg-white focus:ring-primary/20" required />
              </div>
            </div>
            <div className="space-y-2 relative">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                {mode === 'login' && (
                  <a href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</a>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input id="password" type="password" placeholder="••••••••" value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                  className="pl-9 bg-gray-50 border-gray-200 focus:bg-white focus:ring-primary/20" required minLength={6} />
              </div>
            </div>
            
            <Button type="submit" disabled={isLoading} className="w-full mt-6 h-11 text-base shadow-md hover:shadow-lg transition-all bg-primary hover:bg-primary/90">
              {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
          
          <p className="mt-6 text-center text-xs text-gray-400">
            By continuing, you agree to our <a href="#" className="underline hover:text-gray-600">Terms of Service</a> and <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
