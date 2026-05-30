import { useEffect, useState, useRef, useCallback, useMemo, lazy, Suspense } from "react";
import "./assets/globals.scss";
import { FlipWords } from "./components/ui/flip-words";
import Navbar from "./components/hero/Navbar";
import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import MouseGradient from "./components/MouseGradient";
import { debounce } from "lodash";
import BackgroundSVG from "./components/hero/BackgroundSVG";
import { useColorAnimation } from "./hooks/useColorAnimation";
import SectionSpacer from "./components/SectionSpacer";
import { useIsTouchDevice } from "./hooks/useIsTouchDevice";
import Loader from "./components/Loader";
import { ReactLenis } from "@studio-freight/react-lenis";

const About = lazy(() => import("./components/about"));
const Projects = lazy(() => import("./components/projects"));
const Contact = lazy(() => import("./components/contact"));

let currentBgColor = "";
const setBgColorSafe = (color: string) => {
  if (currentBgColor === color) return;
  currentBgColor = color;
  document.body.style.backgroundColor = color;
  const root = document.getElementById("root");
  if (root) root.style.backgroundColor = color;
  document.documentElement.style.backgroundColor = color;
};

function App() {
  const [dimensions, setDimensions] = useState({ 
    width: typeof window !== "undefined" ? window.innerWidth : 0, 
    height: typeof window !== "undefined" ? window.innerHeight : 0 
  });
  const dimensionsRef = useRef({ 
    width: typeof window !== "undefined" ? window.innerWidth : 0, 
    height: typeof window !== "undefined" ? window.innerHeight : 0 
  });
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const isMobile = dimensions.width <= 768;

  const isTouchDevice = useIsTouchDevice();

  // ----- Dimension update ----- //
  const updateDimensions = useCallback(
    debounce(() => {
      const newDimensions = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      dimensionsRef.current = newDimensions;
      setDimensions(newDimensions);
    }, 200),
    [],
  );

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  // ----- Scroll animations ----- //
  const { scrollYProgress } = useScroll();
  const backgroundGradient = useMotionValue(
    "radial-gradient(circle, #111111 0%, #000000 65%)",
  );
  const textColor = useMotionValue("#FFFFFF");
  const svgOpacity = useMotionValue(1);

  const handleScroll = useCallback(
    (latest: number) => {
      requestAnimationFrame(() => {
        const progress = !isMobile
          ? Math.max(0, Math.min((latest - 0.1) / 0.1, 1))
          : Math.max(0, Math.min((latest - 0.01) / 0.06, 1));

        const startColor = [0, 0, 0];
        const endColor = [255, 255, 255]; // #FFFFFF

        const interpolateColor = (start: number[], end: number[]): string =>
          start
            .map((channel, i) =>
              Math.round(channel + (end[i] - channel) * progress),
            )
            .join(", ");

        const newGradient = `radial-gradient(circle, rgb(${interpolateColor(
          [17, 17, 17],
          endColor,
        )}) 0%, rgb(${interpolateColor(startColor, endColor)}) 65%)`;
        backgroundGradient.set(newGradient);

        if (progress < 0.1) {
          setBgColorSafe("#000000");
        } else if (progress > 0.3) {
          setBgColorSafe("#ffffff");
        }

        const txtColor = `rgb(${255 - Math.round(255 * progress)}, ${
          255 - Math.round(255 * progress)
        }, ${255 - Math.round(255 * progress)})`;
        textColor.set(txtColor);
        const newOpacity = 1 - progress * 3;
        svgOpacity.set(newOpacity);
      });
    },
    [isMobile],
  );

  useMotionValueEvent(scrollYProgress, "change", handleScroll);

  // ----- Color Animation ----- //
  const { hue1, hue2 } = useColorAnimation();

  // ----- Loading Animation ----- //
  const [isLoading, setIsLoading] = useState(true);

  const landingSectionVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
        delay: 0.5,
        type: "tween",
        useNativeDriver: true
      },
    },
  };

  const initialState = isMobile ? "visible" : "hidden";

  return (
    <ReactLenis root>
      <Loader onLoadingComplete={() => setIsLoading(false)} />

      <div style={{ visibility: isLoading ? "hidden" : "visible" }}>
        <MouseGradient isMobile={isMobile} />
        <motion.div
          style={{ background: backgroundGradient }}
          className={`w-screen overflow-hidden h-screen flex flex-col justify-center items-center ${
            isMobile ? "relative" : ""
          }`}
        >
          <BackgroundSVG
            width={dimensions.width}
            height={dimensions.height}
            isMobile={isMobile}
            svgOpacity={svgOpacity}
            isLoading={isLoading}
          />
          <Navbar />
          <motion.div
            initial={initialState}
            animate={isLoading ? "hidden" : "visible"}
            variants={landingSectionVariants}
            className="flex justify-center items-center relative z-10 flex-col mt-8"
            style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}
          >
            <motion.h1
              className="md:text-[80px] max-sm:text-[10.5vw] sm:text-[10vw] text-light khula-extrabold w-full max-w-[732px] px-4 text-center leading-tight md:leading-[85px]"
              style={{
                transform: isMobile
                  ? "none"
                  : useTransform(
                      scrollYProgress,
                      [0, 0.5],
                      ["translateY(0px)", "translateY(-200px)"]
                    ),
                opacity: isMobile
                  ? useTransform(scrollYProgress, [0, 0.08], [1, 0])
                  : useTransform(scrollYProgress, [0, 0.3], [1, 0]),
                textShadow: "0px 0px 6px rgba(255,255,255,0.25)",
                willChange: "transform, opacity",
                backfaceVisibility: "hidden",
              }}
            >
              Hi, I'm Sam. <br />
              I build <FlipWords words={["scalable", "secure", "modern"]} className="text-light text-center md:text-[80px] max-sm:text-[10.5vw] sm:text-[10vw]" /> systems powered by{" "}
              <motion.span
                style={{
                  backgroundImage: useTransform(
                    [hue1, hue2],
                    ([h1, h2]) =>
                      `linear-gradient(90deg, hsl(${h1}, 100%, 50%), hsl(${h2}, 100%, 50%))`
                  ),
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                AI and cloud.
              </motion.span>
            </motion.h1>
            <motion.p
              className="poppins-regular text-lg mt-4 max-w-[390px] text-gray-2 max-sm:text-[4vw] px-4 text-center leading-[123%]"
              style={{
                transform: isMobile
                  ? "none"
                  : useTransform(
                      scrollYProgress,
                      [0, 0.5],
                      ["translateY(0px)", "translateY(-200px)"]
                    ),
                opacity: isMobile
                  ? useTransform(scrollYProgress, [0, 0.08], [1, 0])
                  : useTransform(scrollYProgress, [0, 0.3], [1, 0]),
                willChange: "transform, opacity",
                backfaceVisibility: "hidden",
              }}
            >
              Full stack engineer with experience across distributed systems.
            </motion.p>
          </motion.div>
        </motion.div>
        <div ref={aboutRef} id="about" style={{ position: "relative", zIndex: 5 }}>
          <Suspense fallback={<div style={{ minHeight: "100vh", background: "#ffffff" }}></div>}>
            <About
              isAboutInView={useInView(aboutRef, { amount: 0.3 })}
              isMobile={isMobile}
              backgroundGradient={backgroundGradient}
            />
          </Suspense>
        </div>

        <SectionSpacer height={isMobile ? 100 : 300} backgroundGradient={backgroundGradient} />

        <div ref={projectsRef} id="projects" className="relative" style={{ position: "relative", zIndex: 5 }}>
          <Suspense fallback={<div style={{ minHeight: "100vh", background: "#ffffff" }}></div>}>
            <Projects
              isProjectsInView={useInView(projectsRef, {
                amount: isTouchDevice ? 0.1 : 0.3,
              })}
              isMobile={isMobile}
              backgroundGradient={backgroundGradient}
            />
          </Suspense>
        </div>

        <div ref={contactRef} id="contact" className="relative" style={{ position: "relative", zIndex: 5 }}>
          <Suspense fallback={<div style={{ minHeight: "100vh", background: "#ffffff" }}></div>}>
            <Contact
              isContactInView={useInView(contactRef, { amount: 0.5 })}
              isMobile={isMobile}
              backgroundGradient={backgroundGradient}
            />
          </Suspense>
        </div>
      </div>
    </ReactLenis>
  );
}

export default App;
