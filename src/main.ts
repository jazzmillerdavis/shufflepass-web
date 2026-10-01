import './style.css'
import ShufflePass from "shufflepass"

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
		  <div class="heading">
		 <h1><a href="/">Shuffle <span class="dice"></span> Pass</a></h1>
	     <h2>Memorable Random Password Generator</h2>
		  </div>
		 <div class="main">
		  <div class="copied">Copied to Clipboard!</div>
		<div class="output-row">
	  	<div id="output" title="Click to copy to clipboard">
			  <span class="colour"></span>
			  <span class="animal"></span>
			  <span class="number"></span>
			  <span class="key"></span>
		  </div>
		</div>
	  	<div id="regen">Regenerate</div>
	  </div>
	  <div class="footer">
		  Made with <span class="heart">♥</span> by <a href="https://jazzmillerdavis.com">Jazz Miller-Davis</a>
		  <div><a href="https://github.com/jazzmillerdavis/shufflepass" class="github"></a></div>
	  </div>
	  </div>
`

const outputDiv = document.getElementById('output');
const button = document.getElementById('regen');
const copiedTip = document.querySelector<HTMLDivElement>('.copied');
const dice = document.querySelector<HTMLSpanElement>('.dice');

type RGB = [number, number, number];

interface ColourMode {
    text: string;
    opposite: string;
}

interface ColourMode {
    text: string;
    opposite: string;
}

function getColourMode(hexColor: string, minContrast = 4.5): ColourMode {
    const BLACK: RGB = [0, 0, 0];
    const WHITE: RGB = [255, 255, 255];

    let h = hexColor.replace('#', '').trim();
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    if (!/^[0-9a-f]{6}$/i.test(h)) throw new Error(`Invalid hex colour: ${hexColor}`);

    const base: RGB = [
        parseInt(h.slice(0, 2), 16),
        parseInt(h.slice(2, 4), 16),
        parseInt(h.slice(4, 6), 16),
    ];

    const toHex = (rgb: RGB): string =>
        '#' + rgb.map(c => c.toString(16).padStart(2, '0')).join('');

    const luminance = ([r, g, b]: RGB): number => {
        const lin = (c: number): number => {
            c /= 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    };

    const contrast = (a: RGB, b: RGB): number => {
        const l1 = luminance(a);
        const l2 = luminance(b);
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    };

    const mix = (a: RGB, b: RGB, t: number): RGB => [
        Math.round(a[0] + (b[0] - a[0]) * t),
        Math.round(a[1] + (b[1] - a[1]) * t),
        Math.round(a[2] + (b[2] - a[2]) * t),
    ];

    const bestOf = (rgb: RGB): RGB =>
        contrast(rgb, BLACK) >= contrast(rgb, WHITE) ? BLACK : WHITE;

    const away = bestOf(base);
    let opposite: RGB = [255 - base[0], 255 - base[1], 255 - base[2]];
    if (contrast(opposite, base) < minContrast) {
        let lo = 0;
        let hi = 1;
        for (let i = 0; i < 16; i++) {
            const mid = (lo + hi) / 2;
            if (contrast(mix(opposite, away, mid), base) >= minContrast) hi = mid;
            else lo = mid;
        }
        opposite = mix(opposite, away, hi);
    }

    const textRgb = bestOf(opposite);

    return {
        text: toHex(textRgb),
        opposite: toHex(opposite),
    };
}

export { getColourMode };
export type { ColourMode };

function runGenerator() {
    const result = ShufflePass();

    const colourEl = document.querySelector<HTMLSpanElement>('.colour')
    const animalEl = document.querySelector<HTMLSpanElement>('.animal')
    const numberEl = document.querySelector<HTMLSpanElement>('.number')
    const keyEl = document.querySelector<HTMLSpanElement>('.key')

    const root = document.documentElement;

    if (colourEl && animalEl && numberEl && keyEl) {
        outputDiv?.classList.add('animate');
        root.style.setProperty('--colour-result', result.colourCode);
        root.style.setProperty('--colour-result-inverse', getColourMode(result.colourCode).opposite);
        root.style.setProperty('--colour-mono', getColourMode(result.colourCode).text);
        colourEl.innerHTML = result.colour;
        animalEl.innerHTML = result.animal;
        numberEl.innerHTML = String(result.number);
        keyEl.innerHTML = result.symbol;
        setTimeout(() => {
            outputDiv?.classList.remove('animate');
        }, 700)
    }

}

document.addEventListener("DOMContentLoaded", function() {
    dice?.classList.add('spin');
    runGenerator();
    setTimeout(function() {
        dice?.classList.remove('spin');
    }, 1000);
});

button?.addEventListener('click', function() {
    if (outputDiv?.classList.contains('animate')) return
    outputDiv?.classList.add('fadeOut');
    dice?.classList.add('spin');
    setTimeout(function() {
        runGenerator();
    }, 150);
    setTimeout(function() {
        outputDiv?.classList.remove('fadeOut');
    }, 200);
    setTimeout(function() {
        dice?.classList.remove('spin');
    }, 1000);
});

function hideCopiedTip() {
    setTimeout(function() {
        copiedTip?.classList.remove('visible');
    }, 2000);
}

outputDiv?.addEventListener('click', function() {
    let range = document.createRange();
    range.selectNode(outputDiv);

    let string = range.toString();

    string = string.replace(/\s+/g, '')

    navigator.clipboard.writeText(string).then(() => {
        copiedTip?.classList.add('visible');
        hideCopiedTip();
    })
})