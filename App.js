import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

// redux stuff
import { Provider } from "react-redux";
import { ConfigureStore } from "./redux/configureStore";
import { PersistGate } from "redux-persist/es/integration/react";

const { persistor, store } = ConfigureStore();

import ShoppingList from "./screens/shopping_list.js";
import { Loading } from "./components/LoadingComponent";

const stackNavigator = createStackNavigator({
  ShoppingList: {
    screen: ShoppingList
  }
});

const AppNavigator = createAppContainer(stackNavigator);

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}
