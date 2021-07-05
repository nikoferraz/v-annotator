import { EventEmitter } from "events";
import { TextLineView } from "../View/TextLineView";

interface Range {
  startOffset: number;
  endOffset: number;
}

export class TextSelectionHandler {
  constructor(private emitter: EventEmitter) {}

  getSelectionInfo(): Range | null {
    const selection = window.getSelection();
    let startElement = null;
    let endElement = null;
    try {
      startElement = selection!.anchorNode!.parentNode;
      endElement = selection!.focusNode!.parentNode;
      console.log(startElement);
      console.log(endElement);
      console.log(selection);
    } catch (e) {
      return null;
    }
    let startOffset: number;
    let endOffset: number;
    try {
      const startLine = (
        startElement as unknown as { annotatorElement: TextLineView }
      ).annotatorElement;
      const endLine = (
        endElement as unknown as { annotatorElement: TextLineView }
      ).annotatorElement;
      startOffset = startLine.startOffset + selection!.anchorOffset;
      endOffset = endLine.startOffset + selection!.focusOffset;
    } catch (e) {
      return null;
    }
    if (startOffset > endOffset) {
      [startOffset, endOffset] = [endOffset, startOffset];
    }
    if (startOffset >= endOffset) {
      return null;
    }
    return {
      startOffset,
      endOffset,
    };
  }

  textSelected(): void {
    const selectionInfo = this.getSelectionInfo();
    if (selectionInfo) {
      this.emitter.emit(
        "textSelected",
        selectionInfo.startOffset,
        selectionInfo.endOffset
      );
    }
    window.getSelection()?.removeAllRanges();
  }
}
