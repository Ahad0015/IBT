import "./Spinner.css";

function Spinner({ label = "Loading…" }) {
  return (
    <div className="spinner-wrap" role="status">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}

export default Spinner;
