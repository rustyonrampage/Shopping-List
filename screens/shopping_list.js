import React, { Component } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Modal
} from "react-native";
import ValidationComponent from "react-native-form-validator";

import DraggableFlatList from "react-native-draggable-flatlist";
import ColorPalette from "react-native-color-palette";
import { CheckBox, Input } from "react-native-elements";
import { FontAwesome } from "@expo/vector-icons";

import { connect } from "react-redux";
import {
  setProducts,
  toggleProductChecked,
  removeCheckedProducts,
  addProduct
} from "../redux/actionCreators";

class ProductModal extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      qty: "",
      color: "#F4D03F",
      description: ""
    };
  }
  submit() {
    let validateSuccess = this.validate({
      name: { required: true },
      qty: { required: true }
    });
    if (validateSuccess) {
      console.log("Bhejo bc");
      this.props.addProduct({
        ...this.state
      });
      this.props.closeModal();
    }
  }
  render() {
    return (
      <Modal animationType="slide" visible={this.props.showModal}>
        <View style={Styles.addProductModal}>
          <Input
            placeholder="Name"
            value={this.state.name}
            errorStyle={{ color: "red" }}
            inputContainerStyle={
              this.isFieldInError("name") ? { borderColor: "red" } : null
            }
            errorMessage={this.isFieldInError("name") ? "Required" : null}
            onChangeText={text => this.setState({ name: text })}
          />
          <Input
            placeholder="Quantity"
            value={this.state.qty}
            errorStyle={{ color: "red" }}
            inputContainerStyle={
              this.isFieldInError("qty") ? { borderColor: "red" } : null
            }
            errorMessage={this.isFieldInError("name") ? "Required" : null}
            onChangeText={text => this.setState({ qty: text })}
          />
          <ColorPalette
            onChange={color => this.setState({ color: color })}
            value={this.state.color}
            colors={["#F4D03F", "#2ECC71", "#F44336", "#03A9F4", "#9C27B0"]}
            title={"Select color:"}
            icon={
              <FontAwesome name={"check-circle-o"} size={25} color={"black"} />
              // Icon can just be text or ASCII
            }
          />
          <Input
            placeholder="(Optional) Notes"
            value={this.state.description}
            onChangeText={text => this.setState({ description: text })}
          />

          <View style={Styles.addProductsButtonContainer}>
            <TouchableOpacity onPress={() => this.props.closeModal()}>
              <View style={Styles.productModalCancelBtn}>
                <Text style={Styles.btnText}>Cancel</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.submit();
              }}
            >
              <View style={Styles.productModalAddBtn}>
                <Text style={Styles.btnText}>Add</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

class ShoppingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddModal: false,
      showDetailsModal: false,
      selectedProduct: null
    };
    this.isChecked = false;
  }

  showDeleteAlert = () => {
    Alert.alert(
      "Delete Products",
      "Are you sure you want to delete?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancelled Del Product.")
        },
        { text: "Delete", onPress: () => this.props.removeCheckedProducts() }
      ],
      { cancelable: true }
    );
  };

  closeProductModal = () => {
    this.setState({ showAddModal: false });
  };
  renderItem = ({ item, index, drag, isActive }) => {
    // first check if any product is marked for delete or not
    return (
      <TouchableOpacity
        style={{
          backgroundColor: isActive ? "#E5E7E9" : "#fff",
          height: 50
        }}
        onPress={id =>
          this.setState({ showDetailsModal: true, selectedProduct: item.id })
        }
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

  renderDetailProduct = () => {
    let selectedItem = null;
    console.log("Locha ", this.props);
    this.props.products.forEach((product, index) => {
      if (product.id === this.state.selectedProduct) selectedItem = product;
    });
    return (
      <Modal visible={this.state.showDetailsModal} animationType="slide">
        <View style={Styles.detailModalView}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 18,
              borderBottomWidth: 1,
              borderBottomColor: selectedItem.color
            }}
          >
            Product Details
          </Text>
          <Text>Name: {selectedItem.name}</Text>
          <Text>Qty: {selectedItem.qty}</Text>
          <Text>{selectedItem.description}</Text>
          <TouchableOpacity
            style={{
              width: 120,
              backgroundColor: "#F44336",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 10,
              paddingBottom: 10,
              marginTop: 20,
              marginLeft: "auto",
              marginRight: "auto"
            }}
            onPress={() => this.setState({ showDetailsModal: false })}
          >
            <Text style={{ color: "#fff" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
              onPress={() => this.showDeleteAlert()}
            >
              <FontAwesome color="#fff" size={40} name="remove"></FontAwesome>
            </TouchableOpacity>
            <TouchableOpacity
              style={Styles.footerAddButton}
              onPress={() => this.setState({ showAddModal: true })}
            >
              <FontAwesome color="#fff" size={40} name="plus"></FontAwesome>
            </TouchableOpacity>
          </View>
          {/* Modal for add product */}
          <ProductModal
            addProduct={this.props.addProduct}
            closeModal={this.closeProductModal}
            showModal={this.state.showAddModal}
          />
          {this.state.showDetailsModal && this.renderDetailProduct()}
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
    toggleCheckbox: id => dispatch(toggleProductChecked(id)),
    removeCheckedProducts: () => dispatch(removeCheckedProducts()),
    addProduct: product => dispatch(addProduct(product))
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
  },
  addProductModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20
  },
  productModalCancelBtn: {
    width: 100,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F44336",
    borderRadius: 3
  },
  productModalAddBtn: {
    width: 100,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2ECC71"
  },
  addProductsButtonContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 20,
    borderRadius: 3
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18
  },
  detailModalView: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 30,
    paddingRight: 30
  }
});
