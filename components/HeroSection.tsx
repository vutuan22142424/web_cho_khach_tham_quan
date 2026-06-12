'use client';

import Image from 'next/image';

interface HeroSectionProps {
  title: string;
  description: string;
  location: string;
  address: string;
}

export function HeroSection({ title, description, location, address }: HeroSectionProps) {
  return (
    <section className="relative pt-8 sm:pt-12 pb-12 sm:pb-16 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left content */}
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-pretty leading-tight">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {title}
                </span>
              </h1>
              <p className="text-base sm:text-lg text-foreground/80 text-pretty">
                {description}
              </p>
            </div>

            {/* Location info */}
            <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-border">
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-foreground/60 uppercase tracking-wide">Địa Điểm</h3>
                <p className="text-sm sm:text-base font-medium text-foreground">{location}</p>
                <p className="text-xs sm:text-sm text-foreground/70">{address}</p>
              </div>
            </div>
          </div>

          {/* Right image */}
          <div className="relative h-64 sm:h-80 lg:h-96 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl border border-border order-1 lg:order-2">
            <Image
              src="/images/exhibition.jpg"
              alt={title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
