import React, { Component } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import { saveDeckTitle } from "../utils/api";
import { NavigationActions } from "react-navigation";

function SubmitBtn({ onPress, disabled }) {
  return (
    <TouchableOpacity
      style={
        Platform.OS === "ios" ? styles.iosSubmitBtn : styles.AndroidSubmitBtn
      }
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.submitBtnText}>Submit</Text>
    </TouchableOpacity>
  );
}

class AddDeck extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "New Deck"
    };
  };
  state = {
    title: "",
    buttonState: true
  };
  submit = evt => {
    evt.preventDefault();

    this.toHome();

    saveDeckTitle(this.state.title);

    this.setState(() => ({ title: "" }));
  };
  toHome = () => {
    this.props.navigation.dispatch(NavigationActions.back({ key: "AddDeck" }));
  };

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <Text style={styles.header}>'What is the title of the deck?'</Text>
        <TextInput
          style={{ height: 40 }}
          placeholder="Deck Title"
          onChangeText={text =>
            this.setState({ title: text, buttonState: false })
          }
          value={this.state.title}
        />
        <SubmitBtn onPress={this.submit} disabled={this.state.buttonState} />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white"
  },
  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center"
  },
  iosSubmitBtn: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40
  },
  AndroidSubmitBtn: {
    backgroundColor: "black",
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center"
  },
  submitBtnText: {
    color: "white",
    fontSize: 22,
    textAlign: "center",
    backgroundColor: "black"
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 30,
    marginRight: 30
  },
  header: {
    fontSize: 35,
    textAlign: "center"
  },
  subHeader: {
    fontSize: 25,
    textAlign: "center",
    marginTop: 5
  }
});

export default AddDeck;
