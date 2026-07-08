import { Info, Target, Eye } from 'lucide-react';

const SECTIONS = [
  { icon: Info, title: 'Who We Are', body: 'Arewa Stay was born from a desire to showcase the beauty and diversity of Northern Nigeria and the wider Sahel. We are a team passionate about culture, technology, and community, dedicated to creating memorable travel stories.' },
  { icon: Target, title: 'Our Mission', body: 'To connect travelers with the rich culture and warm hospitality of the Arewa region by providing a platform for unique and authentic stays — empowering local hosts and offering guests a genuine experience.' },
  { icon: Eye, title: 'Our Vision', body: 'To be the leading platform for cultural tourism in the Sahel, fostering economic growth and preserving heritage by making the authentic Arewa experience accessible to the world.' },
];

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-stack-lg max-w-4xl">
      <div className="text-center mb-stack-lg">
        <h1 className="font-display-lg text-4xl md:text-display-lg text-m3-primary">About Arewa Stay</h1>
        <p className="mt-4 font-body-lg text-body-lg text-on-surface-variant">
          Your authentic home in the heart of Northern Nigeria and the Sahel.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-stack-md">
        {SECTIONS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-tubali bg-surface-container-lowest tubali-border p-stack-md shadow-tubali">
            <h2 className="font-title-md text-title-md text-m3-primary mb-stack-sm flex items-center gap-2">
              <Icon className="h-5 w-5 text-primary-container" />
              {title}
            </h2>
            <p className="font-body-md text-on-surface-variant">{body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
