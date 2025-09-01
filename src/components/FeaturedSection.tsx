import { Button } from '@/components/ui/button';

export function FeaturedSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Designed for
              <span className="block text-brand">Every Movement</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Our activewear is crafted with premium, sustainable materials that move with your body. 
              From sunrise yoga to evening runs, each piece is designed to support your active lifestyle 
              while keeping you comfortable and confident.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-foreground">Moisture-wicking technology</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-foreground">Four-way stretch fabric</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-foreground">Sustainable bamboo blend</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-foreground">Thoughtful design details</span>
              </div>
            </div>
            <Button className="btn-hero">
              Learn More About Our Fabric
            </Button>
          </div>

          {/* Image Grid */}
          <div className="order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] bg-gradient-to-br from-rose-100 to-rose-200 rounded-2xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-rose-500/20 to-rose-600/30 flex items-center justify-center">
                    <span className="text-rose-600 font-medium">Comfort</span>
                  </div>
                </div>
                <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-neutral-500/20 to-neutral-600/30 flex items-center justify-center">
                    <span className="text-neutral-600 font-medium">Style</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square bg-gradient-to-br from-rose-200 to-rose-300 rounded-2xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-rose-600/20 to-rose-700/30 flex items-center justify-center">
                    <span className="text-rose-700 font-medium">Quality</span>
                  </div>
                </div>
                <div className="aspect-[3/4] bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-2xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-neutral-600/20 to-neutral-700/30 flex items-center justify-center">
                    <span className="text-neutral-700 font-medium">Performance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}