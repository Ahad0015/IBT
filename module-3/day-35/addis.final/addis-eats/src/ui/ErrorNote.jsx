import "./ErrorNote.css";

// A failure message that fits any screen: the caller says what failed.
function ErrorNote({ what = "the page", message }) {
  return (
    <p role="alert" className="error-note">
      <span aria-hidden="true">⚠</span> Could not load {what}: {message}
    </p>
  );
}

export default ErrorNote;
