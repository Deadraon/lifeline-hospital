import { Card } from '@/components/ui/card';
import { Mail, Phone } from 'lucide-react';

const doctors = [
  {
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    experience: '15+ years',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  },
  {
    name: 'Dr. Rajesh Kumar',
    specialty: 'Neurologist',
    experience: '12+ years',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  },
  {
    name: 'Dr. Emily Chen',
    specialty: 'Orthopedic Surgeon',
    experience: '10+ years',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  },
  {
    name: 'Dr. Michael Brown',
    specialty: 'General Physician',
    experience: '18+ years',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
  },
];

export default function Doctors() {
  return (
    <section id="doctors" className="py-20 md:py-28 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <span className="text-sm font-semibold text-primary">OUR TEAM</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Meet Our Expert Doctors
          </h2>
          <p className="text-lg text-muted-foreground">
            Our team of highly qualified and experienced doctors is dedicated to providing you with the best medical care.
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              {/* Doctor Image */}
              <div className="relative h-48 overflow-hidden bg-secondary">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Doctor Info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {doctor.name}
                </h3>
                <p className="text-sm font-medium text-primary mb-2">
                  {doctor.specialty}
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  {doctor.experience} experience
                </p>

                {/* Contact Icons */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
