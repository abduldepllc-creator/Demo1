import { useId } from "react";
import { cn, isDark, shade } from "@/lib/utils";

type SoapBlockProps = {
  color: string;
  translucent?: boolean;
  className?: string;
  /** Show the embossed "SOAPBASE" stamp on top */
  stamp?: boolean;
  shadow?: boolean;
};

/**
 * An isometric soap bar drawn in SVG, coloured per product.
 * Uses only useId, which is allowed in both server and client components.
 */
export function SoapBlock({
  color,
  translucent = false,
  className,
  stamp = true,
  shadow = true,
}: SoapBlockProps) {
  // Unique per instance: shared ids break when the first copy sits in a display:none subtree.
  const id = `sb${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const dark = isDark(color);

  const top = shade(color, dark ? 0.22 : 0.45);
  const topEdge = shade(color, dark ? 0.08 : 0.15);
  const left = shade(color, dark ? 0.06 : -0.04);
  const leftDeep = shade(color, dark ? -0.2 : -0.16);
  const right = shade(color, dark ? -0.25 : -0.18);
  const rightDeep = shade(color, dark ? -0.45 : -0.3);
  const stampColor = dark ? "#ffffff" : shade(color, -0.35);
  const faceOpacity = translucent ? 0.82 : 1;

  return (
    <svg
      viewBox="0 0 240 190"
      className={cn("h-auto w-full overflow-visible", className)}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-top`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={top} />
          <stop offset="100%" stopColor={topEdge} />
        </linearGradient>
        <linearGradient id={`${id}-left`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={left} />
          <stop offset="100%" stopColor={leftDeep} />
        </linearGradient>
        <linearGradient id={`${id}-right`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={right} />
          <stop offset="100%" stopColor={rightDeep} />
        </linearGradient>
        <radialGradient id={`${id}-shadow`}>
          <stop offset="0%" stopColor="#0d2c50" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0d2c50" stopOpacity="0" />
        </radialGradient>
      </defs>

      {shadow && <ellipse cx="122" cy="172" rx="108" ry="14" fill={`url(#${id}-shadow)`} />}

      {/* Faces */}
      <polygon
        points="20,60 145,112 145,160 20,108"
        fill={`url(#${id}-left)`}
        fillOpacity={faceOpacity}
      />
      <polygon
        points="145,112 220,72 220,120 145,160"
        fill={`url(#${id}-right)`}
        fillOpacity={faceOpacity}
      />
      <polygon
        points="95,20 220,72 145,112 20,60"
        fill={`url(#${id}-top)`}
        fillOpacity={translucent ? 0.9 : 1}
      />

      {/* Translucent glass details */}
      {translucent && (
        <g opacity="0.75">
          <polyline points="30,72 135,116 135,150" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.5" />
          <polyline points="155,118 210,88" fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="1.5" />
          <circle cx="58" cy="95" r="3" fill="#fff" fillOpacity="0.7" />
          <circle cx="76" cy="112" r="2" fill="#fff" fillOpacity="0.6" />
          <circle cx="104" cy="118" r="2.5" fill="#fff" fillOpacity="0.55" />
          <circle cx="178" cy="112" r="2.2" fill="#fff" fillOpacity="0.5" />
          <circle cx="195" cy="102" r="1.5" fill="#fff" fillOpacity="0.6" />
        </g>
      )}

      {/* Edge highlights */}
      <polyline
        points="20,60 95,20 220,72"
        fill="none"
        stroke="#fff"
        strokeOpacity={dark ? 0.25 : 0.7}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <polyline
        points="20,60 145,112 220,72"
        fill="none"
        stroke="#fff"
        strokeOpacity={dark ? 0.18 : 0.5}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Embossed stamp */}
      {stamp && (
        <g>
          <polygon
            points="102.5,33.8 190,70.2 137.5,98.2 50,61.8"
            fill="none"
            stroke={stampColor}
            strokeOpacity={dark ? 0.18 : 0.22}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <text
            transform="matrix(0.923,0.384,-0.882,0.471,120,70)"
            textAnchor="middle"
            fontSize="15"
            fontWeight="800"
            letterSpacing="2.5"
            fill={stampColor}
            fillOpacity={dark ? 0.28 : 0.3}
            fontFamily="inherit"
          >
            SOAPBASE
          </text>
        </g>
      )}

      {/* Specular shine on top face */}
      <polygon points="95,26 150,49 128,58 72,35" fill="#fff" fillOpacity={dark ? 0.08 : 0.35} />
    </svg>
  );
}
