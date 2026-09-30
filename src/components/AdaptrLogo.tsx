import React from 'react';

interface AdaptrLogoProps {
  className?: string;
  size?: number;
  dark?: boolean;
}

export const AdaptrLogo: React.FC<AdaptrLogoProps> = ({
  className = '',
  size = 32,
  dark = false,
}) => {
  const primaryStroke = dark ? '#ffffff' : '#1c1917';
  const accentStroke = '#e07a16'; // Vibrant Saffron / Warm Amber

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="PixelPradesh Logo"
    >
      {/* Outer 9:16 Vertical Loop - Top */}
      <path
        d="M 82 70 L 82 48 C 82 44 85 40 90 40 L 110 40 C 115 40 118 44 118 48 L 118 70"
        stroke={primaryStroke}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Outer 9:16 Vertical Loop - Bottom */}
      <path
        d="M 82 130 L 82 152 C 82 156 85 160 90 160 L 110 160 C 115 160 118 156 118 152 L 118 130"
        stroke={primaryStroke}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Outer 16:9 Horizontal Loop - Left */}
      <path
        d="M 70 82 L 48 82 C 44 82 40 85 40 90 L 40 110 C 40 115 44 118 48 118 L 70 118"
        stroke={primaryStroke}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Outer 16:9 Horizontal Loop - Right */}
      <path
        d="M 130 82 L 152 82 C 156 82 160 85 160 90 L 160 110 C 160 115 156 118 152 118 L 130 118"
        stroke={primaryStroke}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Mid Framing Brackets (Intersections) */}
      {/* Top-Left Mid Bracket */}
      <path
        d="M 72 88 L 72 74 C 72 71 74 69 77 69 L 91 69"
        stroke={primaryStroke}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Top-Right Mid Bracket */}
      <path
        d="M 109 69 L 123 69 C 126 69 128 71 128 74 L 128 88"
        stroke={primaryStroke}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bottom-Left Mid Bracket */}
      <path
        d="M 72 112 L 72 126 C 72 129 74 131 77 131 L 91 131"
        stroke={primaryStroke}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bottom-Right Mid Bracket */}
      <path
        d="M 109 131 L 123 131 C 126 131 128 129 128 126 L 128 112"
        stroke={primaryStroke}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner Central Crop Corners (1:1 Focus Aperture) */}
      {/* Inner Top-Left */}
      <path
        d="M 80 92 L 80 80 L 92 80"
        stroke={primaryStroke}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner Bottom-Left */}
      <path
        d="M 80 108 L 80 120 L 92 120"
        stroke={primaryStroke}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner Bottom-Right */}
      <path
        d="M 108 120 L 120 120 L 120 108"
        stroke={primaryStroke}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner Top-Right (Saffron / Amber Focal Node) */}
      <path
        d="M 106 80 L 120 80 L 120 94"
        stroke={accentStroke}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
