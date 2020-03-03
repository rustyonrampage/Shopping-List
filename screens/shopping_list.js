import React, { Component } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions
} from "react-native";

import DraggableFlatList from "react-native-draggable-flatlist";
import { CheckBox, Button } from "react-native-elements";
import { FontAwesome } from "@expo/vector-icons";

import { connect } from "react-redux";
import { setProducts, toggleProductChecked } from "../redux/actionCreators";

class ShoppingList extends Component {
  constructor(props) {
    super(props);
    this.isChecked = false;
  }
  renderItem = ({ item, index, drag, isActive }) => {
    // first check if any product is marked for delete or not
    return (
      <TouchableOpacity
        style={{
          backgroundColor: isActive ? "#E5E7E9" : "#fff",
          height: 50
        }}
        onLongPress={drag}
        delayLongPress={200}
      >
        <View style={Styles.productItemContainer}>
          <View style={Styles.productItemCheckboxView}>
            <CheckBox
              checked={item.isChecked}
              onPress={() => {
                this.props.toggleCheckbox(item.id);
              }}
            />
          </View>
          <View
            style={[Styles.productItemColor, { backgroundColor: item.color }]}
          />
          <View style={Styles.productItemInner}>
            <Text>{item.name}</Text>
            <Text>Qty: {item.qty}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    if (this.props.products) {
      let deleteButtonShow = this.props.products.some(item => item.isChecked);
      return (
        <View style={{ flex: 1 }}>
          <View style={Styles.main}>
            <DraggableFlatList
              data={this.props.products}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => `draggable-item-${index}`}
              onDragEnd={({ data }) => {
                this.props.setProducts({ data });
              }}
            />
          </View>
          <View style={Styles.footer}>
            <TouchableOpacity
              disabled={!deleteButtonShow}
              style={[
                Styles.footerDelButton,
                { backgroundColor: deleteButtonShow ? "#E74C3C" : "#CD6155" }
              ]}
              onPress={() => console.log("Pressed del button")}
            >
              <FontAwesome color="#fff" size={40} name="remove"></FontAwesome>
            </TouchableOpacity>
            <TouchableOpacity
              style={Styles.footerAddButton}
              onPress={() => console.log("Pressed add button")}
            >
              <FontAwesome color="#fff" size={40} name="plus"></FontAwesome>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else return <View></View>;
  }
}

const mapStateToProps = state => {
  return state.products;
};
const mapDispatchToProps = dispatch => {
  return {
    setProducts: products => dispatch(setProducts(products)),
    toggleCheckbox: id => dispatch(toggleProductChecked(id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingList);

const screenWidth = Math.round(Dimensions.get("screen").width);
const screenHeight = Math.round(Dimensions.get("screen").height);

const Styles = StyleSheet.create({
  main: {
    flex: 1
  },

  // productItem
  productItemContainer: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "row"
  },
  productItemColor: {
    minWidth: "5%",
    minHeight: "100%",
    maxHeight: "100%"
  },
  productItemInner: {
    flex: 1,
    // backgroundColor: "#FFC300",
    marginLeft: 10
  },
  productItemCheckboxView: {
    width: 50,
    justifyContent: "center",
    alignItems: "center"
    // backgroundColor: "red"
  },
  // footer
  footer: {
    height: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  footerDelButton: {
    width: 50,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E74C3C"
  },
  footerAddButton: {
    width: 50,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5499C7"
  }
});
