import { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppointmentModal } from './AppointmentModal';
import { AuthModal } from './AuthModal';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
  };

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Doctors', href: '#doctors' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="container py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">L</span>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-primary">Lifeline</h1>
            <p className="text-xs text-muted-foreground">Hospital</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a key={item.label} href={item.href}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{user.user_metadata?.name || user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setAuthModalOpen(true)}>
              Login / Sign Up
            </Button>
          )}
          <Button size="sm" className="bg-accent hover:bg-accent/90"
            onClick={() => setAppointmentModalOpen(true)}>
            Book Appointment
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors">
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-secondary/50">
          <nav className="container py-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <a key={item.label} href={item.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <div className="flex gap-2 pt-2 border-t border-border">
              {user ? (
                <Button variant="outline" size="sm" className="flex-1" onClick={handleLogout}>
                  Logout
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="flex-1"
                  onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }}>
                  Login / Sign Up
                </Button>
              )}
              <Button size="sm" className="flex-1 bg-accent hover:bg-accent/90"
                onClick={() => { setAppointmentModalOpen(true); setMobileMenuOpen(false); }}>
                Book Appointment
              </Button>
            </div>
          </nav>
        </div>
      )}

      <AppointmentModal open={appointmentModalOpen} onOpenChange={setAppointmentModalOpen} />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} onSuccess={() => {}} />
    </header>
  );
}
