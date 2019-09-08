import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Root} from './comments';

// Create root, last element in the body, for react insertion
const rootElem = document.createElement('div');
rootElem.id = 'root';
document.body.appendChild(rootElem);

// Insertion of the Root react component
var sandbox = document.querySelector('.post');
const rootState = <Root Annotations={[]} Sandbox={sandbox}></Root>;
ReactDOM.render(rootState, rootElem, console.log);
