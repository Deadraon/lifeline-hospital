import { useState, useEffect } from 'react';
import { Menu, X, User, ChevronDown, LayoutDashboard, Calendar, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppointmentModal } from './AppointmentModal';
import { AuthModal } from './AuthModal';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from 'wouter';

export default function Header() {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserAndRole = async (sessionUser: any) => {
      setUser(sessionUser);
      if (sessionUser) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', sessionUser.id)
          .single();
        setIsAdmin(data?.role === 'admin');
      } else {
        setIsAdmin(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchUserAndRole(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchUserAndRole(session?.user ?? null);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    window.location.href = '/';
  };

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/#services' },
    { label: 'About', href: '/#about' },
    { label: 'Doctors', href: '/#doctors' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="container py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">L</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-primary">Lifeline</h1>
              <p className="text-xs text-muted-foreground">Hospital</p>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer">
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 pl-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="truncate max-w-[120px]">
                    {user.user_metadata?.name || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {!isAdmin && (
                  <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = '/dashboard'}>
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>My Appointments</span>
                  </DropdownMenuItem>
                )}
                {isAdmin && (
                  <DropdownMenuItem className="cursor-pointer font-medium text-primary focus:text-primary" onClick={() => window.location.href = '/admin'}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
        <div className="md:hidden border-t border-border bg-secondary/50 absolute w-full left-0 bg-background shadow-lg pb-4">
          <nav className="container py-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <a key={item.label} href={item.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2 block"
                onClick={() => setMobileMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            
            {user && (
              <div className="py-2 border-t border-border mt-2 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">My Account</p>
                {!isAdmin && (
                  <span className="flex items-center text-sm font-medium hover:text-primary cursor-pointer" onClick={() => window.location.href = '/dashboard'}>
                    <Calendar className="mr-2 h-4 w-4" /> My Appointments
                  </span>
                )}
                {isAdmin && (
                  <span className="flex items-center text-sm font-medium text-primary hover:text-primary/80 cursor-pointer" onClick={() => window.location.href = '/admin'}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Dashboard
                  </span>
                )}
              </div>
            )}
            
            <div className="flex gap-2 pt-4 border-t border-border mt-2">
              {user ? (
                <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
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
                Book
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
