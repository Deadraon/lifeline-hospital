import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Brain,
  Bone,
  Eye,
  Stethoscope,
  Pill,
} from 'lucide-react';

const services = [
  {
    icon: Heart,
    title: 'Cardiology',
    description: 'Comprehensive heart care and treatment for all cardiac conditions.',
  },
  {
    icon: Brain,
    title: 'Neurology',
    description: 'Expert neurological care and advanced brain treatments.',
  },
  {
    icon: Bone,
    title: 'Orthopedics',
    description: 'Specialized bone and joint care with modern surgical techniques.',
  },
  {
    icon: Eye,
    title: 'Ophthalmology',
    description: 'Complete eye care services with state-of-the-art equipment.',
  },
  {
    icon: Stethoscope,
    title: 'General Medicine',
    description: 'Comprehensive general medical care and health management.',
  },
  {
    icon: Pill,
    title: 'Pharmacy',
    description: 'Full-service pharmacy with certified pharmacists available 24/7.',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 md:py-28 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <span className="text-sm font-semibold text-primary">OUR SERVICES</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Comprehensive Healthcare Solutions
          </h2>
          <p className="text-lg text-muted-foreground">
            We offer a wide range of medical services delivered by our team of experienced healthcare professionals.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="p-8 hover:shadow-lg transition-all duration-300 hover:border-primary/50 group cursor-pointer"
              >
                {/* Icon Badge */}
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>

                <Button
                  variant="ghost"
                  className="text-primary hover:text-primary hover:bg-primary/5 p-0 h-auto font-semibold"
                >
                  Learn More →
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
