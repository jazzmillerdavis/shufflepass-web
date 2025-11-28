import './style.css'
import ShufflePass from "shufflepass"

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
		  <div class="heading">
		 <h1><a href="/">Shuffle <span class="emoji">🎲</span> Pass</a></h1>
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
	  	<div id="regen">Regenerate!</div>
	  </div>
	  <div class="footer">
		  Made with 🤍 by <a href="https://jm-d.net">Jazz Miller-Davis</a>
		  <div><a href="https://github.com/jazzmillerdavis/shufflepass" class="github"></a></div>
	  </div>
	  </div>
`

const outputDiv = document.getElementById('output');
const button = document.getElementById('regen');
const copiedTip = document.querySelector<HTMLDivElement>('.copied');
const emoji = document.querySelector<HTMLSpanElement>('.emoji');

function runGenerator() {
    const result = ShufflePass();

    const colourEl = document.querySelector<HTMLSpanElement>('.colour')
    const animalEl = document.querySelector<HTMLSpanElement>('.animal')
    const numberEl = document.querySelector<HTMLSpanElement>('.number')
    const keyEl = document.querySelector<HTMLSpanElement>('.key')

    if (colourEl && animalEl && numberEl && keyEl) {
        outputDiv?.classList.add('animate');
        colourEl.innerHTML = result.colour;
        colourEl.style.color = result.colourCode;
        animalEl.innerHTML = result.animal;
        numberEl.innerHTML = String(result.number);
        keyEl.innerHTML = result.symbol;
        setTimeout(() => {
            outputDiv?.classList.remove('animate');
        }, 700)
    }

}

document.addEventListener("DOMContentLoaded", function() {
    emoji?.classList.add('spin');
    runGenerator();
    setTimeout(function() {
        emoji?.classList.remove('spin');
    }, 1000);
});

button?.addEventListener('click', function() {
    if (outputDiv?.classList.contains('animate')) return
    outputDiv?.classList.add('fadeOut');
    emoji?.classList.add('spin');
    setTimeout(function() {
        runGenerator();
    }, 150);
    setTimeout(function() {
        outputDiv?.classList.remove('fadeOut');
    }, 200);
    setTimeout(function() {
        emoji?.classList.remove('spin');
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