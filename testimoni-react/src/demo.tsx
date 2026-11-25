import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Marquee } from '@/components/ui/3d-testimonails';

// Testimoni asli RoboKomputer (5 klien), gambar dari Unsplash
const testimonials = [
  {
    name: 'RIZKY PRATAMA',
    username: 'Retail',
    body: '“Transaksi jadi jauh lebih cepat, stok berkurang otomatis. Kasir manual sudah kami tinggalkan.”',
    img: '../public/avatars/rizky.JPG',
    country: '🇮🇩',
  },
  {
    name: 'NADIA SARI',
    username: 'Chief Produksi',
    body: '“Produk jadi lebih mudah ditracing dan dashboardnya sangat informatif, mengurangi Reject dan bottle-neck.”',
    img: '../public/avatars/nadia.JPG',
    country: '🇮🇩',
  },
  {
    name: 'BAGUS SETIAWAN',
    username: 'UMKM',
    body: '“Website kami tampil profesional, orderan lewat WhatsApp naik. Komunikasinya cepat, hasilnya memuaskan.”',
    img: '../public/avatars/bagus.JPG',
    country: '🇮🇩',
  },
  {
    name: 'AJI SALAHUDIN',
    username: 'CEO Moccata Studio',
    body: '“Puas banget sama hasil websitenya. Tampilannya clean, rapi, dan modern. Motion-nya smooth, transisinya halus. Overall sesuai ekspektasi, simpel tapi tetap premium.”',
    img: '../public/avatars/aji_s.JPG',
    country: '🇮🇩',
  },
  {
    name: 'ADE SHOLAHUDDIN',
    username: 'Owner Aldebaran 3D Printing',
    body: '“Website-nya luar biasa, Pa! Layout-nya bagus, menarik, dan nyaman dilihat. Pembeli jadi lebih mudah mengenal produk sebelum memesan. Bravo, Pa! Sukses selalu! 👏👍”',
    img: '../public/avatars/ade_s.JPG',
    country: '🇮🇩',
  },
];

function TestimonialCard({ img, name, username, body, country, mobile = false }: (typeof testimonials)[number] & { mobile?: boolean }) {
  return (
    <Card className={mobile ? 'w-[min(84vw,320px)]' : 'w-50'}>
      <CardContent>
        <div className="flex items-center gap-2.5">
          <Avatar className="size-9">
            <AvatarImage src={img} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium text-foreground flex items-center gap-1">
              {name} <span className="text-xs">{country}</span>
            </figcaption>
            <p className="text-xs font-medium text-muted-foreground">{username}</p>
          </div>
        </div>
        <blockquote className="mt-3 text-sm text-secondary-foreground">{body}</blockquote>
      </CardContent>
    </Card>
  );
}

export default function DemoOne() {
  // Layout 3D (4 kolom kartu 200px + transform) hanya cocok untuk layar lebar.
  // Di HP, iframe cuma ~390px: pakai satu kolom marquee tanpa transform supaya
  // kartu tidak terpotong / meluber keluar frame.
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  if (isMobile) {
    return (
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
        <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} mobile />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/5 bg-gradient-to-b from-background"></div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-background"></div>
      </div>
    );
  }

  return (
    <div className="relative flex h-[560px] w-full max-w-[1180px] flex-row items-center justify-center gap-1.5 [perspective:300px]">
      <div
        className="flex flex-row items-center gap-4"
        style={{
          transform:
            'translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)',
        }}
      >
        {/* Vertical Marquee (downwards) */}
        <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>
        {/* Vertical Marquee (upwards) */}
        <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>
        {/* Vertical Marquee (downwards) */}
        <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>
        {/* Vertical Marquee (upwards) */}
        <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>
        {/* Gradient overlays for vertical marquee */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
      </div>
    </div>
  );
}
