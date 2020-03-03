import * as ActionTypes from "./actionTypes";

export const setProducts = products => {
  return {
    type: ActionTypes.SET_PRODUCTS,
    payload: products.data
  };
};

export const toggleProductChecked = productId => {
  return {
    type: ActionTypes.TOGGLE_PRODUCT_CHECKED,
    payload: productId
  };
};

export const removeCheckedProducts = () => {
  return {
    type: ActionTypes.REMOVE_CHECKED_PRODUCTS
  };
};
