import React from "react";
import { motion } from "framer-motion";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import "./../styles/FlightTransition.css";

export default function FlightTransition() {
  const screenWidth = window.innerWidth;

  return (
    <div className="flight-overlay">

      {/* Background sky */}
      <motion.div
        className="sky-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* CLOUD 1 */}
      <motion.img
        src={CLOUD1}
        className="cloud cloud1"
        initial={{ x: -400 }}
        animate={{ x: screenWidth + 500 }}
        transition={{ duration: 4, ease: "linear" }}
      />

      {/* CLOUD 2 */}
      <motion.img
        src={CLOUD2}
        className="cloud cloud2"
        initial={{ x: -500 }}
        animate={{ x: screenWidth + 600 }}
        transition={{ duration: 6, ease: "linear" }}
      />

      {/* CLOUD 3 */}
      <motion.img
        src={CLOUD3}
        initial={{ x: -450 }}
        animate={{ x: screenWidth + 700 }}
        transition={{ duration: 5, ease: "linear" }}
      />

      {/* PLANE */}
      <motion.div
        className="plane"
        initial={{ x: -200, y: 120, rotate: -10 }}
        animate={{ 
          x: screenWidth + 300,
          y: -200,
          rotate: 15
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <FlightTakeoffIcon sx={{ fontSize: 110, color: "#d11a1a" }} />
      </motion.div>

    </div>
  );
}

const CLOUD1 =
"data:image/svg+xml;utf8,\
<svg width='260' height='150' xmlns='http://www.w3.org/2000/svg'>\
<path d='M130 120c-40 0-60-20-60-40s10-40 40-40c10 0 20 3 27 9 5-10 15-15 26-15 20 0 35 15 35 35s-15 35-35 45z' fill='white' opacity='0.95'/>\
</svg>";

const CLOUD2 =
"data:image/svg+xml;utf8,\
<svg width='330' height='180' xmlns='http://www.w3.org/2000/svg'>\
<path d='M260 130c-50 0-70-20-70-40s10-40 50-40c30 0 50 20 50 40s-20 40-50 40z' fill='white' opacity='0.95'/>\
</svg>";

const CLOUD3 =
"data:image/svg+xml;utf8,\
<svg width='220' height='120' xmlns='http://www.w3.org/2000/svg'>\
<path d='M180 80c-30 0-40-15-40-25s10-25 40-25c30 0 40 15 40 25s-10 25-40 25z' fill='white' opacity='0.95'/>\
</svg>";