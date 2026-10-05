import "./Button.css";

// type="button" by default: a button inside a form must not submit it by accident.
function Button({ text, onClick, type = "button" }) {
  return (
    <button type={type} className="btn" onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;
