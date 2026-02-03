import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  ArrowRight, Heart, Shield, Users, Star, Sparkles, Lock, 
  Calendar, MapPin, Briefcase, ArrowUpRight, Plus, Minus,
  MessageCircle, Coffee, BookOpen, Video
} from 'lucide-react';

// --- STYLES & ANIMATIONS ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');

  :root {
    --bhim-blue: #2A4B9B;
    --bhim-dark: #1A2F63;
    --paper: #F9F7F2;
    --paper-dark: #EFECE6;
    --text-main: #1C1C1E;
    --text-muted: #6B6B72;
    --warm-gold: #D4A056;
    --deep-gold: #B8863D;
  }

  body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background-color: var(--paper);
    color: var(--text-main);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4, .serif {
    font-family: 'Playfair Display', serif;
  }

  /* --- ANIMATIONS --- */
  .reveal-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .reveal-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .stagger-1 { transition-delay: 100ms; }
  .stagger-2 { transition-delay: 200ms; }
  .stagger-3 { transition-delay: 300ms; }
  
  @keyframes pulse-soft {
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); opacity: 0.8; }
  }

  @keyframes pulse-ring {
    0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(42, 75, 155, 0.4); }
    70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(42, 75, 155, 0); }
    100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(42, 75, 155, 0); }
  }
  
  .animate-pulse-slow {
    animation: pulse-soft 4s ease-in-out infinite;
  }
  
  .animate-pulse-ring {
    animation: pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  /* --- COMPONENTS --- */
  .btn-primary {
    background-color: var(--bhim-blue);
    color: white;
    padding: 16px 36px;
    border-radius: 50px;
    font-weight: 500;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    display: inline-flex;
    align-items: center;
    gap: 12px;
    border: none;
    cursor: pointer;
    font-size: 1.05rem;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(42, 75, 155, 0.25);
    background-color: #234085;
  }
  
  .btn-outline {
    background-color: transparent;
    color: var(--bhim-blue);
    padding: 14px 32px;
    border-radius: 50px;
    font-weight: 500;
    border: 1px solid rgba(42, 75, 155, 0.3);
    transition: all 0.3s ease;
    cursor: pointer;
  }
  
  .btn-outline:hover {
    border-color: var(--bhim-blue);
    background-color: rgba(42, 75, 155, 0.05);
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.6);
  }

  .section-label {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--bhim-blue);
    margin-bottom: 1rem;
    display: block;
  }

  /* --- LAYOUT UTILS --- */
  .container-custom {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
  }
  
  /* Horizontal Scroll Hide */
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// --- HOOKS ---
const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

// --- SUB-COMPONENTS ---

const SectionHeader = ({ 
  label, 
  title, 
  subtitle, 
  centered 
}: { 
  label: string; 
  title: string; 
  subtitle?: string; 
  centered?: boolean 
}) => (
  <div className={`mb-12 reveal-on-scroll ${centered ? 'text-center' : ''}`}>
    <span className="inline-block py-1 px-3 rounded-full bg-[#2A4B9B]/5 text-[#2A4B9B] text-xs font-bold uppercase tracking-widest mb-4">
      {label}
    </span>
    <h2 className="text-3xl md:text-4xl serif text-[#1C1C1E] mb-4">
      {title}
    </h2>
    {subtitle && (
      <p className={`text-gray-600 text-lg leading-relaxed max-w-2xl ${centered ? 'mx-auto' : ''}`}>
        {subtitle}
      </p>
    )}
  </div>
);

const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 py-6 reveal-on-scroll">
      <button 
        className="w-full flex justify-between items-center text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xl serif font-medium text-[#1C1C1E] pr-8">{question}</span>
        <span className="text-[#2A4B9B] flex-shrink-0">
          {isOpen ? <Minus size={24} /> : <Plus size={24} />}
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
        <p className="text-gray-600 leading-relaxed pr-8">{answer}</p>
      </div>
    </div>
  );
};

// --- SECTIONS ---

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-4' : 'py-6'}`}>
      <div className="container-custom">
        <div className={`flex justify-between items-center px-6 py-4 rounded-full transition-all duration-300 ${scrolled ? 'glass-card shadow-lg' : 'bg-transparent'}`}>
          <div className="text-xl font-bold tracking-tight text-[#2A4B9B] serif italic">MettaMate</div>
          
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600 items-center">
            <a href="#connect" className="hover:text-[#2A4B9B] transition">Connect</a>
            <a href="#grow" className="hover:text-[#2A4B9B] transition">Grow</a>
            <a href="#support" className="hover:text-[#2A4B9B] transition">Support</a>
            <a href="#safety" className="hover:text-[#2A4B9B] transition">Safety</a>
          </div>
          
          <button className="bg-[#2A4B9B] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#1A2F63] transition">
            Join Now
          </button>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => (
  <section className="relative min-h-[95vh] w-full flex items-center justify-center overflow-hidden pb-20 pt-32 md:pt-0">
    {/* Background Image with Soft Overlay */}
    <div 
      className="absolute inset-0 z-0 bg-cover bg-center"
      style={{ 
        backgroundImage: 'url("https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
        filter: 'brightness(0.95)' 
      }} 
    />
    <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#F9F7F2]/80 via-[#F9F7F2]/40 to-[#F9F7F2]" />

    <div className="relative z-20 text-center container-custom max-w-5xl">
      <div className="reveal-on-scroll mb-8 flex justify-center">
         <span className="bg-white/40 backdrop-blur-md border border-white/50 text-[#1A2F63] px-5 py-1.5 rounded-full text-xs uppercase tracking-widest font-bold">
           Welcome Home
         </span>
      </div>
      
      <h1 className="reveal-on-scroll stagger-1 text-6xl md:text-8xl lg:text-9xl text-[#1C1C1E] font-medium leading-[1] mb-8 tracking-tight">
        Where you simply <br /> <span className="serif italic text-[#2A4B9B]">belong.</span>
      </h1>
      
      <p className="reveal-on-scroll stagger-2 text-lg md:text-2xl text-[#1C1C1E]/70 max-w-2xl mx-auto leading-relaxed font-light mb-12">
        A dignified space for Ambedkarites to gather, heal, and grow.<br className="hidden md:block" />
        Rooted in shared experience and trust.
      </p>
      
      <div className="reveal-on-scroll stagger-3 flex flex-col md:flex-row gap-4 justify-center items-center">
        <button className="btn-primary shadow-2xl">
          Find Your People <ArrowRight size={20} />
        </button>
        <span className="text-sm text-gray-500 mt-4 md:mt-0 font-medium">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          15,000+ Members Online
        </span>
      </div>
    </div>
  </section>
);

const ShowingUpCarousel = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const moments = [
    { 
      title: "Joyful Gatherings", 
      img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80",
      caption: "Laughter that doesn't need translation."
    },
    { 
      title: "Quiet Reflection", 
      img: "https://images.unsplash.com/photo-1499557354967-2b2d8910bcca?w=800&q=80",
      caption: "Finding peace in our shared silence."
    },
    { 
      title: "Shared History", 
      img: "https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?w=800&q=80",
      caption: "Honoring the path our ancestors paved."
    },
    { 
      title: "Future Building", 
      img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
      caption: "Planting seeds for generations to come."
    }
  ];

  return (
    <section className="py-20 overflow-hidden bg-white">
      <div className="container-custom mb-12 flex justify-between items-end reveal-on-scroll">
        <div>
          <span className="section-label">Connect</span>
          <h3 className="text-3xl serif italic text-[#1C1C1E]">This is what showing up together looks like.</h3>
        </div>
        <div className="hidden md:flex gap-2">
            <button onClick={() => scroll('left')} className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"><ArrowRight className="rotate-180" size={20}/></button>
            <button onClick={() => scroll('right')} className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"><ArrowRight size={20}/></button>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex gap-6 overflow-x-auto px-6 md:px-[max(calc((100vw-1280px)/2),24px)] pb-8 hide-scrollbar snap-x">
        {moments.map((m, i) => (
          <div key={i} className="flex-none w-[300px] md:w-[400px] aspect-[4/5] relative rounded-2xl overflow-hidden group cursor-pointer snap-center reveal-on-scroll stagger-1">
            <img src={m.img} alt={m.title} className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60" />
            <div className="absolute bottom-0 left-0 p-8 transform transition-transform duration-500 group-hover:translate-y-[-5px]">
              <h4 className="text-white text-2xl serif italic mb-2">{m.title}</h4>
              <p className="text-white/90 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                {m.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Manifesto = () => (
  <section className="py-24 bg-[#F9F7F2]">
    <div className="container-custom">
      <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
        <div className="hidden md:block relative">
          <div className="sticky top-32">
             <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative">
                <img 
                  src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&q=80" 
                  className="absolute inset-0 w-full h-full object-cover" 
                  alt="Reading book" 
                />
                <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/50">
                   <blockquote className="text-[#2A4B9B] serif italic text-xl mb-4">
                     "Cultivation of mind should be the ultimate aim of human existence."
                   </blockquote>
                   <p className="text-xs font-bold tracking-widest uppercase text-gray-500">— Dr. B.R. Ambedkar</p>
                </div>
             </div>
          </div>
        </div>

        <div className="flex flex-col justify-center py-10">
          <SectionHeader label="Our Story" title="You’ve explained enough." subtitle="" />
          <h2 className="reveal-on-scroll text-4xl md:text-5xl lg:text-6xl serif text-[#1C1C1E] -mt-10 mb-12 leading-tight">
             <span className="text-[#2A4B9B]">enough.</span>
          </h2>
          
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
            <p className="reveal-on-scroll">
              In most digital spaces, we have to translate our history or justify our presence before we can even begin to connect. It is exhausting. MettaMate is the answer to that fatigue—a space where context is understood, history is shared, and the baseline is dignity.
            </p>
            <p className="reveal-on-scroll">
              More than just a social network, we are a digital ecosystem designed to nurture your growth, protect your peace, and celebrate your joy.
            </p>
            <p className="reveal-on-scroll text-[#2A4B9B] font-medium italic pt-4">
               With your roots secure, you are finally free to evolve.
            </p>
          </div>

          <div className="mt-12 reveal-on-scroll">
            <button className="text-[#2A4B9B] font-bold border-b-2 border-[#2A4B9B] pb-1 hover:text-[#1A2F63] transition">
              Read our Community Guidelines
            </button>
          </div>
        </div>

      </div>
    </div>
  </section>
);

const BridgeSection = () => (
  <section className="py-20 bg-white">
    <div className="container-custom">
      <SectionHeader label="" title="There’s a place for you here." subtitle="" centered />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-12">
        {[
          { 
            title: "Meaningful connections", 
            desc: "Friendships rooted in shared understanding.", 
            icon: <Users size={24} /> 
          },
          { 
            title: "Career growth with context", 
            desc: "Workplaces where you don't have to hide.", 
            icon: <Briefcase size={24} /> 
          },
          { 
            title: "Mentorship & giving back", 
            desc: "Guidance from those who have walked the path.", 
            icon: <Star size={24} /> 
          },
          { 
            title: "Community initiatives", 
            desc: "Wellness and support, circulated among us.", 
            icon: <Heart size={24} /> 
          }
        ].map((item, i) => (
          <div key={i} className={`text-center reveal-on-scroll stagger-${i} flex flex-col items-center`}>
            <div className="w-14 h-14 rounded-full bg-[#2A4B9B]/5 flex items-center justify-center text-[#2A4B9B] mb-6 transition-transform duration-300 hover:scale-110 hover:bg-[#2A4B9B]/10">
               {item.icon}
            </div>
            <h3 className="text-lg font-semibold text-[#1C1C1E] mb-3">{item.title}</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Events = () => {
  const events = [
    { 
      day: "14", month: "OCT", 
      title: "Dhamma Chakra Day", 
      type: "Celebration", 
      desc: "Renewing our vows to liberty and equality.",
      img: "https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?w=600&q=80"
    },
    { 
      day: "18", month: "OCT", 
      title: "Healing Circles", 
      type: "Workshop", 
      desc: "A safe space to process, breathe, and release.",
      img: "https://images.unsplash.com/photo-1544367563-12123d8959bd?w=600&q=80"
    },
    { 
      day: "02", month: "NOV", 
      title: "Lit Festival", 
      type: "Gathering", 
      desc: "Words that shook the world, read by voices of today.",
      img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80"
    },
    { 
      day: "15", month: "NOV", 
      title: "Future Mixer", 
      type: "Gathering", 
      desc: "Building the future with those who share your past.",
      img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80"
    }
  ];

  const scrollRef = useRef(null);
  
  const scroll = (direction) => {
    if (scrollRef.current) {
        const { current } = scrollRef;
        const scrollAmount = direction === 'left' ? -350 : 350;
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="connect" className="py-24 bg-white border-t border-gray-100">
      <div className="container-custom">
        <div className="mb-12 reveal-on-scroll flex justify-between items-end">
          <div>
             <span className="section-label">Events</span>
             <h2 className="text-4xl serif text-[#1C1C1E]">Gathering with Purpose.</h2>
          </div>
          <div className="hidden md:flex gap-2">
            <button onClick={() => scroll('left')} className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"><ArrowRight className="rotate-180" size={20}/></button>
            <button onClick={() => scroll('right')} className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"><ArrowRight size={20}/></button>
          </div>
        </div>

        {/* Carousel */}
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-12 hide-scrollbar snap-x -mx-4 px-4 md:mx-0 md:px-0">
           {events.map((e, i) => (
             <div key={i} className="flex-none w-[280px] md:w-[350px] h-[420px] rounded-3xl relative overflow-hidden group snap-center cursor-pointer reveal-on-scroll shadow-sm hover:shadow-xl transition-all duration-500">
                {/* Background Image */}
                <img src={e.img} alt={e.title} className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A2F63] via-[#1A2F63]/20 to-transparent opacity-90" />
                
                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                   <div className="flex justify-between items-start">
                      <div className="bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl px-3 py-2 text-center">
                        <div className="text-xs font-bold uppercase tracking-wider opacity-80">{e.month}</div>
                        <div className="text-xl font-bold serif leading-none">{e.day}</div>
                      </div>
                      <span className="bg-[#D4A056]/90 backdrop-blur-md text-[#3E2C10] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {e.type}
                      </span>
                   </div>

                   <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                     <h3 className="text-2xl text-white serif mb-3 leading-tight">{e.title}</h3>
                     <p className="text-white/80 text-sm leading-relaxed mb-6 font-medium line-clamp-2">
                       {e.desc}
                     </p>
                     
                     <div className="flex items-center gap-2 text-[#D4A056] text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        Details <ArrowRight size={14} />
                     </div>
                   </div>
                </div>
             </div>
           ))}
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center gap-4 reveal-on-scroll">
           <button className="btn-primary">View all events</button>
           <a href="#" className="text-sm font-medium text-gray-500 hover:text-[#2A4B9B] transition border-b border-transparent hover:border-[#2A4B9B]">Host an event</a>
        </div>
      </div>
    </section>
  );
};

const GrowSection = () => (
  <section id="grow" className="py-24 bg-[#F9F7F2]">
    <div className="container-custom">
      <SectionHeader 
        label="Grow" 
        title="More than just connection." 
        subtitle="A dedicated ecosystem for your personal and professional evolution."
        centered
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[350px]">
        {/* Mentorship Card (Large) */}
        <div className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-white shadow-sm reveal-on-scroll">
           <div className="absolute top-0 right-0 p-8 z-20">
             <div className="bg-white/80 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#2A4B9B]">Mentorship</div>
           </div>
           <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
           <img 
             src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80" 
             className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" 
             alt="Mentorship" 
           />
           <div className="absolute bottom-0 left-0 p-10 z-20 max-w-lg">
             <div className="mb-6 flex items-center gap-4">
                <div className="flex -space-x-4">
                  {[1, 2, 3].map((i) => (
                    <img 
                      key={i}
                      src={`https://i.pravatar.cc/100?img=${i + 20}`} 
                      alt="Mentor"
                      className="w-10 h-10 rounded-full border-2 border-white/30"
                    />
                  ))}
                </div>
                <span className="text-white/90 text-sm font-medium tracking-wide">
                  Real guidance from those who have walked the path.
                </span>
             </div>
             <h3 className="text-3xl text-white serif mb-4">Guidance Rooted in Reality</h3>
             <p className="text-white/80 text-lg">Connect with mentors who understand structural barriers and how to navigate them.</p>
           </div>
        </div>

        {/* Career Card */}
        <div className="relative group overflow-hidden rounded-3xl bg-[#2A4B9B] text-white p-8 flex flex-col justify-between reveal-on-scroll stagger-1">
           <Briefcase className="text-white/50 mb-4" size={40} />
           <div>
             <h3 className="text-2xl serif mb-2">Career Hub</h3>
             <p className="text-white/70 mb-6">Jobs at inclusive organizations that value your heritage.</p>
             <div className="bg-white/10 rounded-xl p-4">
               <span className="text-2xl font-bold block">450+</span>
               <span className="text-xs uppercase opacity-70">Active Listings</span>
             </div>
           </div>
        </div>

        {/* Stories Card */}
        <div className="relative group overflow-hidden rounded-3xl bg-[#D4A056] p-8 flex flex-col justify-between reveal-on-scroll">
           <BookOpen className="text-white/60 mb-4" size={40} />
           <h3 className="text-2xl serif text-[#3E2C10] mb-2">Community Stories</h3>
           <p className="text-[#5C4018] mb-6">Read essays and success stories from members like you.</p>
           <button className="self-start bg-white/20 hover:bg-white/30 text-[#3E2C10] px-4 py-2 rounded-lg text-sm font-bold transition">Read Blog</button>
        </div>

        {/* Relationships Card */}
        <div className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-white border border-gray-100 p-10 flex flex-col md:flex-row items-center gap-10 reveal-on-scroll stagger-1">
           <div className="flex-1">
             <div className="flex items-center gap-2 mb-4 text-[#B8863D]">
                <Heart size={20} fill="currentColor" />
                <span className="text-xs font-bold uppercase tracking-widest">Relationships</span>
             </div>
             <h3 className="text-3xl serif text-[#1C1C1E] mb-4">Meaningful Connections</h3>
             <p className="text-gray-600 mb-6">Whether you are looking for friendship, a co-founder, or a life partner, find people who share your values.</p>
             <button className="text-[#2A4B9B] font-bold flex items-center gap-2 hover:gap-3 transition">Explore Connections <ArrowRight size={18} /></button>
           </div>
           <div className="flex-1 w-full relative h-48 md:h-full">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#F9F7F2] rounded-full border border-[#D4A056]/30 flex items-center justify-center">
                <div className="w-32 h-32 bg-[#D4A056]/10 rounded-full flex items-center justify-center">
                   <Users className="text-[#D4A056]" size={40} />
                </div>
             </div>
             <img src="https://i.pravatar.cc/100?img=5" className="absolute top-0 right-10 w-12 h-12 rounded-full border-2 border-white shadow-lg animate-bounce" style={{animationDuration: '3s'}} alt="User" />
             <img src="https://i.pravatar.cc/100?img=9" className="absolute bottom-0 left-10 w-14 h-14 rounded-full border-2 border-white shadow-lg animate-bounce" style={{animationDuration: '4s'}} alt="User" />
           </div>
        </div>
      </div>
    </div>
  </section>
);

const VoicesSection = () => {
  const testimonials = [
    {
      quote: "I didn't realize how heavy the armor was until I found a place where I could finally take it off. It’s quiet here, in the best way.",
      name: "Anjali",
      role: "Architect",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80"
    },
    {
      quote: "To speak without translation, to exist without justification—this is the dignity we were promised. I have found my breath again.",
      name: "Siddharth", 
      role: "Historian",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
    },
    {
      quote: "It’s not just about networking. It’s about finding the people who will hold the ladder steady while you climb. Pure kinship.",
      name: "Kiran",
      role: "Product Designer",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80"
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F9F7F2] rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>

       <div className="container-custom relative z-10">
          <SectionHeader label="" title="Voices from the community." subtitle="" centered />

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className={`p-10 rounded-3xl bg-[#F9F7F2] hover:shadow-lg hover:shadow-[#2A4B9B]/5 transition-all duration-500 reveal-on-scroll ${i === 1 ? 'stagger-1' : i === 2 ? 'stagger-2' : ''}`}>
                 <div className="mb-6 text-[#2A4B9B]/20">
                   <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                     <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                   </svg>
                 </div>
                 <p className="text-xl serif text-[#1C1C1E] leading-relaxed mb-8 italic opacity-80">
                   "{t.quote}"
                 </p>
                 <div className="flex items-center gap-4">
                   <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-white shadow-sm grayscale opacity-80" />
                   <div>
                     <div className="font-bold text-[#1C1C1E]">{t.name}</div>
                     <div className="text-sm text-gray-500">{t.role}</div>
                   </div>
                 </div>
              </div>
            ))}
          </div>
       </div>
    </section>
  );
};

const ImpactSection = () => (
  <section className="py-24 bg-[#2A4B9B] text-white text-center">
    <div className="container-custom">
      
      <div className="mb-16 reveal-on-scroll">
        <h2 className="text-3xl md:text-4xl serif mb-4">Boundless reach, grounded roots.</h2>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          From every corner of the world, we come together to lift each other up.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 divide-x divide-white/10">
        <div className="reveal-on-scroll">
          <div className="text-4xl md:text-5xl font-bold mb-2">15k+</div>
          <div className="text-sm uppercase tracking-widest text-white/60">Lives Connected</div>
        </div>
        <div className="reveal-on-scroll stagger-1">
          <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
          <div className="text-sm uppercase tracking-widest text-white/60">Cities Active</div>
        </div>
        <div className="reveal-on-scroll stagger-2">
          <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
          <div className="text-sm uppercase tracking-widest text-white/60">Mentors Leading</div>
        </div>
        <div className="reveal-on-scroll stagger-3">
          <div className="text-4xl md:text-5xl font-bold mb-2">∞</div>
          <div className="text-sm uppercase tracking-widest text-white/60">Limitless Worth</div>
        </div>
      </div>
    </div>
  </section>
);

const GlobalGatheringSection = () => {
  const cities = [
    { name: "Toronto", x: 28, y: 35, delay: "0s" },
    { name: "London", x: 49, y: 26, delay: "1.5s" },
    { name: "Delhi", x: 69, y: 40, delay: "2.5s" },
    { name: "Mumbai", x: 68, y: 48, delay: "0.5s" },
    { name: "Pune", x: 69, y: 50, delay: "3s" },
    { name: "Bengaluru", x: 70, y: 55, delay: "1s" },
    { name: "New York", x: 29, y: 39, delay: "2s" },
    { name: "Singapore", x: 78, y: 60, delay: "3.5s" }
  ];

  return (
    <section className="py-24 bg-[#F9F7F2] overflow-hidden">
      <div className="container-custom">
        <div className="text-center mb-16 reveal-on-scroll">
           <h2 className="text-4xl md:text-5xl serif text-[#1C1C1E] mb-4">Gathering across cities. Growing through care.</h2>
           <p className="text-gray-600 text-lg">From local circles to a shared global fabric.</p>
        </div>
        
        <div className="relative w-full aspect-[2/1] max-w-5xl mx-auto reveal-on-scroll">
           {/* SVG Map Silhouette */}
           <svg viewBox="0 0 1000 500" className="w-full h-full opacity-10 pointer-events-none">
              <path fill="#2A4B9B" d="M225,127 C211,106 170,105 152,117 C138,126 109,114 100,123 C94,129 100,147 91,155 C77,166 41,154 41,180 C41,200 68,228 85,242 C104,258 123,293 129,317 C133,332 129,360 144,363 C165,367 172,326 178,304 C183,286 211,262 211,262 C211,262 263,248 274,228 C283,212 284,185 277,171 C272,160 252,143 252,143 L225,127 Z" />
              <path fill="#2A4B9B" d="M470,89 C457,93 454,117 447,128 C443,135 431,139 428,148 C425,158 438,168 444,175 C451,183 446,204 446,204 C446,204 471,195 480,188 C495,176 525,170 525,170 C525,170 541,151 528,136 C519,126 498,82 470,89 Z" />
              <path fill="#2A4B9B" d="M578,166 C566,177 568,206 568,206 C568,206 589,223 589,223 C589,223 624,213 624,213 C624,213 668,212 680,199 C691,188 720,165 720,165 C720,165 700,147 687,149 C673,151 645,166 645,166 L578,166 Z" />
              <path fill="#2A4B9B" d="M634,269 C634,269 643,303 652,323 C660,342 667,370 685,373 C702,376 718,349 718,349 C718,349 746,316 754,297 C766,269 778,252 754,233 C732,216 690,227 671,234 C656,239 634,269 634,269 Z" />
              <path fill="#2A4B9B" d="M801,235 C801,235 791,268 791,268 C791,268 823,293 833,285 C843,276 864,256 864,256 C864,256 822,221 801,235 Z" />
              <path fill="#2A4B9B" d="M890,307 C890,307 872,332 878,352 C884,370 917,363 917,363 C917,363 936,336 931,316 C926,298 890,307 890,307 Z" />
           </svg>
           
           {/* Faint Connecting Lines */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
             <path d="M490,260 Q590,350 690,400" fill="none" stroke="#2A4B9B" strokeWidth="1" strokeDasharray="4 4" className="animate-pulse-slow" />
             <path d="M280,350 Q485,300 490,260" fill="none" stroke="#2A4B9B" strokeWidth="1" strokeDasharray="4 4" className="animate-pulse-slow" style={{animationDelay: "2s"}} />
             <path d="M690,400 Q740,450 780,600" fill="none" stroke="#2A4B9B" strokeWidth="1" strokeDasharray="4 4" className="animate-pulse-slow" style={{animationDelay: "1s"}} />
           </svg>

           {/* Cities Nodes */}
           {cities.map((city, i) => (
             <div 
               key={i}
               className="absolute group cursor-pointer"
               style={{ left: `${city.x}%`, top: `${city.y}%` }}
             >
                {/* Node Ring Animation */}
                <div 
                  className="absolute -inset-4 rounded-full border border-[#2A4B9B]/20 animate-pulse-ring" 
                  style={{ animationDelay: city.delay }}
                ></div>
                
                {/* Core Dot */}
                <div 
                  className="w-3 h-3 bg-[#2A4B9B] rounded-full relative z-10 transition-transform duration-300 group-hover:scale-150"
                ></div>
                
                {/* Tooltip */}
                <div className="absolute left-1/2 bottom-full mb-3 -translate-x-1/2 w-max text-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none z-20">
                   <div className="bg-white px-4 py-2 rounded-lg shadow-xl border border-gray-100 relative">
                     <span className="block font-serif text-[#1C1C1E] font-bold text-lg">{city.name}</span>
                     <span className="block text-xs uppercase tracking-widest text-green-600 font-bold mt-1">Community Active</span>
                     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white border-b border-r border-gray-100 rotate-45"></div>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

const SupportSection = () => (
  <section id="support" className="py-24 bg-white">
    <div className="container-custom">
      <SectionHeader 
        label="Support" 
        title="Support the community economy." 
        subtitle="True wealth is shared well-being. Support the businesses, non-profits, and initiatives that sustain us beyond just commerce."
        centered
      />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Business Card */}
        <div className="p-8 rounded-3xl bg-[#F9F7F2] hover:bg-[#F0EBE0] transition-colors duration-300 reveal-on-scroll group cursor-pointer relative overflow-hidden flex flex-col h-full">
           <div className="mb-auto">
             <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#2A4B9B] shadow-sm group-hover:scale-110 transition-transform">
                    <Briefcase size={24} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full border border-[#2A4B9B]/20 text-[#2A4B9B] bg-[#2A4B9B]/5">
                 Business
               </span>
             </div>
             <h3 className="text-xl serif text-[#1C1C1E] mb-3">Community Market</h3>
             <p className="text-gray-600 text-sm leading-relaxed">
               Support entrepreneurs and creators. Every purchase circulates wealth within our ecosystem.
             </p>
           </div>
        </div>

        {/* Nonprofit Card */}
        <div className="p-8 rounded-3xl bg-[#F9F7F2] hover:bg-[#F0EBE0] transition-colors duration-300 reveal-on-scroll stagger-1 group cursor-pointer relative overflow-hidden flex flex-col h-full">
           <div className="mb-auto">
             <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#B8863D] shadow-sm group-hover:scale-110 transition-transform">
                    <Heart size={24} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full border border-[#D4A056]/40 text-[#B8863D] bg-[#D4A056]/10">
                 Nonprofit
               </span>
             </div>
             <h3 className="text-xl serif text-[#1C1C1E] mb-3">Cause & Advocacy</h3>
             <p className="text-gray-600 text-sm leading-relaxed">
               Donate to organizations fighting for justice, education, and structural change.
             </p>
           </div>
        </div>

        {/* Mutual Aid Card */}
        <div className="p-8 rounded-3xl bg-[#F9F7F2] hover:bg-[#F0EBE0] transition-colors duration-300 reveal-on-scroll stagger-2 group cursor-pointer relative overflow-hidden flex flex-col h-full">
           <div className="mb-auto">
             <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green-700 shadow-sm group-hover:scale-110 transition-transform">
                    <Sparkles size={24} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full border border-green-600/20 text-green-700 bg-green-600/5">
                 Mutual Aid
               </span>
             </div>
             <h3 className="text-xl serif text-[#1C1C1E] mb-3">Grassroots Relief</h3>
             <p className="text-gray-600 text-sm leading-relaxed">
               Direct support funds for emergency relief and community care initiatives.
             </p>
           </div>
        </div>

        {/* Community Collective Card */}
        <div className="p-8 rounded-3xl bg-[#F9F7F2] hover:bg-[#F0EBE0] transition-colors duration-300 reveal-on-scroll stagger-3 group cursor-pointer relative overflow-hidden flex flex-col h-full">
           <div className="mb-auto">
             <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#1A2F63] shadow-sm group-hover:scale-110 transition-transform">
                    <Users size={24} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full border border-[#1A2F63]/20 text-[#1A2F63] bg-[#1A2F63]/5">
                 Collective
               </span>
             </div>
             <h3 className="text-xl serif text-[#1C1C1E] mb-3">Community Collectives</h3>
             <p className="text-gray-600 text-sm leading-relaxed">
               Join volunteer-led circles, reading groups, and local projects.
             </p>
           </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-6 reveal-on-scroll">
         <button className="btn-primary">Explore the ecosystem</button>
         <a href="#" className="text-sm font-medium text-gray-500 hover:text-[#2A4B9B] transition border-b border-transparent hover:border-[#2A4B9B]">
            List your initiative
         </a>
      </div>

    </div>
  </section>
);

const SafetySection = () => (
  <section id="safety" className="py-24 bg-[#1A2F63] text-white relative overflow-hidden">
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
    <div className="container-custom relative z-10">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="reveal-on-scroll">
          <div className="flex items-center gap-4 mb-6 text-[#9FB5F0]">
            <Shield size={28} />
            <span className="text-sm font-bold uppercase tracking-widest">Safety Anchor</span>
          </div>
          <h2 className="text-4xl md:text-6xl serif mb-8 leading-tight">
            Safety is our <br />
            <span className="text-[#9FB5F0] italic">love language.</span>
          </h2>
          <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-md">
            True vulnerability requires true safety. MettaMate is not a public square. It is a gated community that prioritizes your privacy above engagement metrics.
            <span className="text-white/90">Here, you can finally put your armor down.</span>
          </p>
          
          <div className="grid gap-6">
            <div className="flex gap-4">
               <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Lock size={20} className="text-[#9FB5F0]" />
               </div>
               <div>
                 <h4 className="font-bold text-lg">Human Verification</h4>
                 <p className="text-white/60 text-sm">Every profile is verified by a human to ensure community integrity.</p>
               </div>
            </div>
            <div className="flex gap-4">
               <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={20} className="text-[#9FB5F0]" />
               </div>
               <div>
                 <h4 className="font-bold text-lg">Values-Based Moderation</h4>
                 <p className="text-white/60 text-sm">Zero tolerance for hate speech or casteism. We protect our peace rigorously.</p>
               </div>
            </div>
          </div>
        </div>
        
        <div className="reveal-on-scroll flex justify-center md:justify-end">
          <div className="dark-glass-card bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl max-w-sm w-full">
             <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
               <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
               <span className="text-sm font-medium">Community Covenant</span>
             </div>
             <p className="text-white/90 italic serif text-lg leading-relaxed">
               "We agree to treat each other with the dignity we deserve but are often denied elsewhere. Here, we lift each other up."
             </p>
             <button className="mt-8 w-full py-3 bg-[#9FB5F0]/10 hover:bg-[#9FB5F0]/20 text-[#9FB5F0] rounded-lg text-sm font-bold transition">
               Read Full Safety Policy
             </button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const FAQ = () => (
  <section className="py-24 bg-[#F9F7F2]">
    <div className="container-custom max-w-3xl">
      <SectionHeader title="Common Questions" label="FAQ" centered />
      <div className="space-y-2">
        <AccordionItem 
          question="Is MettaMate free to join?" 
          answer="MettaMate offers a free membership for basic community access. We also have a premium tier that supports our events, mentorship programs, and scholarships."
        />
        <AccordionItem 
          question="How do you verify members?" 
          answer="We use a combination of social verification and manual review to ensure that everyone joining shares our commitment to a safe, dignified space."
        />
        <AccordionItem 
          question="Is this only for dating?" 
          answer="No! While many find partners here, MettaMate is first and foremost a community platform for friendship, mentorship, networking, and shared cultural celebration."
        />
        <AccordionItem 
          question="Can I stay anonymous?" 
          answer="You can choose how much of your profile is visible to the wider community, but we require real identity verification internally to maintain safety."
        />
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-24 bg-white border-t border-gray-100">
    <div className="container-custom">
      <div className="reveal-on-scroll max-w-5xl mx-auto mb-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl serif text-[#2A4B9B] mb-6">Come Home.</h2>
          <p className="text-xl text-gray-600">
            The community you've been looking for is looking for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Step In */}
          <div className="bg-[#2A4B9B] text-white p-10 rounded-3xl flex flex-col justify-between relative overflow-hidden group hover:shadow-xl transition duration-500">
             <div className="absolute top-0 right-0 p-8 opacity-10 transform rotate-12 group-hover:scale-110 transition duration-700">
               <Users size={140} />
             </div>
             <div>
               <h3 className="text-3xl serif mb-3">Step In.</h3>
               <p className="text-[#9FB5F0] mb-8 text-lg leading-relaxed">
                 Claim your place. Full access to events, mentorship, and a safe community of peers.
               </p>
             </div>
             <button className="w-full bg-white text-[#2A4B9B] py-4 rounded-full font-bold hover:bg-[#F0EBE0] transition flex items-center justify-center gap-2">
               Become a Member <ArrowRight size={20} />
             </button>
          </div>

          {/* Stay Close */}
          <div className="bg-[#F9F7F2] p-10 rounded-3xl flex flex-col justify-between border border-gray-200 hover:border-[#2A4B9B]/20 transition duration-500">
             <div>
               <h3 className="text-3xl serif text-[#1C1C1E] mb-3">Stay Close.</h3>
               <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                 Not ready to jump in? Receive weekly stories of joy and history. No commitment.
               </p>
             </div>
             <div className="flex flex-col sm:flex-row gap-3">
               <input 
                 type="email" 
                 placeholder="Email address" 
                 className="flex-1 px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:border-[#2A4B9B] bg-white" 
               />
               <button className="bg-[#1C1C1E] text-white px-8 py-4 rounded-full font-bold hover:bg-[#2A4B9B] transition whitespace-nowrap">
                 Subscribe
               </button>
             </div>
          </div>
        </div>
      </div>
        
      {/* Footer Links */}
      <div className="pt-10 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-8 text-left text-sm text-gray-500">
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Platform</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-[#2A4B9B]">About Us</a></li>
              <li><a href="#" className="hover:text-[#2A4B9B]">Community Guidelines</a></li>
              <li><a href="#" className="hover:text-[#2A4B9B]">Safety Center</a></li>
            </ul>
          </div>
          <div>
             <h4 className="font-bold text-gray-900 mb-4">Resources</h4>
             <ul className="space-y-3">
               <li><a href="#" className="hover:text-[#2A4B9B]">Mentorship</a></li>
               <li><a href="#" className="hover:text-[#2A4B9B]">Events</a></li>
               <li><a href="#" className="hover:text-[#2A4B9B]">Blog</a></li>
             </ul>
           </div>
           <div>
             <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
             <ul className="space-y-3">
               <li><a href="#" className="hover:text-[#2A4B9B]">Privacy Policy</a></li>
               <li><a href="#" className="hover:text-[#2A4B9B]">Terms of Service</a></li>
             </ul>
           </div>
           <div>
            <div className="text-2xl font-bold text-[#2A4B9B] serif italic mb-4">MettaMate</div>
            <p className="leading-relaxed">© 2024 MettaMate Inc.<br/>All rights reserved.</p>
            <div className="flex gap-4 mt-4">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#2A4B9B] hover:text-white transition cursor-pointer"><span className="font-bold">in</span></div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#2A4B9B] hover:text-white transition cursor-pointer"><span className="font-bold">ig</span></div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#2A4B9B] hover:text-white transition cursor-pointer"><span className="font-bold">x</span></div>
            </div>
           </div>
      </div>
    </div>
  </footer>
);

const App = () => {
  useScrollReveal();

  return (
    <>
      <style>{styles}</style>
      <Navigation />
      <main>
        <Hero />
        <ShowingUpCarousel />
        <Events />
        <Manifesto />
        <BridgeSection />
        <GrowSection />
        <VoicesSection />
        <ImpactSection />
        <GlobalGatheringSection />
        <SupportSection />
        <SafetySection />
        <FAQ />
        <Footer />
      </main>
    </>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}