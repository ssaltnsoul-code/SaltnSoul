import { Button } from '@/components/ui/button';
import heroVideoPoster from '@/assets/hero-video-poster.jpg';

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={heroVideoPoster}
          className="w-full h-full object-cover"
        >
          {/* Placeholder for actual video - using poster image as fallback */}
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
        <div className="animate-fade-up">
          <h1 className="text-hero mb-6">
            Move with
            <span className="block text-brand">Purpose</span>
          </h1>
          <p className="text-subhero mb-8 max-w-2xl mx-auto">
            Discover premium activewear designed for the modern woman. 
            Sustainable, comfortable, and effortlessly beautiful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-hero">
              Shop Collection
            </Button>
            <Button variant="outline" className="btn-ghost">
              Watch Story
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce">
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2">Scroll to explore</span>
          <div className="w-px h-12 bg-white/30"></div>
        </div>
      </div>
    </section>
  );
}