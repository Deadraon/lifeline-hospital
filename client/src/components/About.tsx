import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function About() {
  const highlights = [
    'State-of-the-art medical facilities',
    'Experienced and compassionate doctors',
    'Advanced diagnostic equipment',
    '24/7 Emergency services',
    'Patient-centric care approach',
    'Affordable healthcare solutions',
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-secondary/30">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-2xl" />
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663568751537/DzxtVsShixT2CZkmMbKbDA/about-section-ZjePVKbVdgAg9xKAMjp9Th.webp"
              alt="Lifeline Hospital Facility"
              className="relative rounded-2xl shadow-xl w-full h-auto object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <span className="text-sm font-semibold text-primary">ABOUT US</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
              Excellence in Healthcare Delivery
            </h2>

            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Lifeline Hospital is committed to providing exceptional healthcare services with a focus on patient comfort, safety, and recovery. Our modern facilities and dedicated team of medical professionals ensure you receive the best possible care.
            </p>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              With over two decades of experience in healthcare, we have established ourselves as a trusted name in medical excellence. We combine cutting-edge technology with compassionate care to deliver outstanding results.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground font-medium">{highlight}</span>
                </div>
              ))}
            </div>

            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Learn More About Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
