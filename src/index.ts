console.log("TEST")
import './../lib/textHighlighter';

var sandbox = document.querySelector('.post');
// @ts-ignore
var hltr = new window.TextHighlighter(sandbox);
var serialized = '';

// @ts-ignore
const serialize = function () {
  serialized = hltr.serializeHighlights();
  console.log(serialized);
  hltr.removeHighlights();
}

// @ts-ignore
const deserialize = function () {
  hltr.removeHighlights();
  hltr.deserializeHighlights(serialized);
}