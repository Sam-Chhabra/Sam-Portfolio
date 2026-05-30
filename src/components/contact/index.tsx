import { MotionValue, motion, useAnimationControls } from "framer-motion";
import { Linkedin, Mail, Github } from "lucide-react";
import { useEffect, useState } from "react";
import Magnetic from "../Magnetic";

type ContactSectionProps = {
  isContactInView: boolean;
  isMobile: boolean;
  backgroundGradient: MotionValue<string>;
};

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: custom * 0.2,
      type: "tween",
      useNativeDriver: true
    },
  }),
};

const Contact: React.FC<ContactSectionProps> = ({
  isContactInView,
  isMobile,
}) => {
  const contactControls = useAnimationControls();

  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isMobile) return; // On mobile, skip re-animation to prevent flashing
    if (isContactInView && !hasAnimated) {
      contactControls.start("visible");
      setHasAnimated(true);
    } else if (!isContactInView && hasAnimated) {
      contactControls.start("hidden");
      setHasAnimated(false);
    }
  }, [isContactInView, contactControls, hasAnimated, setHasAnimated, isMobile]);

  const initialState = isMobile ? "visible" : "hidden";

  return (
    <motion.div
      animate={contactControls}
      initial={initialState}
      className={`w-screen contact-bg ${
        isMobile ? "before:bg-none after:bg-none" : "before:block after:block"
      } min-h-screen overflow-hidden flex flex-col justify-end items-center gap-y-4 relative z-[2]`}
      style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}
    >
      <motion.h2
        custom={0}
        variants={fadeInUpVariants}
        className="poppins-medium text-2xl text-gray-3 px-4 text-center"
      >
        Want to collaborate?
      </motion.h2>
      <motion.h1
        custom={1}
        variants={fadeInUpVariants}
        className={`khula-semibold text-center px-4 ${isMobile ? "text-5xl" : "text-7xl"}`}
      >
        Let's have a chat!
      </motion.h1>
      <motion.div
        custom={2}
        variants={fadeInUpVariants}
        className={`flex flex-row gap-x-6 items-center ${isMobile ? "mt-[8vh]" : "mt-[14vh]"}`}
        style={{ willChange: "transform, opacity", backfaceVisibility: "hidden", transform: "translateZ(0)" }}
      >
        <Magnetic>
          <a
            href="mailto:samchhabraa@gmail.com"
            className="flex gap-x-2 rounded-full border-dark border-2 px-2 py-1"
          >
            <Mail />
            Email
          </a>
        </Magnetic>
        <Magnetic>
          <a
            href="https://www.linkedin.com/in/samchhabraa/"
            target="_blank"
            className="flex gap-x-2 rounded-full border-dark border-2 px-2 py-1"
          >
            <Linkedin />
            LinkedIn
          </a>
        </Magnetic>
        <Magnetic>
          <a
            href="https://github.com/Sam-Chhabra"
            target="_blank"
            className="flex gap-x-2 rounded-full border-dark border-2 px-2 py-1"
          >
            <Github />
            GitHub
          </a>
        </Magnetic>
      </motion.div>
      <motion.div
        custom={3}
        variants={fadeInUpVariants}
        className={`flex flex-col items-center ${isMobile ? "mt-[3vh]" : "mt-[5vh]"}`}
        style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}
      >
        <p className="poppins-regular text-2xl">sc</p>
        <p className="poppins-extralight text-2xl">Sam Chhabra</p>

        <p className={`poppins-light px-4 text-gray-3 tracking-[calc(-1rem*0.03)] select-none mb-1 text-center ${isMobile ? "mt-[4vh]" : "mt-[8vh]"}`}>
          © Sam Chhabra {new Date().getFullYear()}. All rights reserved.
          Location: Italy, UK
        </p>
        <p className={`poppins-light px-4 text-gray-3 select-none tracking-[calc(-1rem*0.03)] max-w-[500px] text-center ${isMobile ? "mb-4" : "mb-8"}`}>
          This site showcases my personal projects and professional work.
          Content may not be used without permission.
        </p>
      </motion.div>
    </motion.div>
  );
};
export default Contact;
