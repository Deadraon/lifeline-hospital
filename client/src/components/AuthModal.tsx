import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

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
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 border-b border-border">
          <button type="button" onClick={() => setMode('login')}
            className={`flex-1 pb-3 text-sm font-medium transition-colors ${
              mode === 'login' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
            }`}>Login</button>
          <button type="button" onClick={() => setMode('signup')}
            className={`flex-1 pb-3 text-sm font-medium transition-colors ${
              mode === 'signup' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
            }`}>Sign Up</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Your full name" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="your@email.com" value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength={6} />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
