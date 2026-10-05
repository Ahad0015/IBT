import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import Field from "../checkout/Field";
import "../checkout/Checkout.css";

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);

  // Where RequireAuth sent them from - default to the menu.
  const from = location.state?.from?.pathname ?? "/menu";

  // Already signed in: redirect while rendering (Navigate, never navigate()).
  if (user) return <Navigate to={from} replace />;

  async function signIn(e) {
    e.preventDefault();
    try {
      await login(phone);
      navigate(from, { replace: true }); // back to /checkout
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="panel">
      <h2>Sign in</h2>
      <p>Sign in with your TeleBirr number to check out.</p>
      <form onSubmit={signIn} noValidate>
        <Field
          name="phone"
          label="TeleBirr number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          hint="For example 0911 234 567 or +251 911 234 567"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setError(null);
          }}
          error={error}
        />
        <button>Sign in</button>
      </form>
    </section>
  );
}

export default Login;
