import { EventEmitter } from "events";

export const documentEvents = new EventEmitter();
// emits: documentEvents.emit(documentId, { status: "ready" | "failed" })