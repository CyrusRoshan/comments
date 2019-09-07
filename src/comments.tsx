import * as React from "react";
import '../lib/textHighlighter';
import { HLTR } from "./hltr";

type RawHighlights = Element[];

export class Highlight {
  rawHighlights: RawHighlights = [];

  // Constructor takes in the array of highlight elements used to create the highlight
  constructor(rh: RawHighlights) {
    this.rawHighlights = rh;
  }

  // Clears a given highlight from the page
  clear() {
    this.rawHighlights.forEach((rawHighlight) => {
      HLTR.removeHighlights(rawHighlight)
    })
  }
}

export class Comment {
  email: string = null
  content: string = null

  constructor(email: string, content: string) {
    this.email = email;
    this.content = content;
  }
}

export interface AnnotationProps {
  highlight: Highlight
  comments: Comment[]
}
interface AnnotationState {
  highlight: Highlight
  comments: Comment[]
}
export class Annotation extends React.Component<AnnotationProps, AnnotationState> {
  constructor(props: AnnotationProps) {
    super(props);
    this.state = props;
    console.log("CONSTRUCTED")
  }

  componentWillUnmount() {
    this.state.highlight.clear()
  }

  render() {
    console.log("RENDERED SOMEWHERE?")
    const renderedComments = this.state.comments.map((comment) =>
      <li>
        <p>from: {comment.email}</p>
        <p>content: {comment}</p>
      </li>
    )

    return <div className="test" onClick={(() => {this.state.highlight.clear()}).bind(this)}>
      <h2>Comments:</h2>
      <ul>{renderedComments}</ul>
    </div>;
  }
}
