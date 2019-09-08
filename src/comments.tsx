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
      <li style={styles.Comment}>
        <p>from: {comment.Email}</p>
        <p>content: {comment}</p>
      </li>
    )
    const highlightBoundingBox = this.props.Highlight.boundingBox();
    const pageYOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

    return <div className={"annotationBlock"}>
      <h2>Annotation:</h2>
      <ul>{renderedComments}</ul>
      <div style={
        {
          ...styles.AnnotationBox,
          ...{
            top: highlightBoundingBox.top + pageYOffset,
            left: highlightBoundingBox.width + highlightBoundingBox.left + 10,
          },
        }
      }>
        {renderedComments}
        <div style={styles.AddCommentBox}>
          <p style={styles.Reset}>{
            renderedComments.length
            ? "Reply:"
            : "Write a comment:"
          }</p>
          <textarea name="comment" rows={5} style={styles.CommentInput}></textarea>
          <button type="submit">Send</button>
        </div>
      </div>
    </div>;
  }
}

const styles = {
  Reset: {
    margin: 0
  },

  AnnotationBox: {
    "position": "absolute",
    "background-color": "#d9d9d9",
    "padding": 10,
    "border": "2px solid black",
    "font-family": "georgia, times, serif",
  },

  Comment: {

  },

  AddCommentBox: {
    "display": "flex",
    "flex-direction": "column",
  },

  CommentInput: {
    "padding": 5,
    "border-radius": 5,
    "font-size": 12,
    "font-family": "georgia, times, serif",
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

    function annotationClicked(e: Element, count: number): boolean {
      if (count < 1) {
        return false;
      }
      if (e.classList.contains("annotationBlock")) {
        return true;
      }
      if (!e.parentElement) {
        return false;
      }
      return annotationClicked(e.parentElement, count - 1);
    }

    if (clickNotFromHighlighting && !highlightClicked && !annotationClicked(elem, 5)) {
      this.setState({ InProgressAnnotation: undefined });
    }
  }

  onBeforeHighlight(range: Range) {
    // Remove previous in-progress annotation
    this.setState({
      InProgressAnnotation: undefined,
      LastSelectTime: Date.now(),
    });

    if (range.startOffset === 1 && range.endOffset === 1) {
      return false;
    }
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