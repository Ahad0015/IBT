import Header from './Header';
import Dish from './Dish';

const menu = [
  { id: 1, name: 'Doro Wat', price: 14.5 },
  { id: 2, name: 'Tibs', price: 13 },
  { id: 3, name: 'Shiro', price: 11.5 },
  { id: 4, name: 'Kitfo', price: 15 },
  { id: 5, name: 'Misir Wat', price: 10.5 },
];

function App() {
  return (
    <div className="app">
      <Header />
      <div className="menu">
        {menu.map((dish) => (
          <Dish key={dish.id} name={dish.name} price={dish.price} />
        ))}
      </div>
    </div>
  );
}

export default App;