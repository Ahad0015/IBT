import { CartProvider } from "./componets/CartProvider.jsx";
import Header from "./componets/Header/Header.jsx";
import Main from "./componets/Main/Main.jsx";
import "./App.css";

function App() {
  return (
    <CartProvider>
      <div className="app">
        <Header />
        <Main />
      </div>
    </CartProvider>
  );
}

export default App;
