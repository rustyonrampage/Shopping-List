import * as ActionTypes from "./actionTypes";

const DATA = [
  {
    id: 1,
    name: "Surf excel",
    qty: 3,
    color: "#FFC300",
    isChecked: true,
    description:
      "Aasdasd asdasd asdasd asdas asd asdasdasd asdasdas asdasd asdasdasda asdasdasd asdfasdas"
  },
  {
    id: 2,
    name: "Past all day, big pack",
    qty: 1,
    color: "#FF5733",
    isChecked: false,
    description:
      "Aasdasd asdasd asdasd asdas asd asdasdasd asdasdas asdasd asdasdasda asdasdasd asdfasdas"
  },
  {
    id: 3,
    name: "Battery Pack",
    qty: 1,
    color: "#900C3F",
    isChecked: false,
    description:
      "Aasdasd asdasd asdasd asdas asd asdasdasd asdasdas asdasd asdasdasda asdasdasd asdfasdas"
  }
];

// this is the reducer
export const products = (state = { products: DATA }, action) => {
  console.log("Hann to bhy, reducer called ", action);
  switch (action.type) {
    case ActionTypes.SET_PRODUCTS:
      // console.log("Set karni hain products");
      return { products: action.payload };
    case ActionTypes.TOGGLE_PRODUCT_CHECKED:
      // console.log("Toogle checkbox for id: ", action.payload);
      let updatedData = state.products.map(data => {
        if (data.id == action.payload) {
          // data.isChecked = !data.isChecked;
          return { ...data, isChecked: !data.isChecked };
        }
        return data;
      });
      // console.log("Y kia?", updatedData);
      return { products: updatedData };
    case ActionTypes.REMOVE_CHECKED_PRODUCTS:
      let filterd_data = state.products.filter(data => data.isChecked == false);
      return { products: filterd_data };
    default:
      // console.log("DEFAULT HY");
      return state;
  }
};
