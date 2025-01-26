import React from 'react';
import { useSelector } from 'react-redux';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';

import { setCategoryId, setCurrentPage, setFilters } from '../redux/filter/slice';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Sort, { sortList } from '../components/Sort';
import Categories from '../components/Categories';
import PizzaBlock from '../components/PizzaBlock/index';
import Pagination from '../components/Pagination/index';
import { fetchPizzas } from '../redux/pizza/asyncActions';
import { useAppDispatch } from '../redux/store';
import { selectFilter } from '../redux/filter/selectors';
import { selectPizzaData } from '../redux/pizza/selectors';
import { SearchPizzaParams } from '../redux/pizza/types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isSearch = React.useRef(false);
  const isMounted = React.useRef(false);

  const { categoryId, sort, currentPage, searchValue } = useSelector(selectFilter);
  const sortType = sort.sortProperty;

  const { items, status } = useSelector(selectPizzaData);

  const pizzas = items.map((obj: any) => (
     <PizzaBlock key={obj.id} {...obj} />
  ));
  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

   const onChangeCategory = (idx: number) => {
    dispatch(setCategoryId(idx));
  };

  const onChangePage = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const getPizzas = async () => {
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const sortBy = sortType.replace('-', '');
    const order = sortType.includes('-') ? 'asc' : 'desc';
    const search = searchValue ? `&search=${searchValue}` : ``;

    dispatch(
      fetchPizzas({
        sortBy,
        order,
        search,
        category,
        currentPage: String(currentPage),
      })
    );
  };

  React.useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        sortProperty: sort.sortProperty,
        categoryId,
        currentPage,
      });

      navigate(`?${queryString}`);
    }
    isMounted.current = true;
  }, [categoryId, sortType, searchValue, currentPage]);

  React.useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1)) as unknown as SearchPizzaParams;

      const sort = sortList.find((obj) => obj.sortProperty === params.sortBy);

      dispatch(setFilters({
        searchValue: params.search,
        categoryId: +params.category,
        currentPage: +params.currentPage,
        sort: sort || sortList[0],
      }));

      isSearch.current = true;
    }
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);

    if (!isSearch.current) {
      getPizzas();
    }

    isSearch.current = false;
  }, [categoryId, sortType, searchValue, currentPage]);

  

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={(id: number) => onChangeCategory(id)} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {status === 'error' ? (
        <div className="content__error-info">
          <h2>Произошла ошибка</h2>
          <p>К сожалению, не удалось получить пицц. Попробуйте повторить попытку позже.</p>
        </div>
      ) : (
        <div className="content__items">{status === 'loading' ? skeletons : pizzas}</div>
      )}
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
