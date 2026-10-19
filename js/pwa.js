/**
 - Key Signature Selector Behavior:

 - Standard View: Displays standard key signatures ordered from 7 sharps at the top, down through 0 and "???", to 7 flats at the bottom.

 - Extended Navigation: Step buttons (-- / ++) or scale buttons allow navigation beyond ±7 into extended key signatures.

 - Automatic Reset: Clicking or opening the dropdown (mousedown) resets the options list cleanly back to the standard ±7 range while preserving the active selection.

 Do not modify this ordering logic or remove this header without explicit instructions.
 */

// js/pwa.js

document.addEventListener('DOMContentLoaded', () => {
    let currentKsig = 0;
    let noteAlterations = {'A': '', 'B': '', 'C': '', 'D': '', 'E': '', 'F': '', 'G': ''};
    let differingNotes = new Set();
    let currentWht2Alt2Indx = {};

    let cycleAltIndex = 0;
    const altCycles = ['♯♭ exact', '♯♭ enhrm'];
    let cycleMinIndex = 0;
    const minCycles = ['hrm min', 'all min'];

    // UI Elements
    const keySigDropdown = document.getElementById('key-sig-dropdown');
    const keyboardContainer = document.getElementById('keyboard');
    const scalesHeading = document.getElementById('scales-heading');
    const scalesListContainer = document.getElementById('scales-list');
    const cycleAltBtn = document.getElementById('cycle-alt-btn');
    const cycleMinBtn = document.getElementById('cycle-min-btn');

    const stepMinus2 = document.getElementById('step-minus2');
    const stepMinus1 = document.getElementById('step-minus1');
    const stepPlus1 = document.getElementById('step-plus1');
    const stepPlus2 = document.getElementById('step-plus2');

    const qrBtn = document.getElementById('qr-btn');
    const qrModal = document.getElementById('qr-modal');
    const qrImg = document.getElementById('qr-img');
    const qrUrl = document.getElementById('qr-url');

    const helpBtn = document.getElementById('help-btn');
    const helpModal = document.getElementById('help-modal');

    // Helper to get active search system ('edo53' for exact, 'edo12' for enhrm)
    function getActiveSearchMode() {
        return altCycles[cycleAltIndex] === '♯♭ enhrm' ? 'edo12' : 'edo53';
    }

    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('ServiceWorker registered:', reg))
            .catch(err => console.log('ServiceWorker registration failed:', err));
    }

    // Initialize Balloon Help (Tooltips) with Unicode accidentals
    function initTooltips() {
        if (stepMinus2) stepMinus2.title = "Decrease key signature by 2";
        if (stepMinus1) stepMinus1.title = "Decrease key signature by 1";
        if (stepPlus1) stepPlus1.title = "Increase key signature by 1";
        if (stepPlus2) stepPlus2.title = "Increase key signature by 2";
        if (keySigDropdown) keySigDropdown.title = "Select key signature";
        if (cycleAltBtn) cycleAltBtn.title = "Toggle between exact and enharmonic matching modes";
        if (cycleMinBtn) cycleMinBtn.title = "Keep all or only harmonic minors";
        if (helpBtn) helpBtn.title = "Help & Guide";
        if (qrBtn) qrBtn.title = "Show QR Code";
    }

    function getFullScaleName(kind) {
        if (!kind) return '';
        const lower = kind.toLowerCase();
        if (lower === 'maj') return 'Major';
        if (lower === 'min' || lower === 'nat min') return 'Natural minor';
        if (lower === 'hrm min' || lower === 'min_hrm') return 'Harmonic minor';
        if (lower === 'mel min' || lower === 'min_mel' || lower === 'min_mld') return 'Melodic minor';
        return kind;
    }

    function formatKsigLabel(ksig) {
        if (ksig > 0) return `${ksig}♯`;
        if (ksig < 0) return `${Math.abs(ksig)}♭`;
        return '♮';
    }

    function createKeySigOption(k) {
        const opt = document.createElement('option');
        opt.value = k;
        let labelTxt = formatKsigLabel(k);

        const majScale = typeof ksig2maj !== 'undefined' ? ksig2maj[k] : null;
        const minScale = typeof ksig2minHrm !== 'undefined' ? ksig2minHrm[k] : null;
        if (majScale && minScale) {
            opt.textContent = `${labelTxt} (${majScale.tonic}maj/${minScale.tonic}min)`;
        } else if (majScale) {
            opt.textContent = `${labelTxt} (${majScale.tonic}maj)`;
        } else if (minScale) {
            opt.textContent = `${labelTxt} (${minScale.tonic}min)`;
        } else {
            opt.textContent = labelTxt;
        }
        return opt;
    }

    /* DO NOT ALTER OR REORDER: Preserves fixed 7# -> 0 -> ??? -> -7b dropdown order */
    function initKeySigDropdown() {
        if (!keySigDropdown) return;
        keySigDropdown.innerHTML = '';

        // 7 down to 1 (Sharps at the top)
        for (let k = 7; k >= 1; k--) {
            if (typeof ksig2maj !== 'undefined' && (ksig2maj[k] || ksig2minHrm[k])) {
                keySigDropdown.appendChild(createKeySigOption(k));
            }
        }

        // 0 and ???
        if (typeof ksig2maj !== 'undefined' && (ksig2maj[0] || ksig2minHrm[0])) {
            keySigDropdown.appendChild(createKeySigOption(0));
        }
        const optUnknown = document.createElement('option');
        optUnknown.value = '???';
        optUnknown.textContent = '???';
        keySigDropdown.appendChild(optUnknown);

        // -1 down to -7 (Flats at the bottom)
        for (let k = -1; k >= -7; k--) {
            if (typeof ksig2maj !== 'undefined' && (ksig2maj[k] || ksig2minHrm[k])) {
                keySigDropdown.appendChild(createKeySigOption(k));
            }
        }
    }

    function ensureKeySigOptionExists(k) {
        if (k === '???' || k === undefined || !keySigDropdown) return;
        const kNum = parseInt(k);
        const existing = keySigDropdown.querySelector(`option[value="${kNum}"]`);
        if (!existing && typeof ksig2maj !== 'undefined' && (ksig2maj[kNum] || ksig2minHrm[kNum])) {
            const opt = createKeySigOption(kNum);
            const options = Array.from(keySigDropdown.options);
            let inserted = false;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value !== '???' && parseInt(options[i].value) < kNum) {
                    keySigDropdown.insertBefore(opt, options[i]);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) {
                keySigDropdown.appendChild(opt);
            }
        }
    }

    function getScaleAltMap(degsStr) {
        const map = {};
        if (!degsStr) return map;
        degsStr.split(' ').forEach(d => {
            const match = d.match(typeof pitchRe !== 'undefined' ? pitchRe : /([A-G][#b]*)/);
            if (match) {
                const full = match[1];
                map[full[0]] = full.slice(1);
            }
        });
        return map;
    }

    function simplifyChoices(sclSetsInput) {
        let scl_sets = new Set(sclSetsInput);

        const mldSet = [...scl_sets];
        mldSet.forEach(k => {
            if (k.endsWith('_mld')) {
                const scl_dscr = k.slice(0, -4);
                if (scl_sets.has(scl_dscr + '_hrm')) {
                    scl_sets.delete(scl_dscr + '_mld');
                    scl_sets.delete(scl_dscr + '_hrm');
                    scl_sets.add(scl_dscr);
                }
            }
        });

        const majSet = [...scl_sets];
        majSet.forEach(k => {
            if (k.endsWith('maj')) {
                const scl_dscr = k.slice(0, -3);
                const mins = [scl_dscr + 'min', scl_dscr + 'min_mld', scl_dscr + 'min_hrm'];
                const hasMins = mins.some(m => scl_sets.has(m));
                if (scl_sets.has(scl_dscr + 'maj') && hasMins) {
                    mins.forEach(m => scl_sets.delete(m));
                    scl_sets.delete(scl_dscr + 'maj');
                    scl_sets.add(scl_dscr);
                }
            }
        });

        let s = [...scl_sets].map(st => st.replace('min_hrm', 'minh').replace('min_mld', 'minm'));
        return typeof in5thSort === 'function' ? in5thSort(...s).join(' ') : s.join(' ');
    }

    function applyKeySigToKeyboard(ksig) {
        if (ksig === undefined) return;

        if (ksig === '???') {
            noteAlterations = {'A': '?', 'B': '?', 'C': '?', 'D': '?', 'E': '?', 'F': '?', 'G': '?'};
            differingNotes.clear();
            if (keySigDropdown) keySigDropdown.value = '???';
            currentKsig = '???';
            currentWht2Alt2Indx = {};
            renderKeyboard();
            updateAndRenderScales();
            return;
        }

        const ksigNum = parseInt(ksig);
        currentKsig = ksigNum;
        ensureKeySigOptionExists(ksigNum);
        if (keySigDropdown) keySigDropdown.value = ksigNum;

        const currentMinMode = minCycles[cycleMinIndex];

        const majScale = typeof ksig2maj !== 'undefined' ? ksig2maj[ksigNum] : null;
        const hrmScale = typeof ksig2minHrm !== 'undefined' ? ksig2minHrm[ksigNum] : null;

        let scalesToCheck = [majScale, hrmScale].filter(Boolean);

        if (currentMinMode === 'all min' && typeof allScales !== 'undefined') {
            const tonicName = majScale ? majScale.tonic : (hrmScale ? hrmScale.tonic : null);
            const mldScale = allScales.find(s => Number(s.ksig) === ksigNum && s.kind === 'min_mld' && (!tonicName || s.tonic === tonicName)) ||
                allScales.find(s => Number(s.ksig) === ksigNum && s.kind === 'min_mld');
            if (mldScale) {
                scalesToCheck.push(mldScale);
            }
        }

        const maps = scalesToCheck.map(s => getScaleAltMap(s ? s.degs : ''));

        noteAlterations = {};
        differingNotes.clear();

        ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(white => {
            const altSet = new Set();
            maps.forEach(m => {
                if (m[white] !== undefined) {
                    altSet.add(m[white]);
                }
            });

            if (altSet.size > 1) {
                noteAlterations[white] = '';
                differingNotes.add(white);
            } else if (altSet.size === 1) {
                noteAlterations[white] = [...altSet][0];
            } else {
                noteAlterations[white] = '';
            }
        });

        updateKeyboardChoices();
        renderKeyboard();
        updateAndRenderScales();
    }

    // Direct JS Port of Python updt_alt
    function updateKeyboardChoices() {
        const currentMinMode = minCycles[cycleMinIndex];
        const searchMode = getActiveSearchMode();
        const mskProp = searchMode === 'edo12' ? 'msk12' : 'msk53';

        const noteList = [];
        ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(white => {
            const alt = noteAlterations[white];
            if (alt !== '?' && alt !== undefined) {
                noteList.push(white + alt);
            } else {
                noteList.push(white + '');
            }
        });

        const currentScales = typeof findScales === 'function' ? findScales(noteList, searchMode, currentMinMode) : [];
        const currentIdentifiers = new Set(currentScales.map(s => `${s.tonic}${s.kind}`));

        const tree = {};

        ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(ky => {
            tree[ky] = {};
            const excludedNoteList = [];
            ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(white => {
                if (white !== ky) {
                    const alt = noteAlterations[white];
                    if (alt !== '?' && alt !== undefined) {
                        excludedNoteList.push(white + alt);
                    } else {
                        excludedNoteList.push(white + '');
                    }
                }
            });

            const potentialScales = typeof findScales === 'function' ? findScales(excludedNoteList, searchMode, currentMinMode) : [];
            potentialScales.forEach(scl => {
                const idtf = `${scl.tonic}${scl.kind}`;
                if (!currentIdentifiers.has(idtf)) {
                    if (typeof allPitches !== 'undefined') {
                        allPitches.forEach(ptch => {
                            if (ptch.white === ky && typeof bitmaskSel === 'function' && bitmaskSel({
                                candidat: ptch[mskProp],
                                group: scl[mskProp]
                            })) {
                                if (!tree[ky][ptch.alt]) {
                                    tree[ky][ptch.alt] = [];
                                }
                                if (!tree[ky][ptch.alt].includes(idtf)) {
                                    tree[ky][ptch.alt].push(idtf);
                                }
                            }
                        });
                    }
                }
            });
        });

        currentWht2Alt2Indx = tree;
    }

    function renderKeyboard() {
        if (!keyboardContainer) return;
        keyboardContainer.innerHTML = '';
        ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(white => {
            const card = document.createElement('div');
            card.className = 'key-card';

            const isDiff = differingNotes.has(white);
            const currentAlt = noteAlterations[white];

            const whiteChoices = currentWht2Alt2Indx[white] || {};
            let hasNonEmptyChoice = false;
            Object.values(whiteChoices).forEach(sclArr => {
                if (sclArr && sclArr.length > 0) {
                    const simplified = simplifyChoices(sclArr);
                    if (simplified.trim() !== '') {
                        hasNonEmptyChoice = true;
                    }
                }
            });

            if (isDiff && (currentAlt === '' || currentAlt === undefined || currentAlt === '?')) {
                card.classList.add('differentiating');
            } else if (hasNonEmptyChoice) {
                card.classList.add('has-choices');
            }

            const noteLabel = document.createElement('div');
            noteLabel.className = 'key-note';

            if (currentAlt === '?') {
                noteLabel.textContent = white + '?';
            } else if (isDiff && (currentAlt === '' || currentAlt === undefined)) {
                noteLabel.textContent = white + '?';
            } else {
                noteLabel.textContent = white + (currentAlt || '');
            }

            const select = document.createElement('select');
            select.className = 'key-select';

            const standardAlts = ['?', ...(typeof ALTERATIONS !== 'undefined' ? ALTERATIONS : [])];
            const allAltsSet = new Set([...standardAlts, ...Object.keys(whiteChoices)]);

            allAltsSet.forEach(alt => {
                const opt = document.createElement('option');
                opt.value = alt;

                const sclArr = whiteChoices[alt] || [];
                const simplifiedStr = simplifyChoices(sclArr);

                let altLabel = alt === '' ? '♮' : alt;
                if (alt === '?') altLabel = '?';

                if (simplifiedStr) {
                    opt.textContent = `${altLabel}: ${simplifiedStr}`;
                } else {
                    opt.textContent = altLabel;
                }

                if (alt === currentAlt || (isDiff && (currentAlt === '' || currentAlt === undefined) && alt === '?')) {
                    opt.selected = true;
                }
                select.appendChild(opt);
            });

            select.addEventListener('change', (e) => {
                noteAlterations[white] = e.target.value;
                if (differingNotes.has(white) && e.target.value !== '?') {
                    differingNotes.delete(white);
                }
                updateKeyboardChoices();
                renderKeyboard();
                updateAndRenderScales();
            });

            card.appendChild(noteLabel);
            card.appendChild(select);
            keyboardContainer.appendChild(card);
        });
    }

    function updateAndRenderScales() {
        const noteList = [];
        Object.entries(noteAlterations).forEach(([white, alt]) => {
            if (alt !== '?' && alt !== undefined && !(differingNotes.has(white) && alt === '')) {
                const pitchName = white + alt;
                if (typeof txt2pitches !== 'undefined' && txt2pitches[pitchName]) {
                    noteList.push(txt2pitches[pitchName]);
                }
            }
        });

        const currentMinMode = minCycles[cycleMinIndex];
        const searchMode = getActiveSearchMode();
        let scales = typeof findScales === 'function' ? findScales(noteList, searchMode, currentMinMode) : [];

        // Sort scales by (abs(key_sig), -key_sig)
        scales.sort((a, b) => {
            const absA = Math.abs(a.ksig);
            const absB = Math.abs(b.ksig);
            if (absA !== absB) {
                return absA - absB; // Primary sort by absolute key signature value
            }
            return (-a.ksig) - (-b.ksig); // Secondary sort by negative key signature value
        });

        if (scalesHeading) {
            if (scales.length > 10) {
                scalesHeading.textContent = `${scales.length} Matching Scales (Showing first 10)`;
            } else {
                scalesHeading.textContent = `${scales.length} Matching Scale${scales.length === 1 ? '' : 's'}`;
            }
        }

        if (scalesListContainer) {
            scalesListContainer.innerHTML = '';

            if (scales.length === 0) {
                scalesListContainer.innerHTML = '<p>No matching scales found.</p>';
                return;
            }

            scales.slice(0, 10).forEach((scale, index) => {
                const row = document.createElement('div');
                row.className = 'scale-row';

                const ksigBtn = document.createElement('button');
                ksigBtn.className = 'scale-ksig-btn';
                ksigBtn.textContent = formatKsigLabel(scale.ksig);
                ksigBtn.addEventListener('click', () => {
                    applyKeySigToKeyboard(scale.ksig);
                });

                const notationDiv = document.createElement('div');
                notationDiv.className = 'scale-notation';
                notationDiv.id = `vexflow-scale-${index}`;

                row.appendChild(ksigBtn);
                row.appendChild(notationDiv);
                scalesListContainer.appendChild(row);

                const fullName = getFullScaleName(scale.kind);
                const scaleTitle = `${scale.tonic} ${fullName}`;
                if (typeof renderVexFlowScore === 'function') {
                    renderVexFlowScore(`vexflow-scale-${index}`, scale.degs, scaleTitle);
                }
            });
        }
    }

    function handleStep(delta) {
        if (!keySigDropdown) return;
        let val = keySigDropdown.value;
        if (val === '???' || val === '') {
            val = currentKsig === '???' ? 0 : (typeof currentKsig === 'number' ? currentKsig : 0);
        } else {
            val = parseInt(val);
            if (isNaN(val)) val = 0;
        }
        val += delta;

        const availableKsigs = typeof ksig2maj !== 'undefined' ? Object.keys(ksig2maj).map(Number) : [-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
        const minKsig = Math.min(...availableKsigs);
        const maxKsig = Math.max(...availableKsigs);

        if (val < minKsig) val = minKsig;
        if (val > maxKsig) val = maxKsig;

        applyKeySigToKeyboard(val);
    }

    // Event Listeners for Step Buttons
    if (stepMinus2) stepMinus2.addEventListener('click', () => handleStep(-2));
    if (stepMinus1) stepMinus1.addEventListener('click', () => handleStep(-1));
    if (stepPlus1) stepPlus1.addEventListener('click', () => handleStep(1));
    if (stepPlus2) stepPlus2.addEventListener('click', () => handleStep(2));

    // Reset dropdown options back to standard 7 sharps -> 0 -> 7 flats range upon mousedown
    if (keySigDropdown) {
        keySigDropdown.addEventListener('mousedown', () => {
            initKeySigDropdown();
            if (currentKsig === '???' || (typeof currentKsig === 'number' && currentKsig >= -7 && currentKsig <= 7)) {
                keySigDropdown.value = currentKsig;
            } else {
                keySigDropdown.value = '';
            }
        });

        keySigDropdown.addEventListener('change', (e) => {
            const val = e.target.value;
            if (val === '???') {
                applyKeySigToKeyboard(val);
            } else {
                const num = parseInt(val);
                if (!isNaN(num)) {
                    applyKeySigToKeyboard(num);
                }
            }
        });
    }

    if (cycleAltBtn) {
        cycleAltBtn.textContent = altCycles[cycleAltIndex];
        cycleAltBtn.addEventListener('click', () => {
            cycleAltIndex = (cycleAltIndex + 1) % altCycles.length;
            cycleAltBtn.textContent = altCycles[cycleAltIndex];
            cycleAltBtn.title = "Toggle between exact and enharmonic matching modes";

            updateKeyboardChoices();
            renderKeyboard();
            updateAndRenderScales();
        });
    }

    if (cycleMinBtn) {
        cycleMinBtn.addEventListener('click', () => {
            cycleMinIndex = (cycleMinIndex + 1) % minCycles.length;
            const currentMode = minCycles[cycleMinIndex];
            cycleMinBtn.textContent = currentMode;

            if (currentMode === 'all min') {
                cycleMinBtn.title = "Show all minor variants (harmonic & melodic)";
            } else {
                cycleMinBtn.title = "Keep all or only harmonic minors";
            }

            applyKeySigToKeyboard(currentKsig);
        });
    }

    if (qrBtn && qrModal) {
        qrBtn.addEventListener('click', () => {
            const targetUrl = "https://bgrtosl-dev.github.io/53not12/";
            if (qrUrl) {
                qrUrl.href = targetUrl;
                qrUrl.textContent = targetUrl;
            }
            if (qrImg) {
                qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(targetUrl)}`;
            }
            qrModal.style.display = 'flex';
        });

        qrModal.addEventListener('click', (e) => {
            if (e.target === qrModal) qrModal.style.display = 'none';
        });
    }

    if (helpBtn && helpModal) {
        helpBtn.addEventListener('click', () => helpModal.style.display = 'flex');
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) helpModal.style.display = 'none';
        });
    }

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            handleStep(-1);
        } else if (e.key === 'ArrowRight') {
            handleStep(1);
        } else if (e.key === 'Escape') {
            if (helpModal) helpModal.style.display = 'none';
            if (qrModal) qrModal.style.display = 'none';
        }
    });

    // Initial Execution
    initTooltips();
    initKeySigDropdown();
    if (cycleAltBtn) cycleAltBtn.textContent = altCycles[cycleAltIndex];
    if (keySigDropdown) keySigDropdown.value = '0';
    applyKeySigToKeyboard(0);
});
