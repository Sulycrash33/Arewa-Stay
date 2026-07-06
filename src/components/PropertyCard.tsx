import Link from 'next/link';
import Image from 'next/image';
import type { Listing } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from './ui/badge';
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
  ].filter(Boolean) as string[];

  return (
    <Card className="group flex flex-col h-full overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:shadow-xl hover:shadow-km-gold/5 hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        <Carousel className="w-full overflow-hidden">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="aspect-video relative">
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
          <div className="glass absolute top-3 right-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-white">
            <Star className="w-3.5 h-3.5 text-km-gold fill-km-gold" />
            <span>{rating.toFixed(1)}</span>
            <span className="text-white/60">({reviewCount})</span>
          </div>
        )}

        {filterChips.length > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
            {filterChips.map((chip) => (
              <span key={chip} className="glass rounded-full px-2 py-0.5 text-[11px] font-medium text-white">
                {chip}
              </span>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline leading-tight mb-2">
          <Link href={`/listings/${property.id}`} className="hover:text-km-gold transition-colors">
            {property.title}
          </Link>
        </CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0 text-km-gold" />
          <span>{property.city}, {property.state}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 flex justify-between items-center border-t border-border">
        <div>
          <span className="font-bold text-lg text-foreground">
            {currencySymbol(property.currency)}{property.price_per_night.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground"> /night</span>
        </div>
        {property.status === 'pending' && (
          <Badge variant="outline" className="border-km-gold/50 text-km-gold text-xs">Pending review</Badge>
        )}
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
