// Curated real photography for Arewa Stay, sourced from Pexels (free for
// commercial use, no attribution required — https://www.pexels.com/license/).
// This is a placeholder set standing in for real host-uploaded property
// photography and commissioned Nigerian photography — see PHOTOGRAPHY_BRIEF.md
// for the full target spec and honest gaps.
//
// Note on the hero photo specifically: it's a genuine Moroccan riad (Marrakech),
// not Nigerian. Used deliberately as the closest real, verifiably-licensed
// match to "luxury Sahel-style hospitality" until real Nigerian riad/heritage
// hotel photography is available — flagging this plainly rather than passing
// it off as Nigerian.

export const heroPhotos = {
  // Real, free-license luxury riad courtyard (Marrakech, Morocco) — NOT
  // Nigerian, used as the closest available match for "premium hospitality"
  // feel until real Nigerian heritage-hotel photography replaces it.
  luxuryRiad: 'https://images.pexels.com/photos/31356131/pexels-photo-31356131.png?auto=compress&cs=tinysrgb&w=1600',
  // Gidan Dan Hausa, Kano — real, genuinely Nigerian Hausa architecture
  architecture: 'https://images.pexels.com/photos/31603813/pexels-photo-31603813.jpeg?auto=compress&cs=tinysrgb&w=1600',
};

// City landmark photos — genuine, verified matches where they exist.
// Falls back to the general architecture rotation for towns without a
// specific, reliably-licensed landmark photo (see PHOTOGRAPHY_BRIEF.md).
export const cityLandmarks: Record<string, string> = {
  Abuja: 'https://images.pexels.com/photos/31775644/pexels-photo-31775644.jpeg?auto=compress&cs=tinysrgb&w=800', // Aso Rock
  Kano: 'https://images.pexels.com/photos/31603813/pexels-photo-31603813.jpeg?auto=compress&cs=tinysrgb&w=800', // Gidan Dan Hausa
};

export const architecturePhotos: string[] = [
  'https://images.pexels.com/photos/31603813/pexels-photo-31603813.jpeg?auto=compress&cs=tinysrgb&w=800', // Gidan Dan Hausa, Kano
  'https://images.pexels.com/photos/38198069/pexels-photo-38198069.jpeg?auto=compress&cs=tinysrgb&w=800', // Gidan Rumfa, Kano
  'https://images.pexels.com/photos/36465058/pexels-photo-36465058.jpeg?auto=compress&cs=tinysrgb&w=800', // Gidan Makama Museum, Kano
  'https://images.pexels.com/photos/38192540/pexels-photo-38192540.jpeg?auto=compress&cs=tinysrgb&w=800', // Palace gate, Dutse
  'https://images.pexels.com/photos/31484879/pexels-photo-31484879.jpeg?auto=compress&cs=tinysrgb&w=800', // Historic building, Kazaure
  'https://images.pexels.com/photos/31487837/pexels-photo-31487837.jpeg?auto=compress&cs=tinysrgb&w=800', // Painted traditional building
  'https://images.pexels.com/photos/28122985/pexels-photo-28122985.jpeg?auto=compress&cs=tinysrgb&w=800', // Northern Nigeria street architecture
  'https://images.pexels.com/photos/37939531/pexels-photo-37939531.jpeg?auto=compress&cs=tinysrgb&w=800', // Traditional clay houses, rural Nigeria
  'https://images.pexels.com/photos/31775644/pexels-photo-31775644.jpeg?auto=compress&cs=tinysrgb&w=800', // Aso Rock, Abuja
];

export const culturePhotos: string[] = [
  'https://images.pexels.com/photos/31037195/pexels-photo-31037195.jpeg?auto=compress&cs=tinysrgb&w=800', // Decorated Durbar horse, Zaria
  'https://images.pexels.com/photos/38003389/pexels-photo-38003389.jpeg?auto=compress&cs=tinysrgb&w=800', // Durbar Festival parade
  'https://images.pexels.com/photos/38113996/pexels-photo-38113996.jpeg?auto=compress&cs=tinysrgb&w=800', // Hausa horseman, colorful attire
  'https://images.pexels.com/photos/35225133/pexels-photo-35225133.jpeg?auto=compress&cs=tinysrgb&w=800', // Traditional Hausa attire portrait, Zaria
  'https://images.pexels.com/photos/35429635/pexels-photo-35429635.jpeg?auto=compress&cs=tinysrgb&w=800', // Woman in traditional Hausa attire with henna
];

// Curated Collections — one representative interior/exterior photo per
// category, matching what the category is actually about (not a landmark).
// All real Pexels photography; none are Nigeria-specific (generic luxury
// hospitality stock), flagged honestly as placeholders pending real photos.
export const collectionPhotos = {
  royalWeddingSuites: 'https://images.pexels.com/photos/31737843/pexels-photo-31737843.jpeg?auto=compress&cs=tinysrgb&w=800', // luxury bedroom, elegant decor
  desertEscapes: 'https://images.pexels.com/photos/11387348/pexels-photo-11387348.jpeg?auto=compress&cs=tinysrgb&w=800', // desert tents, dunes
  familyCompounds: 'https://images.pexels.com/photos/37939531/pexels-photo-37939531.jpeg?auto=compress&cs=tinysrgb&w=800', // traditional compound
  executiveResidences: 'https://images.pexels.com/photos/34672503/pexels-photo-34672503.jpeg?auto=compress&cs=tinysrgb&w=800', // modern spacious bedroom, large windows
  heritageHomes: 'https://images.pexels.com/photos/31603813/pexels-photo-31603813.jpeg?auto=compress&cs=tinysrgb&w=800', // Gidan Dan Hausa
  weekendRetreats: 'https://images.pexels.com/photos/29453302/pexels-photo-29453302.jpeg?auto=compress&cs=tinysrgb&w=800', // villa with pool, garden
};
