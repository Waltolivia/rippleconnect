const NoteEvent = {
  Add: "noteAdd",
  Update: "noteUpdate",
  StickyUpdate: "stickyUpdate",
  IndexUpdate: "indexUpdate",
};

const NotesNotifier = new NotesEventNotifier();

class EventMessage {
  constructor(from, type, value) {
    this.from = from;
    this.type = type;
    this.value = value;
  }
}

class NotesEventNotifier {
    events = [];
  handlers = [];

  broadcastEvent(from, type, value) {
    const event = new EventMessage(from, type, value);
    this.receiveEvent(event);
  }

  addHandler(handler) {
    this.handlers.push(handler);
  }

  removeHandler(handler) {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }

  receiveEvent(event) {
    this.events.push(event);

    this.handlers.forEach((handler) => {
      handler(event);
        });
    }
}

export{ NoteEvent, NotesNotifier };