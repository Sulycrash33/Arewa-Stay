// Northern Nigeria (19 states + FCT) and Niger Republic — grouped so the
// destination picker can show real hierarchy (state → its major towns)
// instead of one flat, sparse list. `city` on a listing is still free text,
// so hosts in towns not listed here can still type their own.

export interface StateGroup {
  state: string;
  cities: string[];
}

export const northernNigeriaStates: StateGroup[] = [
  { state: 'FCT (Abuja)', cities: ['Abuja', 'Gwagwalada', 'Kuje'] },
  { state: 'Kano', cities: ['Kano', 'Wudil', 'Rano'] },
  { state: 'Kaduna', cities: ['Kaduna', 'Zaria', 'Kafanchan'] },
  { state: 'Katsina', cities: ['Katsina', 'Funtua', 'Daura'] },
  { state: 'Sokoto', cities: ['Sokoto', 'Wurno', 'Illela'] },
  { state: 'Kebbi', cities: ['Birnin Kebbi', 'Argungu', 'Yauri'] },
  { state: 'Zamfara', cities: ['Gusau', 'Kaura Namoda', 'Talata Mafara'] },
  { state: 'Jigawa', cities: ['Dutse', 'Hadejia', 'Gumel'] },
  { state: 'Borno', cities: ['Maiduguri', 'Biu', 'Bama'] },
  { state: 'Yobe', cities: ['Damaturu', 'Potiskum', 'Nguru'] },
  { state: 'Bauchi', cities: ['Bauchi', 'Azare', 'Misau'] },
  { state: 'Gombe', cities: ['Gombe', 'Kumo', 'Billiri'] },
  { state: 'Adamawa', cities: ['Yola', 'Mubi', 'Jimeta'] },
  { state: 'Taraba', cities: ['Jalingo', 'Wukari', 'Bali'] },
  { state: 'Niger', cities: ['Minna', 'Suleja', 'Bida'] },
  { state: 'Kwara', cities: ['Ilorin', 'Offa', 'Lafiagi'] },
  { state: 'Kogi', cities: ['Lokoja', 'Okene', 'Idah'] },
  { state: 'Benue', cities: ['Makurdi', 'Gboko', 'Otukpo'] },
  { state: 'Plateau', cities: ['Jos', 'Bukuru', 'Pankshin'] },
  { state: 'Nasarawa', cities: ['Lafia', 'Keffi', 'Akwanga'] },
];

export const nigerRepublicStates: StateGroup[] = [
  { state: 'Niamey Region', cities: ['Niamey'] },
  { state: 'Zinder Region', cities: ['Zinder'] },
  { state: 'Maradi Region', cities: ['Maradi'] },
  { state: 'Agadez Region', cities: ['Agadez'] },
  { state: 'Tahoua Region', cities: ['Tahoua', 'Birni-N\'Konni'] },
  { state: 'Dosso Region', cities: ['Dosso', 'Gaya'] },
  { state: 'Diffa Region', cities: ['Diffa'] },
];

export const allRegions: StateGroup[] = [...northernNigeriaStates, ...nigerRepublicStates];

// Flat lists, derived from the above — used wherever a simple dropdown or
// filter pill list is enough (search bar, listings page state filter).
export const arewaStates: string[] = allRegions.map((g) => g.state);
export const arewaCities: string[] = allRegions.flatMap((g) => g.cities);
