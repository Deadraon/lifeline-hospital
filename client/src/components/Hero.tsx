import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { AppointmentModal } from './AppointmentModal';

export default function Hero() {
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);

  return (
    <section id="home" className="relative min-h-[600px] md:min-h-[700px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663568751537/DzxtVsShixT2CZkmMbKbDA/hero-banner-HGgyvsDbzbfhX5tTR7TiJz.webp)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container h-full min-h-[600px] md:min-h-[700px] flex flex-col justify-center py-12 md:py-0">
        <div className="max-w-2xl">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-primary-foreground bg-primary/30 px-4 py-2 rounded-full backdrop-blur-sm">
              Welcome to Lifeline
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            Your Health is Our Priority
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-xl leading-relaxed">
            Providing world-class healthcare with compassion and expertise. Our dedicated team is committed to your wellness and recovery.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold group"
              onClick={() => setAppointmentModalOpen(true)}
            >
              Book an Appointment
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-12 pt-12 border-t border-primary-foreground/20">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-primary-foreground">500+</div>
              <p className="text-sm text-primary-foreground/80">Beds Available</p>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-primary-foreground">50+</div>
              <p className="text-sm text-primary-foreground/80">Expert Doctors</p>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-primary-foreground">24/7</div>
              <p className="text-sm text-primary-foreground/80">Emergency Care</p>
            </div>
          </div>
        </div>
      </div>

      {/* Diagonal Divider */}
      <svg
        className="absolute bottom-0 left-0 right-0 translate-y-1/2"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{ width: '100%', height: 'auto' }}
      >
        <path
          d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z"
          fill="currentColor"
          className="text-background"
        />
      </svg>

      <AppointmentModal open={appointmentModalOpen} onOpenChange={setAppointmentModalOpen} />
    </section>
  );
}
