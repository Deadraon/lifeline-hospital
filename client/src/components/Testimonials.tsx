import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Patient',
    content:
      'The care I received at Lifeline Hospital was exceptional. The doctors were knowledgeable and the staff was incredibly supportive throughout my treatment.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
  {
    name: 'Amit Patel',
    role: 'Patient',
    content:
      'I was impressed by the modern facilities and the professional approach of the medical team. Highly recommended for anyone seeking quality healthcare.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  },
  {
    name: 'Neha Gupta',
    role: 'Patient',
    content:
      'The entire experience was smooth from admission to discharge. The doctors explained everything clearly and made me feel comfortable throughout my stay.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="container">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <span className="text-sm font-semibold text-primary">TESTIMONIALS</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            What Our Patients Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Real experiences from patients who have received care at Lifeline Hospital.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-8 hover:shadow-lg transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-accent text-accent"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-border">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
