import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { LogOut, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { AppointmentModal } from '@/components/AppointmentModal';
import { Toaster } from '@/components/ui/sonner';

type Appointment = {
  id: string;
  patient_name: string;
  email: string;
  phone: string;
  department: string;
  doctor: string;
  appointment_date: string;
  message: string;
  status: string;
  created_at: string;
};

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        window.location.href = '/';
        return;
      }
      setUser(session.user);
      fetchAppointments(session.user.id);
    });
  }, []);

  const fetchAppointments = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .order('appointment_date', { ascending: true });
    if (error) toast.error('Failed to load appointments');
    else setAppointments(data || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'confirmed') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === 'cancelled') return <XCircle className="w-4 h-4 text-red-500" />;
    return <Clock className="w-4 h-4 text-yellow-500" />;
  };

  const getStatusColor = (status: string) => {
    if (status === 'confirmed') return 'bg-green-100 text-green-800';
    if (status === 'cancelled') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold">L</span>
            </div>
            <div>
              <h1 className="font-bold text-primary">Lifeline Hospital</h1>
              <p className="text-xs text-gray-500">My Appointments</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">
              {user?.user_metadata?.name || user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border text-center">
            <p className="text-2xl font-bold text-primary">{appointments.length}</p>
            <p className="text-sm text-gray-500">Total</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border text-center">
            <p className="text-2xl font-bold text-green-600">
              {appointments.filter(a => a.status === 'confirmed').length}
            </p>
            <p className="text-sm text-gray-500">Confirmed</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {appointments.filter(a => a.status === 'pending').length}
            </p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
        </div>

        {/* Book New Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">My Appointments</h2>
          <Button onClick={() => setAppointmentModalOpen(true)} className="bg-primary hover:bg-primary/90">
            <Calendar className="w-4 h-4 mr-2" /> Book New
          </Button>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border shadow-sm">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No appointments yet</h3>
            <p className="text-gray-500 mb-6">Book your first appointment with us!</p>
            <Button onClick={() => setAppointmentModalOpen(true)} className="bg-primary hover:bg-primary/90">
              Book Appointment
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt.id} className="bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{apt.department}</h3>
                    <p className="text-sm text-gray-500">{apt.doctor || 'No doctor assigned'}</p>
                  </div>
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                    {getStatusIcon(apt.status)}
                    {apt.status}
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-primary" />
                    {new Date(apt.appointment_date).toLocaleDateString('en-IN', {
                      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-primary" />
                    {new Date(apt.appointment_date).toLocaleTimeString('en-IN', {
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </div>
                {apt.message && (
                  <p className="mt-2 text-sm text-gray-500 italic">"{apt.message}"</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <AppointmentModal 
        open={appointmentModalOpen} 
        onOpenChange={(open) => {
          setAppointmentModalOpen(open);
          if (!open && user) fetchAppointments(user.id);
        }} 
      />
    </div>
  );
}
