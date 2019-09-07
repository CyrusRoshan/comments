import * as React from "react";
import * as ReactDOM from "react-dom";

import { Annotation, Highlight } from './comments';
import { createHighlighter } from './hltr';

console.log("VERSION 123")

// Create root, last element in the body
const root = document.createElement("div");
root.id = "root";
document.body.appendChild(root);

// Global state
var annotations: Annotation[] = [];
var inProgressAnnotation: React.FunctionComponentElement<Annotation> = null;

// Create highlighter with sandbox element
var sandbox = document.querySelector('.post');
createHighlighter(sandbox, onNewHighlight);

function onNewHighlight(range: Range, highlights: Element[]) {
  console.log("Range:", range)
  console.log("Highlights:", highlights)

  const inProgressHighlight = new Highlight(highlights);
  inProgressAnnotation = <Annotation highlight={inProgressHighlight} comments={[]}></Annotation>
  ReactDOM.render(inProgressAnnotation, document.getElementById('root'), console.log);
}