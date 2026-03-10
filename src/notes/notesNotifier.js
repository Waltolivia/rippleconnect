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

}

export{ NoteEvent, NotesNotifier };