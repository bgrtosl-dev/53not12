// js/data.js

const doubleArrowRght = "\u21D2"; // '⇒'
const arrowLft = "\u2190"; // '←'
const DIA_COMMA = 4;
const CHROM_COMMA = 5;
const TONE_COMMA = DIA_COMMA + CHROM_COMMA; // 9
const OCTV_53EDO = 5 * TONE_COMMA + 2 * DIA_COMMA; // 53

const OCTV_12EDO = 12;
const MAJ_3RD_COMMA = TONE_COMMA * 2;
const MIN_3RD_COMMA = TONE_COMMA + DIA_COMMA;
const FIFTH_COMMA = 3 * TONE_COMMA + DIA_COMMA;

const NATURAL = "♮";
const FLAT = "♭";
const SHARP = "♯";
const DBLSHARP = "𝄪";
const UNICODE_ALTERATIONS = "♮♭♯𝄪";
const DBLFLAT = FLAT + FLAT; // "♭♭"
const ALTERATIONS = [DBLFLAT, FLAT, "", SHARP, DBLSHARP];

const MAJ = "maj";
const MIN_HRM = "min_hrm";
const MIN_MLD = "min_mld";

const pitchRe = new RegExp(`^([A-G](?:${DBLFLAT}|${DBLSHARP}|${FLAT}|${SHARP})?).*`);

const allPitches = [
    {eng: 'C', ascii: 'C', white: 'C', alt: '', vxflw: '', enh_sharp: 'C', enh_flat: 'C', in5th: 0, edo53: 0, edo12: 0, msk53: 1, msk12: 1},
    {eng: 'F', ascii: 'F', white: 'F', alt: '', vxflw: '', enh_sharp: 'F', enh_flat: 'F', in5th: -1, edo53: 22, edo12: 5, msk53: 4194304, msk12: 32},
    {eng: 'G', ascii: 'G', white: 'G', alt: '', vxflw: '', enh_sharp: 'G', enh_flat: 'G', in5th: 1, edo53: 31, edo12: 7, msk53: 2147483648, msk12: 128},
    {eng: 'B♭', ascii: 'Bb', white: 'B', alt: '♭', vxflw: 'b', enh_sharp: 'A♯', enh_flat: 'B♭', in5th: -2, edo53: 44, edo12: 10, msk53: 17592186044416, msk12: 1024},
    {eng: 'D', ascii: 'D', white: 'D', alt: '', vxflw: '', enh_sharp: 'D', enh_flat: 'D', in5th: 2, edo53: 9, edo12: 2, msk53: 512, msk12: 4},
    {eng: 'E♭', ascii: 'Eb', white: 'E', alt: '♭', vxflw: 'b', enh_sharp: 'D♯', enh_flat: 'E♭', in5th: -3, edo53: 13, edo12: 3, msk53: 8192, msk12: 8},
    {eng: 'A', ascii: 'A', white: 'A', alt: '', vxflw: '', enh_sharp: 'A', enh_flat: 'A', in5th: 3, edo53: 40, edo12: 9, msk53: 1099511627776, msk12: 512},
    {eng: 'A♭', ascii: 'Ab', white: 'A', alt: '♭', vxflw: 'b', enh_sharp: 'G♯', enh_flat: 'A♭', in5th: -4, edo53: 35, edo12: 8, msk53: 34359738368, msk12: 256},
    {eng: 'E', ascii: 'E', white: 'E', alt: '', vxflw: '', enh_sharp: 'E', enh_flat: 'E', in5th: 4, edo53: 18, edo12: 4, msk53: 262144, msk12: 16},
    {eng: 'D♭', ascii: 'Db', white: 'D', alt: '♭', vxflw: 'b', enh_sharp: 'C♯', enh_flat: 'D♭', in5th: -5, edo53: 4, edo12: 1, msk53: 16, msk12: 2},
    {eng: 'B', ascii: 'B', white: 'B', alt: '', vxflw: '', enh_sharp: 'B', enh_flat: 'B', in5th: 5, edo53: 49, edo12: 11, msk53: 562949953421312, msk12: 2048},
    {eng: 'G♭', ascii: 'Gb', white: 'G', alt: '♭', vxflw: 'b', enh_sharp: 'F♯', enh_flat: 'G♭', in5th: -6, edo53: 26, edo12: 6, msk53: 67108864, msk12: 64},
    {eng: 'F♯', ascii: 'F#', white: 'F', alt: '♯', vxflw: '#', enh_sharp: 'F♯', enh_flat: 'G♭', in5th: 6, edo53: 27, edo12: 6, msk53: 134217728, msk12: 64},
    {eng: 'C♭', ascii: 'Cb', white: 'C', alt: '♭', vxflw: 'b', enh_sharp: 'B', enh_flat: 'B', in5th: -7, edo53: 48, edo12: 11, msk53: 281474976710656, msk12: 2048},
    {eng: 'C♯', ascii: 'C#', white: 'C', alt: '♯', vxflw: '#', enh_sharp: 'C♯', enh_flat: 'D♭', in5th: 7, edo53: 5, edo12: 1, msk53: 32, msk12: 2},
    {eng: 'F♭', ascii: 'Fb', white: 'F', alt: '♭', vxflw: 'b', enh_sharp: 'E', enh_flat: 'E', in5th: -8, edo53: 17, edo12: 4, msk53: 131072, msk12: 16},
    {eng: 'G♯', ascii: 'G#', white: 'G', alt: '♯', vxflw: '#', enh_sharp: 'G♯', enh_flat: 'A♭', in5th: 8, edo53: 36, edo12: 8, msk53: 68719476736, msk12: 256},
    {eng: 'B♭♭', ascii: 'Bbb', white: 'B', alt: '♭♭', vxflw: 'bb', enh_sharp: 'A', enh_flat: 'A', in5th: -9, edo53: 39, edo12: 9, msk53: 549755813888, msk12: 512},
    {eng: 'D♯', ascii: 'D#', white: 'D', alt: '♯', vxflw: '#', enh_sharp: 'D♯', enh_flat: 'E♭', in5th: 9, edo53: 14, edo12: 3, msk53: 16384, msk12: 8},
    {eng: 'E♭♭', ascii: 'Ebb', white: 'E', alt: '♭♭', vxflw: 'bb', enh_sharp: 'D', enh_flat: 'D', in5th: -10, edo53: 8, edo12: 2, msk53: 256, msk12: 4},
    {eng: 'A♯', ascii: 'A#', white: 'A', alt: '♯', vxflw: '#', enh_sharp: 'A♯', enh_flat: 'B♭', in5th: 10, edo53: 45, edo12: 10, msk53: 35184372088832, msk12: 1024},
    {eng: 'A♭♭', ascii: 'Abb', white: 'A', alt: '♭♭', vxflw: 'bb', enh_sharp: 'G', enh_flat: 'G', in5th: -11, edo53: 30, edo12: 7, msk53: 1073741824, msk12: 128},
    {eng: 'E♯', ascii: 'E#', white: 'E', alt: '♯', vxflw: '#', enh_sharp: 'F', enh_flat: 'F', in5th: 11, edo53: 23, edo12: 5, msk53: 8388608, msk12: 32},
    {eng: 'D♭♭', ascii: 'Dbb', white: 'D', alt: '♭♭', vxflw: 'bb', enh_sharp: 'C', enh_flat: 'C', in5th: -12, edo53: 52, edo12: 0, msk53: 4503599627370496, msk12: 1},
    {eng: 'B♯', ascii: 'B#', white: 'B', alt: '♯', vxflw: '#', enh_sharp: 'C', enh_flat: 'C', in5th: 12, edo53: 1, edo12: 0, msk53: 2, msk12: 1},
    {eng: 'G♭♭', ascii: 'Gbb', white: 'G', alt: '♭♭', vxflw: 'bb', enh_sharp: 'F', enh_flat: 'F', in5th: -13, edo53: 21, edo12: 5, msk53: 2097152, msk12: 32},
    {eng: 'F𝄪', ascii: 'Fx', white: 'F', alt: '𝄪', vxflw: '##', enh_sharp: 'G', enh_flat: 'G', in5th: 13, edo53: 32, edo12: 7, msk53: 4294967296, msk12: 128},
    {eng: 'C♭♭', ascii: 'Cbb', white: 'C', alt: '♭♭', vxflw: 'bb', enh_sharp: 'A♯', enh_flat: 'B♭', in5th: -14, edo53: 43, edo12: 10, msk53: 8796093022208, msk12: 1024},
    {eng: 'C𝄪', ascii: 'Cx', white: 'C', alt: '𝄪', vxflw: '##', enh_sharp: 'D', enh_flat: 'D', in5th: 14, edo53: 10, edo12: 2, msk53: 1024, msk12: 4},
    {eng: 'F♭♭', ascii: 'Fbb', white: 'F', alt: '♭♭', vxflw: 'bb', enh_sharp: 'D♯', enh_flat: 'E♭', in5th: -15, edo53: 12, edo12: 3, msk53: 4096, msk12: 8},
    {eng: 'G𝄪', ascii: 'Gx', white: 'G', alt: '𝄪', vxflw: '##', enh_sharp: 'A', enh_flat: 'A', in5th: 15, edo53: 41, edo12: 9, msk53: 2199023255552, msk12: 512},
    {eng: 'D𝄪', ascii: 'Dx', white: 'D', alt: '𝄪', vxflw: '##', enh_sharp: 'E', enh_flat: 'E', in5th: 16, edo53: 19, edo12: 4, msk53: 524288, msk12: 16},
    {eng: 'A𝄪', ascii: 'Ax', white: 'A', alt: '𝄪', vxflw: '##', enh_sharp: 'B', enh_flat: 'B', in5th: 17, edo53: 50, edo12: 11, msk53: 1125899906842624, msk12: 2048},
    {eng: 'E𝄪', ascii: 'Ex', white: 'E', alt: '𝄪', vxflw: '##', enh_sharp: 'F♯', enh_flat: 'G♭', in5th: 18, edo53: 28, edo12: 6, msk53: 268435456, msk12: 64},
    {eng: 'B𝄪', ascii: 'Bx', white: 'B', alt: '𝄪', vxflw: '##', enh_sharp: 'C♯', enh_flat: 'D♭', in5th: 19, edo53: 6, edo12: 1, msk53: 64, msk12: 2}
].sort((a, b) => a.ascii.localeCompare(b.ascii));

const white2msk53 = {};
for (const white of 'ABCDEFG') {
    white2msk53[white] = allPitches
        .filter(ptch => ptch.white === white)
        .reduce((sum, ptch) => sum + BigInt(ptch.msk53), 0n);
}

const txt2pitches = {};
allPitches.forEach(p => {
    txt2pitches[p.eng] = p;
    txt2pitches[p.ascii] = p;
});

const edo53ToPitches = {};
allPitches.forEach(p => {
    edo53ToPitches[p.edo53] = p;
});

const pitchTo5th = {};
allPitches.forEach(p => {
    pitchTo5th[p.eng] = p.in5th;
});

const allScales = [
    {kind: MAJ, tonic: 'C', ksig: 0, degs: 'C D E F G A B', msk53: 564051616989697, msk12: 2741},
    {kind: MIN_HRM, tonic: 'A', ksig: 0, degs: 'A B C D E F G♯', msk53: 564118188982785, msk12: 2869},
    {kind: MIN_MLD, tonic: 'A', ksig: 0, degs: 'A B C D E F♯ G♯', msk53: 564118319006209, msk12: 2901},
    {kind: MAJ, tonic: 'G', ksig: 1, degs: 'G A B C D E F♯', msk53: 564051747013121, msk12: 2773},
    {kind: MIN_HRM, tonic: 'E', ksig: 1, degs: 'E F♯ G A B C D♯', msk53: 564051747028993, msk12: 2777},
    {kind: MIN_MLD, tonic: 'E', ksig: 1, degs: 'E F♯ G A B C♯ D♯', msk53: 564051747029024, msk12: 2778},
    {kind: MAJ, tonic: 'F', ksig: -1, degs: 'F G A B♭ C D E', msk53: 18693849612801, msk12: 1717},
    {kind: MIN_HRM, tonic: 'D', ksig: -1, degs: 'D E F G A B♭ C♯', msk53: 18693849612832, msk12: 1718},
    {kind: MIN_MLD, tonic: 'D', ksig: -1, degs: 'D E F G A B C♯', msk53: 564051616989728, msk12: 2742},
    {kind: MAJ, tonic: 'D', ksig: 2, degs: 'D E F♯ G A B C♯', msk53: 564051747013152, msk12: 2774},
    {kind: MIN_HRM, tonic: 'B', ksig: 2, degs: 'B C♯ D E F♯ G A♯', msk53: 598136607474208, msk12: 3286},
    {kind: MIN_MLD, tonic: 'B', ksig: 2, degs: 'B C♯ D E F♯ G♯ A♯', msk53: 598203179467296, msk12: 3414},
    {kind: MAJ, tonic: 'B♭', ksig: -2, degs: 'B♭ C D E♭ F G A', msk53: 18693849358849, msk12: 1709},
    {kind: MIN_HRM, tonic: 'G', ksig: -2, degs: 'G A B♭ C D E♭ F♯', msk53: 18693979382273, msk12: 1741},
    {kind: MIN_MLD, tonic: 'G', ksig: -2, degs: 'G A B♭ C D E F♯', msk53: 18693979636225, msk12: 1749},
    {kind: MAJ, tonic: 'A', ksig: 3, degs: 'A B C♯ D E F♯ G♯', msk53: 564118319006240, msk12: 2902},
    {kind: MIN_HRM, tonic: 'F♯', ksig: 3, degs: 'F♯ G♯ A B C♯ D E♯', msk53: 564118327132704, msk12: 2918},
    {kind: MIN_MLD, tonic: 'F♯', ksig: 3, degs: 'F♯ G♯ A B C♯ D♯ E♯', msk53: 564118327148576, msk12: 2922},
    {kind: MAJ, tonic: 'E♭', ksig: -3, degs: 'E♭ F G A♭ B♭ C D', msk53: 17628697469441, msk12: 1453},
    {kind: MIN_HRM, tonic: 'C', ksig: -3, degs: 'C D E♭ F G A♭ B', msk53: 562986464846337, msk12: 2477},
    {kind: MIN_MLD, tonic: 'C', ksig: -3, degs: 'C D E♭ F G A B', msk53: 564051616735745, msk12: 2733},
    {kind: MAJ, tonic: 'E', ksig: 4, degs: 'E F♯ G♯ A B C♯ D♯', msk53: 564118319022112, msk12: 2906},
    {kind: MIN_HRM, tonic: 'C♯', ksig: 4, degs: 'C♯ D♯ E F♯ G♯ A B♯', msk53: 1168365600802, msk12: 859},
    {kind: MIN_MLD, tonic: 'C♯', ksig: 4, degs: 'C♯ D♯ E F♯ G♯ A♯ B♯', msk53: 35253226061858, msk12: 1371},
    {kind: MAJ, tonic: 'A♭', ksig: -4, degs: 'A♭ B♭ C D♭ E♭ F G', msk53: 17628697468945, msk12: 1451},
    {kind: MIN_HRM, tonic: 'F', ksig: -4, degs: 'F G A♭ B♭ C D♭ E', msk53: 17628697722897, msk12: 1459},
    {kind: MIN_MLD, tonic: 'F', ksig: -4, degs: 'F G A♭ B♭ C D E', msk53: 17628697723393, msk12: 1461},
    {kind: MAJ, tonic: 'B', ksig: 5, degs: 'B C♯ D♯ E F♯ G♯ A♯', msk53: 598203179483168, msk12: 3418},
    {kind: MIN_HRM, tonic: 'G♯', ksig: 5, degs: 'G♯ A♯ B C♯ D♯ E F𝄪', msk53: 598207340232736, msk12: 3482},
    {kind: MIN_MLD, tonic: 'G♯', ksig: 5, degs: 'G♯ A♯ B C♯ D♯ E♯ F𝄪', msk53: 598207348359200, msk12: 3498},
    {kind: MAJ, tonic: 'D♭', ksig: -5, degs: 'D♭ E♭ F G♭ A♭ B♭ C', msk53: 17626617094161, msk12: 1387},
    {kind: MIN_HRM, tonic: 'B♭', ksig: -5, degs: 'B♭ C D♭ E♭ F G♭ A', msk53: 18691768983569, msk12: 1643},
    {kind: MIN_MLD, tonic: 'B♭', ksig: -5, degs: 'B♭ C D♭ E♭ F G A', msk53: 18693849358353, msk12: 1707},
    {kind: MAJ, tonic: 'F♯', ksig: 6, degs: 'F♯ G♯ A♯ B C♯ D♯ E♯', msk53: 598203187609632, msk12: 3434},
    {kind: MIN_HRM, tonic: 'D♯', ksig: 6, degs: 'D♯ E♯ F♯ G♯ A♯ B C𝄪', msk53: 598203187610624, msk12: 3436},
    {kind: MIN_MLD, tonic: 'D♯', ksig: 6, degs: 'D♯ E♯ F♯ G♯ A♯ B♯ C𝄪', msk53: 35253234189314, msk12: 1389},
    {kind: MAJ, tonic: 'G♭', ksig: -6, degs: 'G♭ A♭ B♭ C♭ D♭ E♭ F', msk53: 299101593804816, msk12: 3434},
    {kind: MIN_HRM, tonic: 'E♭', ksig: -6, degs: 'E♭ F G♭ A♭ B♭ C♭ D', msk53: 299101593805312, msk12: 3436},
    {kind: MIN_MLD, tonic: 'E♭', ksig: -6, degs: 'E♭ F G♭ A♭ B♭ C D', msk53: 17626617094657, msk12: 1389},
    {kind: MAJ, tonic: 'C♯', ksig: 7, degs: 'C♯ D♯ E♯ F♯ G♯ A♯ B♯', msk53: 35253234188322, msk12: 1387},
    {kind: MIN_HRM, tonic: 'A♯', ksig: 7, degs: 'A♯ B♯ C♯ D♯ E♯ F♯ G𝄪', msk53: 37383537967138, msk12: 1643},
    {kind: MIN_MLD, tonic: 'A♯', ksig: 7, degs: 'A♯ B♯ C♯ D♯ E♯ F𝄪 G𝄪', msk53: 37387698716706, msk12: 1707},
    {kind: MAJ, tonic: 'C♭', ksig: -7, degs: 'C♭ D♭ E♭ F♭ G♭ A♭ B♭', msk53: 299101589741584, msk12: 3418},
    {kind: MIN_HRM, tonic: 'A♭', ksig: -7, degs: 'A♭ B♭ C♭ D♭ E♭ F♭ G', msk53: 299103670116368, msk12: 3482},
    {kind: MIN_MLD, tonic: 'A♭', ksig: -7, degs: 'A♭ B♭ C♭ D♭ E♭ F G', msk53: 299103674179600, msk12: 3498},
    {kind: MAJ, tonic: 'G♯', ksig: 8, degs: 'G♯ A♯ B♯ C♯ D♯ E♯ F𝄪', msk53: 35257394937890, msk12: 1451},
    {kind: MIN_HRM, tonic: 'E♯', ksig: 8, degs: 'E♯ F𝄪 G♯ A♯ B♯ C♯ D𝄪', msk53: 35257395445794, msk12: 1459},
    {kind: MIN_MLD, tonic: 'E♯', ksig: 8, degs: 'E♯ F𝄪 G♯ A♯ B♯ C𝄪 D𝄪', msk53: 35257395446786, msk12: 1461},
    {kind: MAJ, tonic: 'F♭', ksig: -8, degs: 'F♭ G♭ A♭ B♭♭ C♭ D♭ E♭', msk53: 282059159511056, msk12: 2906},
    {kind: MIN_HRM, tonic: 'D♭', ksig: -8, degs: 'D♭ E♭ F♭ G♭ A♭ B♭♭ C', msk53: 584182800401, msk12: 859},
    {kind: MIN_MLD, tonic: 'D♭', ksig: -8, degs: 'D♭ E♭ F♭ G♭ A♭ B♭ C', msk53: 17626613030929, msk12: 1371},
    {kind: MAJ, tonic: 'D♯', ksig: 9, degs: 'D♯ E♯ F𝄪 G♯ A♯ B♯ C𝄪', msk53: 35257394938882, msk12: 1453},
    {kind: MIN_HRM, tonic: 'B♯', ksig: 9, degs: 'B♯ C𝄪 D♯ E♯ F𝄪 G♯ A𝄪', msk53: 1125972929692674, msk12: 2477},
    {kind: MIN_MLD, tonic: 'B♯', ksig: 9, degs: 'B♯ C𝄪 D♯ E♯ F𝄪 G𝄪 A𝄪', msk53: 1128103233471490, msk12: 2733},
    {kind: MAJ, tonic: 'B♭♭', ksig: -9, degs: 'B♭♭ C♭ D♭ E♭♭ F♭ G♭ A♭', msk53: 282059159503120, msk12: 2902},
    {kind: MIN_HRM, tonic: 'G♭', ksig: -9, degs: 'G♭ A♭ B♭♭ C♭ D♭ E♭♭ F', msk53: 282059163566352, msk12: 2918},
    {kind: MIN_MLD, tonic: 'G♭', ksig: -9, degs: 'G♭ A♭ B♭♭ C♭ D♭ E♭ F', msk53: 282059163574288, msk12: 2922},
    {kind: MAJ, tonic: 'A♯', ksig: 10, degs: 'A♯ B♯ C𝄪 D♯ E♯ F𝄪 G𝄪', msk53: 37387698717698, msk12: 1709},
    {kind: MIN_HRM, tonic: 'F𝄪', ksig: 10, degs: 'F𝄪 G𝄪 A♯ B♯ C𝄪 D♯ E𝄪', msk53: 37387958764546, msk12: 1741},
    {kind: MIN_MLD, tonic: 'F𝄪', ksig: 10, degs: 'F𝄪 G𝄪 A♯ B♯ C𝄪 D𝄪 E𝄪', msk53: 37387959272450, msk12: 1749},
    {kind: MAJ, tonic: 'E♭♭', ksig: -10, degs: 'E♭♭ F♭ G♭ A♭♭ B♭♭ C♭ D♭', msk53: 282025873506576, msk12: 2774},
    {kind: MIN_HRM, tonic: 'C♭', ksig: -10, degs: 'C♭ D♭ E♭♭ F♭ G♭ A♭♭ B♭', msk53: 299068303737104, msk12: 3286},
    {kind: MIN_MLD, tonic: 'C♭', ksig: -10, degs: 'C♭ D♭ E♭♭ F♭ G♭ A♭ B♭', msk53: 299101589733648, msk12: 3414},
    {kind: MAJ, tonic: 'E♯', ksig: 11, degs: 'E♯ F𝄪 G𝄪 A♯ B♯ C𝄪 D𝄪', msk53: 37387699225602, msk12: 1717},
    {kind: MIN_HRM, tonic: 'C𝄪', ksig: 11, degs: 'C𝄪 D𝄪 E♯ F𝄪 G𝄪 A♯ B𝄪', msk53: 37387699225664, msk12: 1718},
    {kind: MIN_MLD, tonic: 'C𝄪', ksig: 11, degs: 'C𝄪 D𝄪 E♯ F𝄪 G𝄪 A𝄪 B𝄪', msk53: 1128103233979456, msk12: 2742},
    {kind: MAJ, tonic: 'A♭♭', ksig: -11, degs: 'A♭♭ B♭♭ C♭ D♭♭ E♭♭ F♭ G♭', msk53: 4785625500877056, msk12: 2773},
    {kind: MIN_HRM, tonic: 'F♭', ksig: -11, degs: 'F♭ G♭ A♭♭ B♭♭ C♭ D♭♭ E♭', msk53: 4785625500884992, msk12: 2777},
    {kind: MIN_MLD, tonic: 'F♭', ksig: -11, degs: 'F♭ G♭ A♭♭ B♭♭ C♭ D♭ E♭', msk53: 282025873514512, msk12: 2778},
    {kind: MAJ, tonic: 'B♯', ksig: 12, degs: 'B♯ C𝄪 D𝄪 E♯ F𝄪 G𝄪 A𝄪', msk53: 1128103233979394, msk12: 2741},
    {kind: MAJ, tonic: 'D♭♭', ksig: -12, degs: 'D♭♭ E♭♭ F♭ G♭♭ A♭♭ B♭♭ C♭', msk53: 4785625435865344, msk12: 2741},
    {kind: MIN_HRM, tonic: 'B♭♭', ksig: -12, degs: 'B♭♭ C♭ D♭♭ E♭♭ F♭ G♭♭ A♭', msk53: 4785658721861888, msk12: 2869},
    {kind: MIN_MLD, tonic: 'B♭♭', ksig: -12, degs: 'B♭♭ C♭ D♭♭ E♭♭ F♭ G♭ A♭', msk53: 4785658786873600, msk12: 2901},
    {kind: MAJ, tonic: 'F𝄪', ksig: 13, degs: 'F𝄪 G𝄪 A𝄪 B♯ C𝄪 D𝄪 E𝄪', msk53: 1128103494026242, msk12: 2773},
    {kind: MAJ, tonic: 'G♭♭', ksig: -13, degs: 'G♭♭ A♭♭ B♭♭ C♭♭ D♭♭ E♭♭ F♭', msk53: 4512946552176896, msk12: 1717},
    {kind: MIN_HRM, tonic: 'E♭♭', ksig: -13, degs: 'E♭♭ F♭ G♭♭ A♭♭ B♭♭ C♭♭ D♭', msk53: 9346924806416, msk12: 1718},
    {kind: MIN_MLD, tonic: 'E♭♭', ksig: -13, degs: 'E♭♭ F♭ G♭♭ A♭♭ B♭♭ C♭ D♭', msk53: 282025808494864, msk12: 2742},
    {kind: MAJ, tonic: 'C𝄪', ksig: 14, degs: 'C𝄪 D𝄪 E𝄪 F𝄪 G𝄪 A𝄪 B𝄪', msk53: 1128103494026304, msk12: 2774},
    {kind: MAJ, tonic: 'C♭♭', ksig: -14, degs: 'C♭♭ D♭♭ E♭♭ F♭♭ G♭♭ A♭♭ B♭♭', msk53: 4512946552049920, msk12: 1709},
    {kind: MIN_HRM, tonic: 'A♭♭', ksig: -14, degs: 'A♭♭ B♭♭ C♭♭ D♭♭ E♭♭ F♭♭ G♭', msk53: 4512946617061632, msk12: 1741},
    {kind: MIN_MLD, tonic: 'A♭♭', ksig: -14, degs: 'A♭♭ B♭♭ C♭♭ D♭♭ E♭♭ F♭ G♭', msk53: 4512946617188608, msk12: 1749},
    {kind: MIN_MLD, tonic: 'D♭♭', ksig: -15, degs: 'D♭♭ E♭♭ F♭♭ G♭♭ A♭♭ B♭♭ C♭', msk53: 4785625435738368, msk12: 2733}
];

const ksig2maj = {};
allScales.forEach(p => {
    if (p.kind === "maj") ksig2maj[p.ksig] = p;
});

const ksig2minHrm = {};
allScales.forEach(p => {
    if (p.kind === "min_hrm") ksig2minHrm[p.ksig] = p;
});

const edo53steps2chords = {
    "[4,18,18]": ["aug_maj7", 3], "[5,13,18]": ["min_maj", 3], "[5,18,13]": ["maj7", 3],
    "[9,13,13]": ["hlf_dim7", 3], "[9,13,18]": ["min7", 3], "[9,18,13]": ["dom7", 3],
    "[13,4,18]": ["aug_maj7", 2], "[13,9,13]": ["min7", 2], "[13,9,18]": ["dom7", 2],
    "[13,13]": ["trd_dim", 0], "[13,13,9]": ["dom7", 1], "[13,13,13]": ["full_dim7", 0],
    "[13,13,14]": ["full_dim7", 1], "[13,13,18]": ["hlf_dim7", 0], "[13,14,13]": ["full_dim7", 2],
    "[13,17,5]": ["maj7", 1], "[13,18]": ["trd_min", 0], "[13,18,9]": ["hlf_dim7", 1],
    "[13,18,13]": ["min7", 0], "[13,18,17]": ["min_maj", 0], "[13,22]": ["trd_maj", 1],
    "[13,27]": ["trd_dim", 1], "[14,13,13]": ["full_dim7", 3], "[17,5,13]": ["min_maj", 2],
    "[17,5,18]": ["maj7", 2], "[17,18]": ["trd_aug", 2], "[18,9,13]": ["hlf_dim7", 2],
    "[18,13]": ["trd_maj", 0], "[18,13,4]": ["aug_maj7", 1], "[18,13,9]": ["min7", 1],
    "[18,13,13]": ["dom7", 0], "[18,13,17]": ["maj7", 0], "[18,17]": ["trd_aug", 1],
    "[18,17,5]": ["min_maj", 1], "[18,18]": ["trd_aug", 0], "[18,18,13]": ["aug_maj7", 0],
    "[18,22]": ["trd_min", 1], "[22,13]": ["trd_min", 2], "[22,18]": ["trd_maj", 2],
    "[27,13]": ["trd_dim", 2],
    "[13,13,13,49]": ["dom_min9", 1], "[13,13,18,13]": ["hlf_dim9", 0],
    "[13,13,18,44]": ["dom9", 1],
    "[13,13,49,18]": ["dom_min9", 2], "[13,18,13,18]": ["min9", 0], "[13,18,13,44]": ["maj9", 1],
    "[13,18,13,49]": ["hlf_dim9", 1], "[13,18,18,13]": ["min_maj9", 0],
    "[13,18,44,13]": ["min9", 2],
    "[13,18,44,18]": ["dom9", 2], "[13,44,13,18]": ["min_maj9", 3], "[13,44,18,13]": ["maj9", 3],
    "[13,49,13,13]": ["hlf_dim9", 3], "[13,49,18,13]": ["dom_min9", 3],
    "[18,13,13,13]": ["dom_min9", 0],
    "[18,13,13,18]": ["dom9", 0], "[18,13,18,13]": ["maj9", 0], "[18,13,18,44]": ["min9", 1],
    "[18,13,44,13]": ["min_maj9", 2], "[18,13,44,18]": ["maj9", 2],
    "[18,13,49,13]": ["hlf_dim9", 2],
    "[18,18,13,44]": ["min_maj9", 1], "[18,44,13,18]": ["min9", 3], "[18,44,18,13]": ["dom9", 3],
    "[44,13,18,13]": ["min9", 4], "[44,13,18,18]": ["min_maj9", 4], "[44,18,13,13]": ["dom9", 4],
    "[44,18,13,18]": ["maj9", 4], "[49,13,13,18]": ["hlf_dim9", 4], "[49,18,13,13]": ["dom_min9", 4]
};

const steps53tosteps12 = {
    "[4,18,18]": [1, 4, 4], "[5,13,18]": [1, 3, 4], "[5,18,13]": [1, 4, 3], "[9,13,13]": [2, 3, 3],
    "[9,13,18]": [2, 3, 4], "[9,18,13]": [2, 4, 3], "[13,4,18]": [3, 1, 4], "[13,9,13]": [3, 2, 3],
    "[13,9,18]": [3, 2, 4], "[13,13]": [3, 3], "[13,13,9]": [3, 3, 2], "[13,13,13]": [3, 3, 3],
    "[13,13,13,49]": [3, 3, 3, 11], "[13,13,14]": [3, 3, 3], "[13,13,18]": [3, 3, 4],
    "[13,13,18,13]": [3, 3, 4, 3], "[13,13,18,44]": [3, 3, 4, 10], "[13,13,49,18]": [3, 3, 11, 4],
    "[13,14,13]": [3, 3, 3], "[13,17,5]": [3, 4, 1], "[13,18]": [3, 4], "[13,18,9]": [3, 4, 2],
    "[13,18,13]": [3, 4, 3], "[13,18,13,18]": [3, 4, 3, 4], "[13,18,13,44]": [3, 4, 3, 10],
    "[13,18,13,49]": [3, 4, 3, 11], "[13,18,17]": [3, 4, 4], "[13,18,18,13]": [3, 4, 4, 3],
    "[13,18,44,13]": [3, 4, 10, 3], "[13,18,44,18]": [3, 4, 10, 4], "[13,22]": [3, 5],
    "[13,27]": [3, 6], "[13,44,13,18]": [3, 10, 3, 4], "[13,44,18,13]": [3, 10, 4, 3],
    "[13,49,13,13]": [3, 11, 3, 3], "[13,49,18,13]": [3, 11, 4, 3], "[14,13,13]": [3, 3, 3],
    "[17,5,13]": [4, 1, 3], "[17,5,18]": [4, 1, 4], "[17,18]": [4, 4], "[18,9,13]": [4, 2, 3],
    "[18,13]": [4, 3], "[18,13,4]": [4, 3, 1], "[18,13,9]": [4, 3, 2], "[18,13,13]": [4, 3, 3],
    "[18,13,13,13]": [4, 3, 3, 3], "[18,13,13,18]": [4, 3, 3, 4], "[18,13,17]": [4, 3, 4],
    "[18,13,18,13]": [4, 3, 4, 3], "[18,13,18,44]": [4, 3, 4, 10], "[18,13,44,13]": [4, 3, 10, 3],
    "[18,13,44,18]": [4, 3, 10, 4], "[18,13,49,13]": [4, 3, 11, 3], "[18,17]": [4, 4],
    "[18,17,5]": [4, 4, 1], "[18,18]": [4, 4], "[18,18,13]": [4, 4, 3], "[18,18,13,44]": [4, 4, 3, 10],
    "[18,22]": [4, 5], "[18,44,13,18]": [4, 10, 3, 4], "[18,44,18,13]": [4, 10, 4, 3],
    "[22,13]": [5, 3], "[22,18]": [5, 4], "[27,13]": [6, 3], "[44,13,18,13]": [10, 3, 4, 3],
    "[44,13,18,18]": [10, 3, 4, 4], "[44,18,13,13]": [10, 4, 3, 3], "[44,18,13,18]": [10, 4, 3, 4],
    "[49,13,13,18]": [11, 3, 3, 4], "[49,18,13,13]": [11, 4, 3, 3]
};

const chordDescriptions = {
    'trd_maj': 'Major triad',
    'trd_min': 'Minor triad',
    'trd_dim': 'Diminished triad',
    'trd_aug': 'Augmented triad',
    'maj7': 'Major 7th',
    'dom7': 'Dominant 7th',
    'min7': 'Minor 7th',
    'min_maj': 'Minor-Major 7th',
    'hlf_dim7': 'Half-diminished 7th',
    'full_dim7': 'Fully diminished 7th',
    'aug_maj7': 'Augmented major 7th',
    'dom9': 'Dominant 9th',
    'dom_min9': 'Dominant minor 9th',
    'min9': 'Minor 9th',
    'maj9': 'Major 9th',
    'min_maj9': 'Minor-Major 9th',
    'hlf_dim9': 'Half-diminished 9th'
};
