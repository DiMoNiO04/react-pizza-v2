import axios from 'axios';
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const FullPizza: React.FC = () => {
  const { id } = useParams();
  const [pizza, setPizza] = React.useState<{
    imageUrl: string;
    title: string; 
    price: number;
  }>();
  const navigate = useNavigate();

  React.useEffect(() => {
    async function fetchPizza() {
      try {
        const { data } = await axios.get(`https://6652f71a813d78e6d6d6b7e7.mockapi.io/items/${id}`);
        setPizza(data);
      } catch (error) {
        alert('Ошибка при получении пиццы');
        navigate('/');
      }
    }

    fetchPizza();
  }, []);

  if (!pizza) {
    return <>Загрузка ...</>;
  }

  return (
    <div className="container">
      <img src={pizza.imageUrl} alt="" />
      <h2>{pizza.title}</h2>
      <h4>{pizza.price} ₽</h4>
      <Link to='/' className='button button--outline button--add'>
        <span>На главную</span>
      </Link>
    </div>
  );
};

export default FullPizza;
