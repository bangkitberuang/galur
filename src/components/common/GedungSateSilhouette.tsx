'use client';

import React from 'react';

interface GedungSateSilhouetteProps {
  className?: string;
  opacity?: number;
  variant?: 'silhouette' | 'detailed' | 'subtle';
}

/**
 * Siluet Arsitektural Ikonik Gedung Sate Bandung (Tatar Sunda, Jawa Barat)
 * Menampilkan menara bertingkat khas Sunda-Eropa dengan 6 tusuk sate legendaris,
 * arkade jendela melengkung simetris, dan fasad kolonial neoclassical yang megah.
 */
export default function GedungSateSilhouette({
  className = '',
  opacity = 0.12,
  variant = 'detailed',
}: GedungSateSilhouetteProps) {
  // Koordinat jendela sayap kiri & kanan
  const leftWingArches = [285, 315, 345, 375, 405, 435, 465, 495];
  const rightWingArches = [705, 735, 765, 795, 825, 855, 885, 915];

  // Jendela paviliun samping
  const leftPavilionArches = [185, 210, 235];
  const rightPavilionArches = [965, 990, 1015];

  // Arkade lantai 2 fasad tengah
  const centerArches = [545, 572, 600, 628, 655];

  return (
    <div
      className={`pointer-events-none select-none overflow-hidden ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 420"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-sm"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          {/* Masker pemotong jendela agar tembus pandang estetik */}
          <mask id="gedung-sate-windows">
            {/* Putih = Solid gedung */}
            <rect x="0" y="0" width="1200" height="420" fill="white" />

            {/* ======================================================== */}
            {/* LUBANG JENDELA & ARKADE (Hitam = Tembus / Lubang)         */}
            {/* ======================================================== */}
            
            {/* 1. Menara Pengawas Atas (3 Jendela Lengkung) */}
            <rect x="578" y="130" width="10" height="24" rx="5" fill="black" />
            <rect x="595" y="126" width="10" height="28" rx="5" fill="black" />
            <rect x="612" y="130" width="10" height="24" rx="5" fill="black" />

            {/* Jam Dinding / Medali Tengah Menara */}
            <circle cx="600" cy="190" r="9" fill="black" />

            {/* 2. Arkade Fasad Tengah Lantai 2 (5 Jendela Lengkung Kolosal) */}
            {centerArches.map((x) => (
              <rect
                key={`center-u-${x}`}
                x={x - 7}
                y="252"
                width="14"
                height="32"
                rx="7"
                fill="black"
              />
            ))}

            {/* 3. Pintu Gerbang Utama Bawah (Triple Grand Portal Arches) */}
            <rect x="555" y="335" width="22" height="45" rx="11" fill="black" />
            <rect x="588" y="325" width="24" height="55" rx="12" fill="black" />
            <rect x="623" y="335" width="22" height="45" rx="11" fill="black" />

            {/* 4. Sayap Kiri - Lantai Atas (8 Jendela Lengkung) */}
            {leftWingArches.map((x) => (
              <rect
                key={`left-u-${x}`}
                x={x - 6}
                y="278"
                width="12"
                height="28"
                rx="6"
                fill="black"
              />
            ))}

            {/* 5. Sayap Kiri - Lantai Bawah (8 Jendela Lengkung) */}
            {leftWingArches.map((x) => (
              <rect
                key={`left-b-${x}`}
                x={x - 6}
                y="336"
                width="12"
                height="34"
                rx="6"
                fill="black"
              />
            ))}

            {/* 6. Sayap Kanan - Lantai Atas (8 Jendela Lengkung) */}
            {rightWingArches.map((x) => (
              <rect
                key={`right-u-${x}`}
                x={x - 6}
                y="278"
                width="12"
                height="28"
                rx="6"
                fill="black"
              />
            ))}

            {/* 7. Sayap Kanan - Lantai Bawah (8 Jendela Lengkung) */}
            {rightWingArches.map((x) => (
              <rect
                key={`right-b-${x}`}
                x={x - 6}
                y="336"
                width="12"
                height="34"
                rx="6"
                fill="black"
              />
            ))}

            {/* 8. Paviliun Ujung Kiri (3 Jendela) */}
            {leftPavilionArches.map((x) => (
              <g key={`pav-l-${x}`}>
                <rect x={x - 5} y="265" width="10" height="24" rx="5" fill="black" />
                <rect x={x - 5} y="325" width="10" height="30" rx="5" fill="black" />
              </g>
            ))}

            {/* 9. Paviliun Ujung Kanan (3 Jendela) */}
            {rightPavilionArches.map((x) => (
              <g key={`pav-r-${x}`}>
                <rect x={x - 5} y="265" width="10" height="24" rx="5" fill="black" />
                <rect x={x - 5} y="325" width="10" height="30" rx="5" fill="black" />
              </g>
            ))}
          </mask>
        </defs>

        {/* ======================================================== */}
        {/* BADAN SILUET GEDUNG SATE                                  */}
        {/* ======================================================== */}
        <g mask="url(#gedung-sate-windows)">
          {/* Dasar Plinth & Anak Tangga */}
          <rect x="60" y="392" width="1080" height="18" rx="2" />
          <rect x="100" y="386" width="1000" height="7" rx="1" />
          <rect x="520" y="380" width="160" height="8" rx="1" />

          {/* Sayap Luar / Dinding Pembatas Taman Kolonial */}
          <rect x="70" y="360" width="90" height="28" rx="2" />
          <rect x="1040" y="360" width="90" height="28" rx="2" />
          {/* Tiang batas taman (balustrade finial) */}
          <rect x="65" y="352" width="14" height="38" rx="2" />
          <circle cx="72" cy="348" r="4.5" />
          <rect x="1121" y="352" width="14" height="38" rx="2" />
          <circle cx="1128" cy="348" r="4.5" />

          {/* Paviliun Ujung Kiri & Kanan */}
          <rect x="160" y="250" width="100" height="140" />
          <polygon points="148,252 272,252 256,234 164,234" />
          <rect x="158" y="230" width="104" height="5" rx="1" />
          {/* Atap kubah limasan paviliun kiri */}
          <polygon points="160,230 260,230 235,212 185,212" />
          <circle cx="210" cy="208" r="3.5" />

          <rect x="940" y="250" width="100" height="140" />
          <polygon points="928,252 1052,252 1036,234 944,234" />
          <rect x="938" y="230" width="104" height="5" rx="1" />
          {/* Atap kubah limasan paviliun kanan */}
          <polygon points="940,230 1040,230 1015,212 965,212" />
          <circle cx="990" cy="208" r="3.5" />

          {/* Sayap Utama Gedung (Kiri & Kanan) */}
          <rect x="260" y="260" width="260" height="130" />
          <rect x="680" y="260" width="260" height="130" />

          {/* Atap Bertingkat Sayap Utama (Gaya Tropis Sunda) */}
          <polygon points="250,262 530,262 516,242 264,242" />
          <polygon points="670,262 950,262 936,242 684,242" />
          <rect x="258" y="238" width="264" height="5" rx="1" />
          <rect x="678" y="238" width="264" height="5" rx="1" />

          {/* Fasad Tengah Utama (Central Portico) */}
          <rect x="515" y="236" width="170" height="154" />
          {/* Lis horizontal pembatas lantai */}
          <rect x="508" y="308" width="184" height="6" rx="1" />

          {/* Pedimen & Atap Menengah Fasad Tengah */}
          <polygon points="500,238 700,238 676,214 524,214" />
          <rect x="518" y="210" width="164" height="5" rx="1" />

          {/* ======================================================== */}
          {/* MENARA UTAMA BERTINGKAT (Pusat Keagungan Gedung Sate)     */}
          {/* ======================================================== */}
          {/* Tingkat Menara Bawah (Ruang Jam Dinding) */}
          <rect x="552" y="166" width="96" height="46" />
          <polygon points="540,168 660,168 644,152 556,152" />
          <rect x="550" y="148" width="100" height="5" rx="1" />

          {/* Tingkat Menara Atas (Anjungan Observasi / Lantera) */}
          <rect x="568" y="120" width="64" height="30" />
          <polygon points="556,122 644,122 632,104 568,104" />
          <rect x="564" y="100" width="72" height="4.5" rx="1" />

          {/* Kubah Puncak Menara (Tajuk Limasan Pagoda) */}
          <polygon points="572,100 628,100 610,84 590,84" />
          <rect x="586" y="80" width="28" height="4.5" rx="1" />
          <polygon points="588,80 612,80 604,70 596,70" />
        </g>

        {/* ======================================================== */}
        {/* IKON LEGENDARIS: TUSUK SATE (6 ORNAMEN BOLA KEMEGAHAN)   */}
        {/* ======================================================== */}
        <g className="text-amber-500 fill-current">
          {/* Jarum / Tiang Utama Puncak */}
          <rect x="598.5" y="14" width="3" height="62" rx="1.5" />

          {/* Puncak Ujung Mata Panah (Finial Arrow Tip) */}
          <polygon points="600,6 605,18 595,18" />

          {/* 6 Butir Ornamen Tusuk Sate Bertingkat */}
          <circle cx="600" cy="22" r="4.5" />
          <circle cx="600" cy="32" r="4.8" />
          <circle cx="600" cy="42" r="5.0" />
          <circle cx="600" cy="52" r="5.2" />
          <circle cx="600" cy="62" r="5.4" />
          <circle cx="600" cy="72" r="5.5" />

          {/* Dudukan ornamen tusuk sate */}
          <rect x="593" y="75" width="14" height="3.5" rx="1.5" />
        </g>
      </svg>
    </div>
  );
}
