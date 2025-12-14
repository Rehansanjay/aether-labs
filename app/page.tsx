'use client';
import { useState, useEffect } from 'react';

// --- INTERFACES ---
interface Memory {
  id: number;
  url: string;
  prompt: string;
  style: string;
  timestamp: string;
}

// --- ICONS (SVG COMPONENTS) ---
const Icons = {
  Github: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>,
  Twitter: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  Linkedin: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>,
  Instagram: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
  Mail: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
};

// --- UTILITY: TYPEWRITER EFFECT ---
function Typewriter({ text, speed = 15 }: { text: string, speed?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return <span className="text-gray-400 font-mono text-xs">{displayedText}</span>;
}

// --- MAIN PAGE ---
export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Cinematic');
  const [images, setImages] = useState<string[]>([]); 
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Memory[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('aether_memories');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Memory corruption detected", e);
      }
    }
  }, []);

  const styles = ["Cinematic", "Ethereal", "Cyberpunk", "3D Render", "Abstract", "Photorealistic"];

  const randomPrompts = [
    "A cathedral made of bioluminescent glass",
    "Astronaut floating in a nebula of gold dust",
    "Microchip circuitry blending into organic roots",
    "Futuristic Tokyo street reflection in a puddle"
  ];

  const handleRandom = () => {
    const randomPick = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
    setPrompt(randomPick);
  };

  const recallMemory = (memory: Memory) => {
    setImages([memory.url]); 
    setPrompt(memory.prompt); 
    setStyle(memory.style);   
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function handleGenerate() {
    if (!prompt) return;
    setLoading(true);
    setImages([]); 

    try {
      const finalPrompt = `${prompt}, ${style} style, 8k resolution, highly detailed`;
      const res = await fetch('/api/generate-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt }),
      });
      const data = await res.json();
      
      if (data.images && data.images.length > 0) {
        setImages(data.images);
        const newMemory: Memory = {
          id: Date.now(),
          url: data.images[0],
          prompt: prompt,
          style: style,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        const updatedHistory = [newMemory, ...history].slice(0, 20); 
        setHistory(updatedHistory);
        localStorage.setItem('aether_memories', JSON.stringify(updatedHistory));
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#030305] text-white font-sans overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-100">
      
      {/* --- BACKGROUND --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-violet-900/10 rounded-full blur-[120px] animate-pulse duration-[10000ms]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="w-full flex justify-between items-center px-6 md:px-12 py-6 z-50">
        {/* Left Side: Logo + Email */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.reload()}>
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-cyan-500 rounded-full blur-md opacity-50 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
              <div className="absolute w-full h-full border border-white/20 rounded-full group-hover:scale-110 transition duration-500"></div>
            </div>
            <span className="text-xl font-medium tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              Aether<span className="font-light text-gray-600">Labs</span>
            </span>
          </div>

          {/* DIVIDER & EMAIL LINK */}
          <div className="hidden md:flex items-center gap-6 pl-6 border-l border-white/10 h-8">
             <a href="mailto:rehansanjay28@gmail.com" className="flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-cyan-400 transition-colors">
               <div className="w-4 h-4"><Icons.Mail /></div>
               rehansanjay28@gmail.com
             </a>
          </div>
        </div>

        {/* Right Side: Status */}
        <div className="hidden md:flex items-center gap-4 text-xs font-mono text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            SYSTEMS: ONLINE
          </span>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center pt-10 md:pt-16 px-4">
        
        {/* --- HERO --- */}
        <div className="text-center max-w-4xl space-y-6 mb-12 relative">
          <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-white">
            The medium of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-violet-300">creation.</span>
          </h1>
        </div>

        {/* --- CONTROL BAR --- */}
        <div className="w-full max-w-3xl relative z-20 mb-10">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/50 to-violet-500/50 rounded-2xl blur opacity-30"></div>
          <div className="relative bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex flex-col md:flex-row items-center gap-2 shadow-2xl">
            <div className="relative group w-full md:w-auto">
              <select 
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="appearance-none bg-transparent text-sm font-medium text-gray-300 pl-4 pr-8 py-3 outline-none cursor-pointer hover:text-white transition w-full"
              >
                {styles.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 group-hover:text-white transition">▼</div>
            </div>
            <div className="w-[1px] h-6 bg-white/10 hidden md:block"></div>
            <div className="flex-grow w-full relative">
              <input 
                className="w-full bg-transparent px-4 py-3 text-white placeholder-gray-600 outline-none font-light"
                placeholder="Describe the unseen..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <button onClick={handleRandom} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-600 hover:text-cyan-400 transition" title="Randomize">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 8h.01"></path><path d="M8 8h.01"></path><path d="M8 16h.01"></path><path d="M16 16h.01"></path><path d="M12 12h.01"></path></svg>
              </button>
            </div>
            <button 
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className={`w-full md:w-auto px-8 py-3 rounded-xl font-medium tracking-wide transition-all duration-300 ${
                loading ? "bg-white/5 text-gray-500 cursor-not-allowed" : "bg-white text-black hover:bg-cyan-50 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              }`}
            >
              {loading ? "Synthesizing..." : "Generate"}
            </button>
          </div>
        </div>

        {/* --- MAIN DISPLAY --- */}
        {images.length > 0 && (
          <section className="w-full max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {images.map((img, i) => (
                <div key={i} className="group relative rounded-lg overflow-hidden bg-white/5 border border-white/10 aspect-[16/9]">
                  <img src={img} alt="Generated" className="w-full h-full object-cover transition duration-1000 group-hover:scale-105 group-hover:saturate-110" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                    <div className="flex justify-end">
                       <button onClick={() => window.open(img, '_blank')} className="bg-white hover:bg-cyan-50 text-black px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                         DOWNLOAD ASSET ⇩
                       </button>
                    </div>
                    <div>
                      <div className="text-xs text-cyan-400 font-mono mb-1">PROMPT_RECALL</div>
                      <p className="text-sm text-gray-200 leading-snug">{prompt}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* --- SECTION: WHAT'S NEW (NEURAL TIMELINE STYLE) --- */}
      <section className="w-full max-w-5xl mx-auto px-6 py-24 border-t border-white/5 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-violet-500/50"></div>
        
        <h2 className="text-3xl font-light text-center mb-4 text-white">What's New</h2>
        <p className="text-center text-gray-500 mb-20 max-w-lg mx-auto">Transforming ideas into high-fidelity assets through a new cognitive pipeline.</p>
        
        <div className="relative">
           {/* Center Timeline Line */}
           <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-1/2"></div>

           <div className="space-y-16">
             
             {/* Update 1: Chain of Thought */}
             <div className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center group">
               {/* Node Dot */}
               <div className="absolute left-[16px] md:left-1/2 top-0 md:top-1/2 w-2 h-2 bg-violet-500 rounded-full md:-translate-x-1/2 md:-translate-y-1/2 shadow-[0_0_10px_rgba(139,92,246,0.5)] z-10 group-hover:scale-150 transition duration-300"></div>
               
               <div className="pl-12 md:pl-0 md:w-[45%] md:text-right">
                 <h3 className="text-xl font-medium text-white mb-2 group-hover:text-violet-300 transition">Smart Logic Core</h3>
                 <div className="inline-block px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300 font-mono mb-2">UPDATE v2.1</div>
               </div>
               
               <div className="pl-12 md:pl-0 md:w-[45%]">
                 <p className="text-gray-400 text-sm leading-relaxed">
                   We integrated an <strong>LLM Chain-of-Thought</strong> layer. Instead of blindly generating, the system now intercepts your prompt, rewrites it for optimal lighting and texture, and then synthesizes the result.
                 </p>
               </div>
             </div>

             {/* Update 2: Memory */}
             <div className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center group">
               {/* Node Dot */}
               <div className="absolute left-[16px] md:left-1/2 top-0 md:top-1/2 w-2 h-2 bg-cyan-500 rounded-full md:-translate-x-1/2 md:-translate-y-1/2 shadow-[0_0_10px_rgba(6,182,212,0.5)] z-10 group-hover:scale-150 transition duration-300"></div>
               
               <div className="pl-12 md:pl-0 md:w-[45%] md:order-2">
                 <h3 className="text-xl font-medium text-white mb-2 group-hover:text-cyan-300 transition">Temporal Memory Bank</h3>
                 <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 font-mono mb-2">STORAGE PROTOCOL</div>
               </div>
               
               <div className="pl-12 md:pl-0 md:w-[45%] md:text-right md:order-1">
                 <p className="text-gray-400 text-sm leading-relaxed">
                   Never lose a creation again. The new <strong>Persistent Timeline</strong> automatically archives every generated asset to your local storage, allowing instant recall of previous prompts and settings.
                 </p>
               </div>
             </div>

             {/* Update 3: Styles */}
             <div className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center group">
               {/* Node Dot */}
               <div className="absolute left-[16px] md:left-1/2 top-0 md:top-1/2 w-2 h-2 bg-white rounded-full md:-translate-x-1/2 md:-translate-y-1/2 shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10 group-hover:scale-150 transition duration-300"></div>
               
               <div className="pl-12 md:pl-0 md:w-[45%] md:text-right">
                 <h3 className="text-xl font-medium text-white mb-2 group-hover:text-gray-200 transition">Multi-Modal Rendering</h3>
                 <div className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-gray-300 font-mono mb-2">VISUAL ENGINE</div>
               </div>
               
               <div className="pl-12 md:pl-0 md:w-[45%]">
                 <p className="text-gray-400 text-sm leading-relaxed">
                   Switched the synthesis engine to support <strong>Forced Artistic Protocols</strong>. You can now shift from Photorealism to Ethereal 3D renders without manual prompt engineering.
                 </p>
               </div>
             </div>

           </div>
        </div>
      </section>

      {/* --- PROMPT GUIDE --- */}
      <section className="w-full max-w-4xl mx-auto px-6 pb-24">
        <div className="bg-gradient-to-r from-gray-900 to-black border border-white/10 rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-cyan-900/20 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
             <div className="flex-1 space-y-4">
               <h3 className="text-xl font-bold text-white">Directive: Prompt Engineering</h3>
               <p className="text-gray-400 text-sm">To achieve optimal results, avoid generic nouns. Instead, describe the lighting, texture, and atmosphere.</p>
             </div>
             <div className="flex-1 w-full space-y-3">
               <div className="flex items-center gap-4 text-sm p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200">
                 <span className="font-mono text-xs opacity-50">BAD</span>
                 <span>"A futuristic city"</span>
               </div>
               <div className="flex items-center gap-4 text-sm p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-200">
                 <span className="font-mono text-xs opacity-50">GOOD</span>
                 <span>"Neo-Tokyo skyline, bioluminescent rain, cinematic lighting, 8k resolution"</span>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER: CONTACT & SOCIALS --- */}
      <footer className="w-full border-t border-white/5 bg-black pt-12 pb-32">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
           
           <div className="flex items-center gap-2">
             <div className="w-4 h-4 bg-gradient-to-tr from-cyan-500 to-violet-500 rounded-sm"></div>
             <span className="text-sm font-medium tracking-wide text-gray-400">RehanSanjay</span>
           </div>

           <div className="flex gap-6">
             <a href="https://github.com/Rehansanjay" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition transform hover:scale-110"><Icons.Github /></a>
             <a href="https://x.com/RehanSanjay_" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition transform hover:scale-110"><Icons.Twitter /></a>
             <a href="https://www.linkedin.com/in/rehansanjay-venkatesan-449925285/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition transform hover:scale-110"><Icons.Linkedin /></a>
             <a href="https://www.instagram.com/rehansanjay_/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition transform hover:scale-110"><Icons.Instagram /></a>
             <a href="mailto:rehansanjay28@gmail.com" className="text-gray-500 hover:text-white transition transform hover:scale-110"><Icons.Mail /></a>
           </div>

           <div className="text-xs text-gray-600 font-mono">
             © 2024 DESIGNED BY REHAN
           </div>
        </div>
      </footer>

      {/* --- HISTORY TIMELINE --- */}
      {history.length > 0 && (
        <section className="fixed bottom-0 left-0 w-full bg-[#0a0a0a]/80 backdrop-blur-xl border-t border-white/10 z-40 transition-transform duration-500 translate-y-[85%] hover:translate-y-0 group">
           <div className="w-full flex justify-center py-2 cursor-pointer group-hover:opacity-0 transition">
             <div className="w-16 h-1 bg-white/20 rounded-full"></div>
           </div>
           <div className="max-w-[1600px] mx-auto px-6 pb-6 pt-2">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-[10px] font-mono uppercase tracking-widest text-cyan-500 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
                 Timeline Memory
               </h3>
               <span className="text-[10px] text-gray-600 font-mono">{history.length} / 20 SLOTS</span>
             </div>
             <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
               {history.map((mem) => (
                 <div key={mem.id} onClick={() => recallMemory(mem)} className="flex-shrink-0 w-48 group/card cursor-pointer relative">
                   <div className="aspect-video rounded border border-white/10 overflow-hidden relative mb-2 group-hover/card:border-cyan-500 transition-colors">
                     <img src={mem.url} className="w-full h-full object-cover opacity-60 group-hover/card:opacity-100 transition duration-300" />
                   </div>
                   <div className="px-1">
                     <div className="text-[10px] text-gray-500 font-mono mb-0.5">{mem.timestamp}</div>
                     <div className="text-[11px] text-gray-300 truncate w-full group-hover/card:text-cyan-400 transition">{mem.prompt}</div>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </section>
      )}
    </main>
  );
}