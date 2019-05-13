import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";
import CartModule from "./cart";
import OrdersModule from "./orders";

Vue.use(Vuex);
const baseUrl = "http://localhost:3500";

export default new Vuex.Store({
  strict: true,
  modules: { cart: CartModule, orders: OrdersModule },
  state: {
    products: [],
    categoriesData: [],
    productsTotal: 0,
    currentPage: 1,
    pageSize: 4,
    currentCategory: "All"
  },
  getters: {
    productsFilteredByCategory: state =>
      state.products.filter(
        p =>
          state.currentCategory == "All" || p.category == state.currentCategory
      ),
    processedProducts: (state, getters) => {
      let index = (state.currentPage - 1) * state.pageSize;
      return getters.productsFilteredByCategory.slice(
        index,
        index + state.pageSize
      );
    },
    pageCount: (state, getters) =>
      Math.ceil(getters.productsFilteredByCategory.length / state.pageSize),
    categories: state => ["All", ...state.categoriesData],
    showPagination: (state, getters) =>
      getters.productsFilteredByCategory.length > state.pageSize
  },
  mutations: {
    setCurrentPage(state, page) {
      state.currentPage = page;
    },
    setPageSize(state, size) {
      state.pageSize = size;
      state.currentPage = 1;
    },
    setCurrentCategory(state, category) {
      state.currentCategory = category;
      state.currentPage = 1;
    },
    setData(state, { pdata, cdata }) {
      state.products = pdata;
      state.productsTotal = pdata.length;
      state.categoriesData = cdata.sort();
    }
  },
  actions: {
    async getData(context) {
      let pdata = (await Axios.get(`${baseUrl}/products`)).data;
      let cdata = (await Axios.get(`${baseUrl}/categories`)).data;
      context.commit("setData", { pdata, cdata });
    }
  }
});