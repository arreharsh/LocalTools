"use client";

import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { useRouter } from "next/navigation";


export function Showcase() {
  const router = useRouter();
  // Using a high-quality screenshot of a modern tool interface that resembles localtools.app
  const ScreenVideoUrl = "https://ik.imagekit.io/arreharsh/localtools.mp4";
  const screenshotUrl = "https://ik.imagekit.io/arreharsh/Screenshot.png?updatedAt=1768648533036";
  const MobileScreenshotUrl = "https://ik.imagekit.io/arreharsh/IMG_3505.PNG";

  return (
    <section className="py-2 md:py-16 bg-background relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-black/5 blur-[160px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6">
       

        <div className="relative flex flex-col items-center justify-center h-screen max-h-screen">
          
          {/* PC / Desktop - The Main Frame */}
          <motion.div onClick={() => router.push('/tools')}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-[90vw] md:max-w-[60vw]"
          >
            <Tilt tiltMaxAngleX={1} tiltMaxAngleY={1} scale={1} transitionSpeed={2500}>
              {/* Monitor Frame with White Shadow */}
              <div className="relative p-2 md:p-3 bg-zinc-800 rounded-2xl md:rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.12)] dark:shadow-[0_0_80px_rgba(255,255,255,0.08)] border border-white/10">
                <div className="relative aspect-video bg-zinc-950 rounded-xl md:rounded-[1.8rem] overflow-hidden group border border-white/5">
                  <video 
                    src={ScreenVideoUrl} 
                    autoPlay 
                    loop 
                    muted 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
                  
                  {/* Top Bar UI */}
                  <div className="absolute top-0 left-0 right-0 h-8 md:h-12 bg-white/5 backdrop-blur-md border-b border-white/5 flex items-center px-4 md:px-6 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500/50" />
                      <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-500/50" />
                      <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500/50" />
                    </div>
                    <div className="mx-auto w-1/3 h-4 bg-white/5 rounded-md flex items-center justify-center">
                      <span className="text-[8px] text-white/20 tracking-widest">localtools.app</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Monitor Stand */}
              <div className="relative w-32 md:w-48 h-4 md:h-6 bg-zinc-800 mx-auto -mt-1 border-x border-b border-white/10" />
              <div className="relative w-48 md:w-72 h-2 md:h-3 bg-zinc-800 mx-auto rounded-t-xl border-t border-x border-white/10" />
            </Tilt>
          </motion.div>

          {/* Tablet - Floating Left */}
          <motion.div onClick={() => router.push('/tools')}
            initial={{ opacity: 0, x: -60, y: 40 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-[-2%] md:left-[5%] bottom-[5%] md:bottom-[10%] z-20 w-[35%] md:w-[30%] max-w-[400px]" >
            <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} scale={1.05} transitionSpeed={2000}>
              <div className="relative aspect-[4/3] bg-zinc-900 rounded-2xl md:rounded-[2.5rem] p-2 md:p-3 border border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.18)] dark:shadow-[0_30px_60px_-15px_rgba(255,255,255,0.1)]">
                <div className="w-full h-full bg-zinc-950 rounded-xl md:rounded-[1.8rem] overflow-hidden group border border-white/10">
                  <img 
                    src={screenshotUrl} 
                    alt="Tablet Interface" 
                    className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
            </Tilt>
          </motion.div>

          {/* Mobile - Floating Right */}
          <motion.div
            initial={{ opacity: 0, x: 60, y: 60 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-[-2%] md:right-[10%] bottom-[-5%] md:bottom-[0%] z-30 w-[22%] md:w-[15%] max-w-[240px]" >
            <Tilt tiltMaxAngleX={12} tiltMaxAngleY={12} scale={1.1} transitionSpeed={2000}>
              <div className="relative  aspect-[9/19] bg-zinc-900 rounded-[1.5rem] md:rounded-[1.8rem] p-1.5 md:p-2.5 border border-white/20 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.18)] dark:shadow-[0_40px_80px_-20px_rgba(255,255,255,0.15)]">
                <div className="w-full md:h-full bg-zinc-950 rounded-[1rem] md:rounded-[1.2rem] overflow-hidden group border border-white/10 relative">
                  {/* Dynamic Island */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[35%] h-[4%] bg-zinc-900 rounded-full z-10" />
                  
                  <img 
                    src={MobileScreenshotUrl} 
                    alt="Mobile Interface" 
                    className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-1000"
                  />
                </div>
              </div>
            </Tilt>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
