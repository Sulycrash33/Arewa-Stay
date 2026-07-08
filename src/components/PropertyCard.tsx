import Link from 'next/link';
import Image from 'next/image';
import type { Listing } from '@/lib/types';
import { MapPin, Star } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';

const currencySymbol = (currency: 'NGN' | 'XOF') => (currency === 'NGN' ? '₦' : 'CFA');

const PropertyCard = ({ property }: { property: Listing }) => {
  const images = property.images?.length ? property.images : ['/placeholder-listing.jpg'];
  const rating = property.avg_rating ?? 0;
  const reviewCount = property.review_count ?? 0;

  const filterChips = [
    property.women_only && 'Women-only',
    property.family_only && 'Family-only',
    property.no_alcohol && 'No alcohol',
    property.has_zaure && 'Zaure reception',
    property.has_247_solar && '24/7 solar',
    property.has_borehole && 'Borehole water',
  ].filter(Boolean) as string[];

  return (
    <div className="group flex flex-col h-full overflow-hidden rounded-tubali bg-surface-container-lowest tubali-border tubali-shadow transition-all duration-300 hover:shadow-tubali hover:-translate-y-1">
      <div className="relative">
        <Carousel className="w-full overflow-hidden">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="aspect-[4/3] relative">
                  <Image
                    src={image}
                    alt={`${property.title} photo ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 1 && (
            <>
              <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </>
          )}
        </Carousel>

        {rating > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-inverse-surface/90 px-2.5 py-1 text-xs font-medium text-inverse-on-surface">
            <Star className="w-3.5 h-3.5 text-ochre-gold fill-ochre-gold" />
            <span>{rating.toFixed(1)}</span>
            <span className="text-inverse-on-surface/60">({reviewCount})</span>
          </div>
        )}

        {filterChips.length > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
            {filterChips.map((chip) => (
              <span key={chip} className="rounded-full bg-inverse-surface/90 px-2 py-0.5 text-[11px] font-medium text-inverse-on-surface">
                {chip}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 flex-grow">
        <h3 className="font-title-md text-title-md leading-tight mb-2">
          <Link href={`/listings/${property.id}`} className="hover:text-primary-container transition-colors">
            {property.title}
          </Link>
        </h3>
        <div className="flex items-center text-sm text-on-surface-variant">
          <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0 text-clay-brown" />
          <span>{property.city}, {property.state}</span>
        </div>
      </div>

      <div className="p-4 flex justify-between items-center border-t border-outline-variant/30">
        <div>
          <span className="font-title-md text-lg text-m3-primary">
            {currencySymbol(property.currency)}{property.price_per_night.toLocaleString()}
          </span>
          <span className="text-sm text-on-surface-variant"> /night</span>
        </div>
        {property.status === 'pending' && (
          <span className="rounded-full border border-ochre-gold/50 text-ochre-gold text-xs px-2 py-0.5">Pending review</span>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
