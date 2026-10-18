// js/pwa.js

document.addEventListener('DOMContentLoaded', () => {
    let currentKsig = 0;
    let noteAlterations = { 'A': '', 'B': '', 'C': '', 'D': '', 'E': '', 'F': '', 'G': '' };
    let differingNotes = new Set();
    let currentWht2Alt2Indx = {};

    let cycleAltIndex = 0;
    const altCycles = ['', '#', 'b', '#b'];
    let cycleMinIndex = 0;
    const minCycles = ['hrm min', 'all min'];

    const keySigDropdown = document.getElementById('key-sig-dropdown');
    const keyboardContainer = document.getElementById('keyboard');
    const scalesHeading = document.getElementById('scales-heading');
    const scalesListContainer = document.getElementById('scales-list');
    const cycleAltBtn = document.getElementById('cycle-alt-btn');
    const cycleMinBtn = document.getElementById('cycle-min-btn');

    const qrBtn = document.getElementById('qr-btn');
    const qrModal = document.getElementById('qr-modal');
    const qrImg = document.getElementById('qr-img');
    const qrUrl = document.getElementById('qr-url');

    const helpBtn = document.getElementById('help-btn');
    const helpModal = document.getElementById('help-modal');

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

        const majScale = ksig2maj[k];
        const minScale = ksig2minHrm[k];
        if (majScale && minScale) {
            opt.textContent = `${labelTxt} - ${majScale.tonic}maj/${minScale.tonic}min`;
        } else if (majScale) {
            opt.textContent = `${labelTxt} - ${majScale.tonic}maj`;
        } else if (minScale) {
            opt.textContent = `${labelTxt} - ${minScale.tonic}min`;
        } else {
            opt.textContent = labelTxt;
        }
        return opt;
    }

    function initKeySigDropdown() {
        keySigDropdown.innerHTML = '';

        for (let k = -7; k <= 7; k++) {
            if (ksig2maj[k] || ksig2minHrm[k]) {
                keySigDropdown.appendChild(createKeySigOption(k));
                if (k === 0) {
                    const optUnknown = document.createElement('option');
                    optUnknown.value = '???';
                    optUnknown.textContent = '???';
                    keySigDropdown.appendChild(optUnknown);
                }
            }
        }
    }

    function getScaleAltMap(degsStr) {
        const map = {};
        if (!degsStr) return map;
        degsStr.split(' ').forEach(d => {
            const match = d.match(pitchRe);
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

        let s = [...scl_sets].map(st => st.replace('min_hrm', 'minh').replace('min_mld', 'mind'));
        return typeof in5thSort === 'function' ? in5thSort(...s).join(' ') : s.join(' ');
    }

    function applyKeySigToKeyboard(ksig) {
        if (ksig === undefined) return;

        if (ksig === '???') {
            noteAlterations = { 'A': '?', 'B': '?', 'C': '?', 'D': '?', 'E': '?', 'F': '?', 'G': '?' };
            differingNotes.clear();
            keySigDropdown.value = '???';
            currentKsig = '???';
            currentWht2Alt2Indx = {};
            renderKeyboard();
            updateAndRenderScales();
            return;
        }

        const ksigNum = parseInt(ksig);
        currentKsig = ksigNum;
        if (ksigNum >= -7 && ksigNum <= 7) {
            keySigDropdown.value = ksigNum;
        } else {
            keySigDropdown.value = '';
        }

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

    function updateKeyboardChoices() {
        const currentMinMode = minCycles[cycleMinIndex];

        const noteList = [];
        Object.entries(noteAlterations).forEach(([white, alt]) => {
            if (alt !== '?' && alt !== undefined && !(differingNotes.has(white) && alt === '')) {
                const pitchName = white + alt;
                if (txt2pitches[pitchName]) {
                    noteList.push(txt2pitches[pitchName]);
                }
            }
        });

        const currentScales = findScales(noteList, 'edo53', currentMinMode);
        const currentIdentifiers = new Set(currentScales.map(s => `${s.tonic}${s.kind}`));

        const tree = {};

        ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(ky => {
            const excludedNoteList = [];
            Object.entries(noteAlterations).forEach(([white, alt]) => {
                if (white !== ky && alt !== '?' && alt !== undefined && !(differingNotes.has(white) && alt === '')) {
                    const pitchName = white + alt;
                    if (txt2pitches[pitchName]) {
                        excludedNoteList.push(txt2pitches[pitchName]);
                    }
                }
            });

            const potentialScales = findScales(excludedNoteList, 'edo53', currentMinMode);
            potentialScales.forEach(scl => {
                const idtf = `${scl.tonic}${scl.kind}`;
                if (!currentIdentifiers.has(idtf)) {
                    allPitches.forEach(ptch => {
                        if (ptch.white === ky && bitmaskSel({candidat: ptch.msk53, group: scl.msk53})) {
                            if (!tree[ky]) tree[ky] = {};
                            if (!tree[ky][ptch.alt]) tree[ky][ptch.alt] = [];
                            tree[ky][ptch.alt].push(idtf);
                        }
                    });
                }
            });
        });

        currentWht2Alt2Indx = tree;
    }

    function renderKeyboard() {
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

            const standardAlts = ['?', ...ALTERATIONS];
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
                if (txt2pitches[pitchName]) {
                    noteList.push(txt2pitches[pitchName]);
                }
            }
        });

        const currentMinMode = minCycles[cycleMinIndex];
        const scales = findScales(noteList, 'edo53', currentMinMode);

        if (scales.length > 10) {
            scalesHeading.textContent = `${scales.length} Matching Scales (Showing first 10)`;
        } else {
            scalesHeading.textContent = `${scales.length} Matching Scale${scales.length === 1 ? '' : 's'}`;
        }

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
            renderVexFlowScore(`vexflow-scale-${index}`, scale.degs, scaleTitle);
        });
    }

    function handleStep(delta) {
        let val = keySigDropdown.value;
        if (val === '???' || val === '') {
            val = currentKsig === '???' ? 0 : (typeof currentKsig === 'number' ? currentKsig : 0);
        } else {
            val = parseInt(val);
            if (isNaN(val)) val = 0;
        }
        val += delta;

        const availableKsigs = Object.keys(ksig2maj).map(Number);
        const minKsig = Math.min(...availableKsigs);
        const maxKsig = Math.max(...availableKsigs);

        if (val < minKsig) val = minKsig;
        if (val > maxKsig) val = maxKsig;

        applyKeySigToKeyboard(val);
    }

    document.getElementById('step-minus2').addEventListener('click', () => handleStep(-2));
    document.getElementById('step-minus1').addEventListener('click', () => handleStep(-1));
    document.getElementById('step-plus1').addEventListener('click', () => handleStep(1));
    document.getElementById('step-plus2').addEventListener('click', () => handleStep(2));

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

    cycleAltBtn.addEventListener('click', () => {
        cycleAltIndex = (cycleAltIndex + 1) % altCycles.length;
        cycleAltBtn.textContent = altCycles[cycleAltIndex] || '♮';
    });

    cycleMinBtn.addEventListener('click', () => {
        cycleMinIndex = (cycleMinIndex + 1) % minCycles.length;
        cycleMinBtn.textContent = minCycles[cycleMinIndex];
        applyKeySigToKeyboard(currentKsig);
    });

    qrBtn.addEventListener('click', () => {
        const currentUrl = "https://bgrtosl-dev.github.io/53not12";
        qrUrl.href = currentUrl;
        qrUrl.textContent = currentUrl;
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}`;
        qrModal.style.display = 'flex';
    });

    qrModal.addEventListener('click', (e) => {
        if (e.target === qrModal) qrModal.style.display = 'none';
    });

    helpBtn.addEventListener('click', () => helpModal.style.display = 'flex');
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) helpModal.style.display = 'none';
    });

    initKeySigDropdown();
    keySigDropdown.value = '0';
    applyKeySigToKeyboard(0);
});
