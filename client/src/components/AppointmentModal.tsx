import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

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
    doctor: '', appointmentDate: '', message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.email || !formData.phone || !formData.department || !formData.appointmentDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      // Save to Supabase
      const { error } = await supabase.from('appointments').insert({
        user_id: session?.user?.id || null,
        patient_name: formData.patientName,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        doctor: formData.doctor || 'No preference',
        appointment_date: new Date(formData.appointmentDate).toISOString(),
        message: formData.message || null,
        status: 'pending',
      });

      if (error) throw error;

      // Save to Google Sheets
      await fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: formData.patientName,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
          doctor: formData.doctor || 'No preference',
          appointmentDate: formData.appointmentDate,
          message: formData.message || 'None',
        }),
      });

      toast.success('Appointment booked! We will contact you soon.');
      setFormData({ patientName: '', email: '', phone: '', department: '', doctor: '', appointmentDate: '', message: '' });
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book an Appointment</DialogTitle>
          <DialogDescription>Fill in your details to schedule an appointment at Lifeline Hospital</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" placeholder="Your full name" value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" placeholder="your@email.com" value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input id="phone" type="tel" placeholder="+91 98765 43210" value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
              <SelectTrigger id="department"><SelectValue placeholder="Select a department" /></SelectTrigger>
              <SelectContent>
                {departments.map((dept) => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor">Preferred Doctor</Label>
            <Select value={formData.doctor} onValueChange={(value) => setFormData({ ...formData, doctor: value })}>
              <SelectTrigger id="doctor"><SelectValue placeholder="Select a doctor (optional)" /></SelectTrigger>
              <SelectContent>
                {doctors.map((doc) => <SelectItem key={doc} value={doc}>{doc}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Appointment Date *</Label>
            <Input id="date" type="datetime-local" value={formData.appointmentDate}
              onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Additional Message</Label>
            <Textarea id="message" placeholder="Any additional information or concerns..."
              value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={3} />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Booking...' : 'Book Appointment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
