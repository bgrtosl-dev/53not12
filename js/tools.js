// js/tools.js

function txt2pitchName(txt) {
    const match = txt.match(pitchRe);
    return match ? match[1] : txt;
}

function in5thSort(...txts) {
    return txts.sort((a, b) => pitchTo5th[txt2pitchName(a)] - pitchTo5th[txt2pitchName(b)]);
}

function scale2alterations(...pitchList) {
    const s2a = {};
    pitchList.forEach(p => {
        s2a[p.white] = p.alt;
    });
    return s2a;
}

function commonDiff(dicts, indx2descr = {}) {
    let [fst, ...rst] = dicts;
    let common = {...fst};

    rst.forEach(dd => {
        Object.keys(common).forEach(k => {
            if (!(k in dd) || dd[k] !== common[k]) {
                delete common[k];
            }
        });
    });

    const diffs = dicts.map(dd => {
        const diff = {};
        Object.keys(dd).forEach(k => {
            if (!(k in common) || dd[k] !== common[k]) {
                diff[k] = dd[k];
            }
        });
        return diff;
    });

    const tree = {};
    diffs.forEach((dd, i) => {
        Object.entries(dd).forEach(([wht, alt]) => {
            if (!tree[wht]) tree[wht] = {};
            if (!tree[wht][alt]) tree[wht][alt] = new Set();
            tree[wht][alt].add(indx2descr[i] !== undefined ? indx2descr[i] : i);
        });
    });

    return [common, ...diffs, tree];
}

function* pitchItr(lst) {
    if (typeof lst === 'string') {
        for (let p of lst.split(/\s+/)) {
            if (p && !p.includes('?')) {
                if (txt2pitches[p]) {
                    yield txt2pitches[p];
                }
            }
        }
    } else if (Array.isArray(lst)) {
        for (let item of lst) {
            yield* pitchItr(item);
        }
    } else if (lst && typeof lst === 'object') {
        yield lst;
    }
}

function bitmaskSel({candidat, group}) {
    // Use BigInt to support large 53-EDO bitmasks without 32-bit truncation
    return (BigInt(candidat) & BigInt(group)) === BigInt(candidat);
}

function findScales(notes, edo = 'edo53', minMode = 'hrm min') {
    const noteArr = [...pitchItr(notes)];
    let filtered = [];

    if (edo === 'edo53') {
        const msk53 = noteArr.reduce((sum, p) => sum + BigInt(p.msk53), 0n);
        filtered = allScales.filter(s => bitmaskSel({group: s.msk53, candidat: msk53}));
    } else if (edo === 'edo12') {
        const msk12 = noteArr.reduce((sum, p) => sum + p.msk12, 0);
        filtered = allScales.filter(s => bitmaskSel({group: s.msk12, candidat: msk12}));
    }

    if (minMode === 'hrm min') {
        // Strictly restricted to maj and min_hrm
        return filtered.filter(s => s.kind === 'maj' || s.kind === 'min_hrm');
    }

    // When 'all min' is selected, return all matched scales (including min_mld)
    return filtered;
}

function mskToPitches(bits, msk = 'msk53', first = null, asAltDict = false) {
    const ptches = [];
    allPitches.forEach(note => {
        if (bitmaskSel({candidat: note[msk], group: bits})) {
            ptches.push(note);
        }
    });

    if (first) {
        const idx = ptches.findIndex(n => n.eng === first || n.ascii === first);
        if (idx !== -1) {
            ptches.push(...ptches.splice(0, idx));
        }
    }

    if (asAltDict) {
        const altDict = {};
        ptches.forEach(n => {
            altDict[n.white] = n.alt;
        });
        return altDict;
    } else {
        return ptches.map(n => n.eng).join(' ');
    }
}

function unicodefy(txt) {
    return txt.replace(/b/g, '♭').replace(/#/g, '♯').replace(/x/g, '𝄪');
}

function asciify(txt) {
    return txt.replace(/♭/g, 'b').replace(/♯/g, '#').replace(/𝄪/g, 'x');
}
