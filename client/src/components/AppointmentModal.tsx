import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, User, Mail, Phone, Stethoscope, Building2, MessageSquare } from 'lucide-react';

interface AppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const departments = ['Cardiology','Neurology','Orthopedics','Ophthalmology','General Medicine','Pharmacy'];
const doctors = ['Dr. Sarah Johnson','Dr. Rajesh Kumar','Dr. Emily Chen','Dr. Michael Brown'];

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyZTYyaJPneRiXtXxBmYUDc7So12xuQU3ZXx8rmNXftCzPvdyW7cGO4PBx_PwG-LgHM9w/exec';

export function AppointmentModal({ open, onOpenChange }: AppointmentModalProps) {
  const [formData, setFormData] = useState({
    patientName: '', email: '', phone: '', department: '',
    doctor: '', appointmentDate: '', appointmentTime: '', message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.email || !formData.phone || !formData.department || !formData.appointmentDate || !formData.appointmentTime) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const dateTimeString = `${formData.appointmentDate}T${formData.appointmentTime}`;
      const isoDateString = new Date(dateTimeString).toISOString();

      // Save to Supabase
      const { error } = await supabase.from('appointments').insert({
        user_id: session?.user?.id || null,
        patient_name: formData.patientName,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        doctor: formData.doctor || 'No preference',
        appointment_date: isoDateString,
        message: formData.message || null,
        status: 'pending',
      });

      if (error) throw error;

      // Save to Google Sheets via GET request with URL params
      const params = new URLSearchParams({
        patientName: formData.patientName,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        doctor: formData.doctor || 'No preference',
        appointmentDate: dateTimeString,
        message: formData.message || 'None',
      });
      await fetch(`${SHEET_URL}?${params.toString()}`, {
        method: 'GET',
        mode: 'no-cors',
      });

      toast.success('Appointment booked! We will contact you soon.');
      setFormData({ patientName: '', email: '', phone: '', department: '', doctor: '', appointmentDate: '', appointmentTime: '', message: '' });
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-0 shadow-2xl rounded-2xl max-h-[90vh] flex flex-col">
        <div className="bg-primary/5 p-6 flex flex-col items-center justify-center border-b border-primary/10 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 mb-3">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            Book an Appointment
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500 text-sm">
            Fill in your details to schedule a visit to Lifeline Hospital
          </DialogDescription>
        </div>
        
        <div className="p-6 bg-white overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Personal Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 relative">
                <Label htmlFor="name" className="text-gray-700 font-medium">Full Name <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input id="name" placeholder="John Doe" value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })} 
                    className="pl-9 bg-gray-50 border-gray-200 focus:bg-white focus:ring-primary/20" required />
                </div>
              </div>
              
              <div className="space-y-2 relative">
                <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input id="phone" type="tel" placeholder="+91 98765 43210" value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                    className="pl-9 bg-gray-50 border-gray-200 focus:bg-white focus:ring-primary/20" required />
                </div>
              </div>
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email Address <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input id="email" type="email" placeholder="your@email.com" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  className="pl-9 bg-gray-50 border-gray-200 focus:bg-white focus:ring-primary/20" required />
              </div>
            </div>

            {/* Department & Doctor Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 relative">
                <Label htmlFor="department" className="text-gray-700 font-medium">Department <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
                  <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                    <SelectTrigger id="department" className="bg-gray-50 border-gray-200 focus:bg-white focus:ring-primary/20 pl-9">
                      <SelectValue placeholder="Select dept" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="doctor" className="text-gray-700 font-medium">Preferred Doctor</Label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
                  <Select value={formData.doctor} onValueChange={(value) => setFormData({ ...formData, doctor: value })}>
                    <SelectTrigger id="doctor" className="bg-gray-50 border-gray-200 focus:bg-white focus:ring-primary/20 pl-9">
                      <SelectValue placeholder="Any doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doc) => <SelectItem key={doc} value={doc}>{doc}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              <div className="space-y-2 relative">
                <Label htmlFor="date" className="text-gray-700 font-medium">Date <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input id="date" type="date" value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })} 
                    className="pl-9 bg-white border-gray-200 focus:ring-primary/20" required />
                </div>
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="time" className="text-gray-700 font-medium">Time <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input id="time" type="time" value={formData.appointmentTime}
                    onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })} 
                    className="pl-9 bg-white border-gray-200 focus:ring-primary/20" required />
                </div>
              </div>
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="message" className="text-gray-700 font-medium">Additional Message</Label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Textarea id="message" placeholder="Any specific symptoms or requests..."
                  value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                  rows={3} className="pl-9 bg-gray-50 border-gray-200 focus:bg-white focus:ring-primary/20 resize-none" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 h-11 border-gray-200">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-[2] h-11 shadow-md hover:shadow-lg transition-all bg-primary hover:bg-primary/90">
                {isLoading ? 'Processing...' : 'Confirm Booking'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
