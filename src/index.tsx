import * as React from "react";
import * as ReactDOM from "react-dom";
import { Root } from './comments';

// Create root, last element in the body
const rootElem = document.createElement("div");
rootElem.id = "root";
document.body.appendChild(rootElem);

// Global state
var sandbox = document.querySelector('.post');
const rootState = <Root Annotations={[]} Sandbox={sandbox}></Root>;
ReactDOM.render(rootState, rootElem, console.log);