import { createAsyncThunk } from "@reduxjs/toolkit";
import { PizzaItem, SearchPizzaParams } from "./types";
import axios from "axios";

export const fetchPizzas = createAsyncThunk<PizzaItem[], SearchPizzaParams>(
  'pizza/fetchPizzasStatus', async (params) => {
    const { sortBy, order, category, search, currentPage } = params;
    const { data } = await axios.get<PizzaItem[]>(
      `https://6652f71a813d78e6d6d6b7e7.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
    );
    return data;
});