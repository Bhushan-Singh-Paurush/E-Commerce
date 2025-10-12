import { createSlice } from "@reduxjs/toolkit";

const initialState: { count: number; products: Array<Record<string, any>> } = {
  count: 0,
  products: [],
};

const cart = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    addProduct: (state, action) => {
      const newProduct = action.payload;
      const isProductExist = state.products.findIndex(
        (product) =>
          product.productId == newProduct.productId &&
          product.variantId == newProduct.variantId
      );

      if (isProductExist === -1) {
        state.products.push(newProduct);
        state.count = state.products.length;
      }
    },
    removeProduct: (state, action) => {
      const { productId, variantId } = action.payload;
      const isProductExist = state.products.findIndex(
        (product) =>
          product.productId === productId && product.variantId === variantId
      );

      if (isProductExist !== -1) state.products.splice(isProductExist, 1);

      state.count = state.products.length;
    },
    incrementQty: (state, action) => {
      const { productId, variantId } = action.payload;
      
      const productIndex = state.products.findIndex(
        (product) =>
          product.productId === productId && product.variantId === variantId
      );
     
      if (productIndex >= 0) 
      state.products[productIndex].qty += 1;
    },
    decrementQty: (state, action) => {
      const { productId, variantId } = action.payload;
      const productIndex = state.products.findIndex(
        (product) =>
          product.productId === productId && product.variantId === variantId
      );

      if (productIndex >=0 && state.products[productIndex].qty > 1)
        state.products[productIndex].qty -= 1;
    },

    clearCart: (state) => {
      (state.count = 0), (state.products = []);
    },
  },
});

export const {
  addProduct,
  removeProduct,
  clearCart,
  incrementQty,
  decrementQty,
} = cart.actions;

export default cart.reducer;
