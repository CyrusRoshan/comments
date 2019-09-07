import '../lib/textHighlighter';

export var HLTR: any;

export function createHighlighter(sandbox: Element, onAfterHighlight: Function) {
  // @ts-ignore
  HLTR = new window.TextHighlighter(sandbox, {
    onAfterHighlight: onAfterHighlight,
  });
  // @ts-ignore
  window.HLTR = HLTR;
  return;
}