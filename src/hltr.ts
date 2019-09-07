import '../lib/textHighlighter';

export var HLTR: any;

export function createHighlighter(sandbox: Element, onBeforeHighlight: Function, onAfterHighlight: Function) {
  // @ts-ignore
  HLTR = new window.TextHighlighter(sandbox, {
    onBeforeHighlight: onBeforeHighlight,
    onAfterHighlight: onAfterHighlight,
  });
  // @ts-ignore
  window.HLTR = HLTR;
  return;
}