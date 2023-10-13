import { motion } from "framer-motion";
import XIcon from "./X.svg";
import circleIcon from "./circle.svg";

const GameSymbolVariant = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
  },
};

export const X = ({ size }) => {
  return (
    <motion.div
      variants={GameSymbolVariant}
      initial="initial"
      animate="animate"
      className={`w-[85px] aspect-square pointer-events-none ${
        size === "small" ? "w-16" : ""
      }`}
    >
      <img src={XIcon} className="w-full h-full" />
    </motion.div>
  );
};

export const O = ({ size }) => {
  return (
    <motion.div
      variants={GameSymbolVariant}
      initial="initial"
      animate="animate"
      className={`w-12 h-12 pointer-events-none ${
        size === "small" ? "w-11" : ""
      }`}
    >
      <img src={circleIcon} className="w-full h-full" />
    </motion.div>
  );
};
