// js/vxflw_scales.js

function renderVexFlowScore(containerId, degsStr, scaleTitle) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    try {
        if (scaleTitle) {
            const titleDiv = document.createElement('div');
            titleDiv.className = 'scale-staff-title';
            titleDiv.textContent = scaleTitle;
            container.appendChild(titleDiv);
        }

        const { Renderer, Stave, StaveNote, Voice, Formatter } = Vex.Flow;
        const renderer = new Renderer(container, Renderer.Backends.SVG);
        // Canvas height increased by 10% (110 * 1.1 = 121)
        renderer.resize(350, 121);
        const context = renderer.getContext();

        const stave = new Stave(10, 10, 330);
        stave.addClef('treble').setContext(context).draw();

        const tokens = degsStr.trim().split(/\s+/);
        if (tokens.length === 0) return;

        const baseMap = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };

        const parsedPitches = tokens.map(tok => {
            const match = tok.match(pitchRe);
            const fullText = match ? match[1] : tok;
            const pitchObj = txt2pitches[fullText];

            const letter = fullText[0].toUpperCase();
            let vxAccidental = '';

            if (pitchObj && pitchObj.vxflw !== undefined) {
                vxAccidental = pitchObj.vxflw;
            } else {
                const alt = fullText.slice(1);
                if (alt === '♭' || alt === 'b') vxAccidental = 'b';
                else if (alt === '♯' || alt === '#') vxAccidental = '#';
                else if (alt === '𝄪' || alt === '##') vxAccidental = '##';
                else if (alt === '♭♭' || alt === 'bb') vxAccidental = 'bb';
            }

            let sem = baseMap[letter] !== undefined ? baseMap[letter] : 0;
            if (vxAccidental === '##') sem += 2;
            else if (vxAccidental === '#') sem += 1;
            else if (vxAccidental === 'bb') sem -= 2;
            else if (vxAccidental === 'b') sem -= 1;

            return { letter, vxAccidental, sem, raw: fullText };
        });

        let assigned = [];
        parsedPitches.forEach((p, i) => {
            let octave = 4;
            let midi = p.sem + (octave + 1) * 12;

            if (i > 0) {
                octave = assigned[i - 1].octave;
                midi = p.sem + (octave + 1) * 12;
                while (midi <= assigned[i - 1].midi) {
                    octave++;
                    midi = p.sem + (octave + 1) * 12;
                }
            }
            assigned.push({ ...p, octave, midi });
        });

        let minMidi = Math.min(...assigned.map(n => n.midi));

        while (minMidi - 12 >= 57) {
            assigned.forEach(n => {
                n.octave--;
                n.midi -= 12;
            });
            minMidi -= 12;
        }

        while (minMidi < 57) {
            assigned.forEach(n => {
                n.octave++;
                n.midi += 12;
            });
            minMidi += 12;
        }

        const notes = assigned.map(n => {
            const vfKey = `${n.letter.toLowerCase()}/${n.octave}`;
            const staveNote = new StaveNote({ keys: [vfKey], duration: 'q', clef: 'treble' });

            if (n.vxAccidental) {
                staveNote.addModifier(new Vex.Flow.Accidental(n.vxAccidental), 0);
            }

            return staveNote;
        });

        if (notes.length > 0) {
            const voice = new Voice({ num_beats: notes.length, beat_value: 4 });
            voice.setStrict(false);
            voice.addTickables(notes);

            new Formatter().joinVoices([voice]).format([voice], 260);
            voice.draw(context, stave);
        }
    } catch (e) {
        console.error('VexFlow rendering error:', e);
        container.textContent = degsStr;
    }
}
