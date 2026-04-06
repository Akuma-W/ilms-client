import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';
import { Button } from '../ui/button';
import Link from 'next/link';

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  href: string;
}

interface BannerCarouselProps {
  banners: Banner[];
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  return (
    <Carousel opts={{ loop: true }} className="relative group">
      <CarouselContent>
        {banners.map((banner) => (
          <CarouselItem key={banner.id}>
            <BannerSlide banner={banner} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="cursor-pointer left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300" />
      <CarouselNext className="cursor-pointer right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300" />
    </Carousel>
  );
}

function BannerSlide({ banner }: { banner: Banner }) {
  return (
    <div className="relative h-125 w-full">
      <Image
        src={banner.image}
        alt={banner.title}
        fill
        className="object-cover"
        priority={banner.id === '1'}
      />

      {/* Overlay */}
      {/* <div className="absolute inset-0 bg-black/40 pointer-events-none" /> */}
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {banner.title}
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          {banner.subtitle}
        </p>
        <Link href={banner.href}>
          <Button
            size="lg"
            className="bg-galaxy hover:scale-105 text-white px-8 animate-in fade-in slide-in-from-bottom-8"
          >
            {banner.cta}
          </Button>
        </Link>
      </div>
    </div>
  );
}
