import * as React from "react";
import '../lib/textHighlighter';
import { HLTR, createHighlighter } from "./hltr";

type RawHighlights = Element[];

export class Highlight {
  Range: Range;
  InnerHighlights: RawHighlights;

  // Constructor takes in the array of highlight elements used to create the highlight
  constructor(range: Range, rh: RawHighlights) {
    this.Range = range;
    this.InnerHighlights = rh;
  }

  // Clears a given highlight from the page
  clear() {
    this.InnerHighlights.forEach((innerHighlight) => {
      HLTR.removeHighlights(innerHighlight)
    })
  }

  // Returns the bounding box for the Range Element
  boundingBox() {
    return this.Range.getBoundingClientRect();
  }
}

export class Comment {
  Email: string = null
  Content: string = null

  constructor(email: string, content: string) {
    this.Email = email;
    this.Content = content;
  }
}

export interface AnnotationProps {
  Highlight: Highlight
  Comments: Comment[]
}
interface AnnotationState {
  Highlight: Highlight
  Comments: Comment[]
}
export class Annotation extends React.Component<AnnotationProps, AnnotationState> {
  constructor(props: AnnotationProps) {
    super(props);
    this.state = props;
  }

  componentWillUnmount() {
    this.state.Highlight.clear()
  }

  render() {
    const renderedComments = this.state.Comments.map((comment) =>
      <li>
        <p>from: {comment.Email}</p>
        <p>content: {comment}</p>
      </li>
    )
    const highlightBoundingBox = this.props.Highlight.boundingBox();
    const pageYOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

    return <div>
      <h2>Annotation:</h2>
      <ul>{renderedComments}</ul>
      <div style={{
        position: "absolute",
        top: highlightBoundingBox.top + pageYOffset,
        left: highlightBoundingBox.width + highlightBoundingBox.left + 10,
        "background-color": 'red',

        padding: 5,
        "padding-left": 10,
        "padding-right": 10,

        "border-radius": 5,
      }}>
        TEST
        position: "absolute",
        top: {highlightBoundingBox.top},
        left: {highlightBoundingBox.left},
      </div>
    </div>;
  }
}

export interface RootProps {
  Annotations: Annotation[]
  Sandbox: Element
}
interface RootState {
  Annotations: Annotation[]
  InProgressAnnotation: JSX.Element | undefined;
  LastSelectTime?: number
}

export class Root extends React.Component<RootProps, RootState> {
  constructor(props: RootProps) {
    super(props);
    this.state = {
      Annotations: props.Annotations,
      InProgressAnnotation: undefined,
    };

    createHighlighter(props.Sandbox, this.onBeforeHighlight.bind(this), this.onNewHighlight.bind(this));
    document.addEventListener("click", this.onDocumentClick.bind(this));
  }

  onDocumentClick(event: Event) {
    if (!this.state.LastSelectTime) {
      return;
    }

    // @ts-ignore
    const elem: Element = event.target;
    const highlightClicked = elem.classList.contains("highlighted") && elem.hasAttribute("data-highlighted");
    const clickNotFromHighlighting = Date.now() > 100 + this.state.LastSelectTime;

    if (clickNotFromHighlighting && !highlightClicked) {
      this.setState({ InProgressAnnotation: undefined });
    }
  }

  onBeforeHighlight(range: Range) {
    // Remove previous inprogress annotation
    this.setState({
      InProgressAnnotation: undefined,
      LastSelectTime: Date.now(),
    });
    return true;
  }

  onNewHighlight(range: Range, highlights: Element[]) {
    const inProgressHighlight = new Highlight(range, highlights);
    this.setState({
      InProgressAnnotation: <Annotation Highlight={inProgressHighlight} Comments={[]}></Annotation>,
    })
  }


  render() {
    return <div>
      <h2>All Annotations:</h2>
      <ul>{this.state.InProgressAnnotation}</ul>
      <ul>{this.state.Annotations}</ul>
    </div>;
  }
}