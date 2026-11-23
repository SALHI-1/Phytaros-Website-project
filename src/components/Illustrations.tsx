"use client";

import { useId } from "react";
import { motion } from "motion/react";

export function TowerIllustration({
  blocks,
  variant = "card",
  className = "",
}: {
  blocks: 4 | 8;
  variant?: "hero" | "card";
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const height = blocks === 8 ? 832 : 496;
  const baseY = 54 + blocks * 84 + 6;
  const indices = Array.from({ length: blocks }, (_, idx) => idx);

  const blockGradId = `block-grad-${uid}`;
  const capGradId = `cap-grad-${uid}`;
  const baseGradId = `base-grad-${uid}`;
  const podGradId = `pod-grad-${uid}`;

  const isHero = variant === "hero";

  return (
    <svg
      role="img"
      aria-label={`Phytaros tower of ${blocks} stacked modular blocks with plants`}
      viewBox={`0 0 360 ${height}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={blockGradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={isHero ? "#1b4938" : "#0b2219"} />
          <stop offset="32%" stopColor={isHero ? "#2c6b53" : "#184635"} />
          <stop offset="72%" stopColor={isHero ? "#235844" : "#113326"} />
          <stop offset="100%" stopColor={isHero ? "#163b2d" : "#091c15"} />
        </linearGradient>

        <linearGradient id={capGradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#145f6c" />
          <stop offset="35%" stopColor="#268fa0" />
          <stop offset="100%" stopColor="#125662" />
        </linearGradient>

        <linearGradient id={baseGradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={isHero ? "#184132" : "#0a1e17"} />
          <stop offset="35%" stopColor={isHero ? "#27614b" : "#164030"} />
          <stop offset="100%" stopColor={isHero ? "#14372a" : "#081913"} />
        </linearGradient>

        <radialGradient id={podGradId} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#d7fa7a" />
          <stop offset="65%" stopColor="#b6ec3d" />
          <stop offset="100%" stopColor="#89c41f" />
        </radialGradient>
      </defs>

      {/* Soft ground shadow on cards */}
      {!isHero && (
        <ellipse
          cx="180"
          cy={baseY + 86}
          rx="128"
          ry="10"
          fill="#0d281e"
          opacity="0.12"
        />
      )}

      {/* SmartCap top */}
      <rect
        x="118"
        y="8"
        width="124"
        height="38"
        rx="19"
        fill={`url(#${capGradId})`}
      />
      <rect
        x="134"
        y="12"
        width="52"
        height="4"
        rx="2"
        fill="#ffffff"
        opacity="0.22"
      />
      <motion.circle
        cx="180"
        cy="27"
        r="12"
        fill="#b6ec3d"
        opacity="0.24"
        animate={{ scale: [1, 1.35, 1], opacity: [0.24, 0.05, 0.24] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx="180" cy="27" r="8.5" fill={`url(#${podGradId})`} />

      {/* Modular blocks */}
      {indices.map((i) => {
        const y = 54 + i * 84;
        const isLeft = i % 2 === 0;

        return (
          <motion.g
            key={i}
            initial={isHero ? { opacity: 0, y: -12 } : false}
            animate={isHero ? { opacity: 1, y: 0 } : undefined}
            transition={{
              duration: 0.45,
              delay: (blocks - 1 - i) * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <rect
              x="100"
              y={y}
              width="160"
              height="78"
              rx="12"
              fill={`url(#${blockGradId})`}
            />
            {/* Top machined lip highlight */}
            <rect
              x="110"
              y={y + 4}
              width="140"
              height="2.5"
              rx="1.25"
              fill="#eef5e8"
              opacity={isHero ? "0.14" : "0.12"}
            />

            {isLeft ? (
              <>
                <ellipse
                  cx="62"
                  cy={y + 18}
                  rx="30"
                  ry="12"
                  transform={`rotate(-28 62 ${y + 18})`}
                  fill="#dfedd0"
                />
                <ellipse
                  cx="78"
                  cy={y + 4}
                  rx="20"
                  ry="9"
                  transform={`rotate(56 92 ${y + 4})`}
                  fill="#c9e0b1"
                />
                <circle
                  cx="92"
                  cy={y + 40}
                  r="16"
                  fill={`url(#${podGradId})`}
                />
              </>
            ) : (
              <>
                <ellipse
                  cx="298"
                  cy={y + 18}
                  rx="30"
                  ry="12"
                  transform={`rotate(28 298 ${y + 18})`}
                  fill="#dfedd0"
                />
                <ellipse
                  cx="282"
                  cy={y + 4}
                  rx="20"
                  ry="9"
                  transform={`rotate(-56 268 ${y + 4})`}
                  fill="#c9e0b1"
                />
                <circle
                  cx="268"
                  cy={y + 40}
                  r="16"
                  fill={`url(#${podGradId})`}
                />
              </>
            )}
          </motion.g>
        );
      })}

      {/* Reservoir base */}
      <rect
        x="55"
        y={baseY}
        width="250"
        height="84"
        rx="16"
        fill={`url(#${baseGradId})`}
      />
      <rect
        x="70"
        y={baseY + 5}
        width="220"
        height="2.5"
        rx="1.25"
        fill="#eef5e8"
        opacity="0.14"
      />
      {/* Water level indicator */}
      <rect
        x="75"
        y={baseY + 34}
        width="210"
        height="10"
        rx="5"
        fill="#0b2429"
        opacity="0.5"
      />
      <motion.rect
        x="75"
        y={baseY + 34}
        width="178"
        height="10"
        rx="5"
        fill="#5ec6d6"
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

export function SmartCapIllustration({
  className = "",
}: {
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const bodyGrad = `sc-body-${uid}`;
  const lensGrad = `sc-lens-${uid}`;
  const blockGrad = `sc-block-${uid}`;

  return (
    <svg
      role="img"
      aria-label="SmartCap: a pill-shaped smart cap with a camera lens sitting on top of a tower block"
      viewBox="0 0 520 420"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={bodyGrad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#72d3e2" />
          <stop offset="55%" stopColor="#3aa6b8" />
          <stop offset="100%" stopColor="#1a7888" />
        </linearGradient>
        <radialGradient id={lensGrad} cx="35%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#264237" />
          <stop offset="55%" stopColor="#0b1a14" />
          <stop offset="100%" stopColor="#050d0a" />
        </radialGradient>
        <linearGradient id={blockGrad} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#184232" />
          <stop offset="40%" stopColor="#2a6850" />
          <stop offset="100%" stopColor="#14372a" />
        </linearGradient>
      </defs>

      {/* Tower block underneath */}
      <rect
        x="150"
        y="250"
        width="220"
        height="150"
        rx="18"
        fill={`url(#${blockGrad})`}
      />
      <circle cx="150" cy="320" r="22" fill="#b6ec3d" />
      <ellipse
        cx="108"
        cy="290"
        rx="38"
        ry="14"
        transform="rotate(-28 108 290)"
        fill="#dfedd0"
      />

      {/* SmartCap pill body */}
      <rect
        x="60"
        y="80"
        width="400"
        height="170"
        rx="85"
        fill={`url(#${bodyGrad})`}
      />
      <rect
        x="110"
        y="94"
        width="300"
        height="8"
        rx="4"
        fill="#ffffff"
        opacity="0.25"
      />

      {/* Lens housing */}
      <circle cx="260" cy="165" r="56" fill="#0d281e" opacity="0.4" />
      <circle cx="260" cy="165" r="52" fill={`url(#${lensGrad})`} />
      <circle
        cx="260"
        cy="165"
        r="52"
        fill="none"
        stroke="#b6ec3d"
        strokeWidth="7"
      />
      <circle
        cx="260"
        cy="165"
        r="34"
        fill="none"
        stroke="#5ec6d6"
        strokeWidth="1.5"
        opacity="0.45"
      />
      <circle cx="242" cy="148" r="11" fill="#eef5e8" opacity="0.9" />
      <circle cx="276" cy="182" r="4" fill="#5ec6d6" opacity="0.65" />

      {/* Status LEDs */}
      <motion.circle
        cx="140"
        cy="165"
        r="10"
        fill="#b6ec3d"
        animate={{ opacity: [1, 0.35, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx="380" cy="165" r="10" fill="#eef5e8" opacity="0.9" />

      {/* Telemetry waves */}
      <motion.path
        d="M180 40 Q260 0 340 40"
        fill="none"
        stroke="#b6ec3d"
        strokeWidth="6"
        strokeLinecap="round"
        animate={{ opacity: [0.25, 1, 0.25] }}
        transition={{
          duration: 2.4,
          delay: 0.3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.path
        d="M215 60 Q260 36 305 60"
        fill="none"
        stroke="#b6ec3d"
        strokeWidth="6"
        strokeLinecap="round"
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

const GROVE_CENTERS = [
  { cx: 220, cy: 210 },
  { cx: 540, cy: 210 },
  { cx: 380, cy: 470 },
];

// Smooth waypoints sampled around the Sentinel closed loop
const SENTINEL_X = [650, 565, 380, 195, 110, 195, 380, 565, 650];
const SENTINEL_Y = [330, 178, 150, 178, 330, 495, 525, 495, 330];

export function PhytarosParkIllustration({
  className = "",
}: {
  className?: string;
}) {
  const towerCount = 14;
  const radius = 95;

  return (
    <svg
      role="img"
      aria-label="Top view of a Phytaros Park: three groves of towers around central nodes, with a roaming Sentinel camera path"
      viewBox="0 0 760 640"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="10"
        y="10"
        width="740"
        height="620"
        rx="28"
        fill="none"
        stroke="#878c80"
        strokeWidth="3"
        strokeDasharray="14 10"
      />
      <path
        d="M110 330 C110 90 650 90 650 330 C650 590 110 590 110 330 Z"
        fill="none"
        stroke="#35630a"
        strokeWidth="4"
        strokeDasharray="4 14"
        strokeLinecap="round"
        opacity="0.85"
      />

      {GROVE_CENTERS.map((grove, groveIdx) => {
        const nodes = Array.from({ length: towerCount }, (_, i) => {
          const angle = (i * 2 * Math.PI) / towerCount;
          return {
            x: Number((grove.cx + radius * Math.cos(angle)).toFixed(1)),
            y: Number((grove.cy + radius * Math.sin(angle)).toFixed(1)),
          };
        });

        return (
          <g key={groveIdx}>
            {/* Subtle grove halo */}
            <circle
              cx={grove.cx}
              cy={grove.cy}
              r={radius + 16}
              fill="#0d281e"
              opacity="0.035"
            />
            {nodes.map((n, i) => (
              <line
                key={`line-${i}`}
                x1={grove.cx}
                y1={grove.cy}
                x2={n.x}
                y2={n.y}
                stroke="#d2d0c2"
                strokeWidth="2.5"
              />
            ))}
            {nodes.map((n, i) => (
              <g key={`tower-${i}`}>
                <circle cx={n.x} cy={n.y} r="15" fill="#0d281e" />
                <circle cx={n.x} cy={n.y} r="5.5" fill="#b6ec3d" />
              </g>
            ))}
            <circle
              cx={grove.cx}
              cy={grove.cy}
              r="34"
              fill="#1a7888"
              opacity="0.16"
            />
            <circle cx={grove.cx} cy={grove.cy} r="26" fill="#1a7888" />
            <circle cx={grove.cx} cy={grove.cy} r="8" fill="#5ec6d6" />
          </g>
        );
      })}

      {/* Animated roaming Sentinel camera following the loop */}
      <motion.g
        initial={{ x: 650, y: 330 }}
        animate={{ x: SENTINEL_X, y: SENTINEL_Y }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <circle r="30" fill="#b6ec3d" opacity="0.22" />
        <rect
          x="-22"
          y="-18"
          width="44"
          height="36"
          rx="10"
          fill="#b6ec3d"
          stroke="#0d281e"
          strokeWidth="4"
        />
        <circle cx="0" cy="0" r="6" fill="#0d281e" />
      </motion.g>
    </svg>
  );
}

export function ConceptIllustration({
  kind,
  className = "",
}: {
  kind: "sculpture" | "loop" | "field" | "sun";
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");

  if (kind === "sculpture") {
    return (
      <svg
        role="img"
        aria-label="Sculpture tower concept"
        viewBox="0 0 200 160"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`sculp-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1b4d3a" />
            <stop offset="100%" stopColor="#0b2219" />
          </linearGradient>
        </defs>
        <path
          d="M100 10 C150 40 150 120 100 150 C50 120 50 40 100 10 Z"
          fill={`url(#sculp-${uid})`}
        />
        <circle cx="80" cy="50" r="11" fill="#b6ec3d" />
        <circle cx="120" cy="75" r="11" fill="#b6ec3d" />
        <circle cx="85" cy="105" r="11" fill="#b6ec3d" />
        <ellipse
          cx="146"
          cy="44"
          rx="24"
          ry="10"
          transform="rotate(-30 146 44)"
          fill="#dfedd0"
        />
      </svg>
    );
  }

  if (kind === "loop") {
    return (
      <svg
        role="img"
        aria-label="Closed plastic loop concept"
        viewBox="0 0 200 160"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M60 80 A40 40 0 1 1 100 120"
          fill="none"
          stroke="#1a7888"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M140 80 A40 40 0 1 1 100 40"
          fill="none"
          stroke="#b6ec3d"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <rect x="90" y="62" width="20" height="36" rx="6" fill="#0d281e" />
      </svg>
    );
  }

  if (kind === "field") {
    return (
      <svg
        role="img"
        aria-label="Pro field tower concept"
        viewBox="0 0 200 160"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="10" y="128" width="180" height="16" rx="8" fill="#dfedd0" />
        {[26, 86, 146].map((x) => (
          <g key={x}>
            <rect x={x} y="30" width="28" height="98" rx="10" fill="#0d281e" />
            <circle cx={x + 14} cy="56" r="7" fill="#b6ec3d" />
            <circle cx={x + 14} cy="92" r="7" fill="#b6ec3d" />
          </g>
        ))}
      </svg>
    );
  }

  return (
    <svg
      role="img"
      aria-label="Off-grid solar park concept"
      viewBox="0 0 200 160"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="100" cy="64" r="30" fill="#c86d4b" opacity="0.22" />
      <circle cx="100" cy="64" r="24" fill="#b6ec3d" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = Number((100 + 38 * Math.cos(rad)).toFixed(1));
        const y1 = Number((64 + 38 * Math.sin(rad)).toFixed(1));
        const x2 = Number((100 + 52 * Math.cos(rad)).toFixed(1));
        const y2 = Number((64 + 52 * Math.sin(rad)).toFixed(1));
        return (
          <line
            key={deg}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#c86d4b"
            strokeWidth="7"
            strokeLinecap="round"
          />
        );
      })}
      <rect x="40" y="126" width="120" height="22" rx="6" fill="#1a7888" />
    </svg>
  );
}
