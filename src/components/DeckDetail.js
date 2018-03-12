import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { withNavigationFocus } from "react-navigation-is-focused-hoc";
import { getDeck } from "../utils/api";
import PropTypes from "prop-types";
import { NavigationActions } from "react-navigation";

function StartQuizBtn({ onPress }) {
  return (
    <TouchableOpacity
      style={
        Platform.OS === "ios" ? styles.iosSubmitBtn : styles.AndroidSubmitBtn
      }
      onPress={onPress}
    >
      <Text style={styles.subHeaderQuiz}>Start Quiz</Text>
    </TouchableOpacity>
  );
}

function AddCardBtn({ onPress }) {
  return (
    <TouchableOpacity
      style={
        Platform.OS === "ios" ? styles.iosSubmitBtn : styles.AndroidSubmitBtn
      }
      onPress={onPress}
    >
      <Text style={styles.subHeaderButton}>Add Card</Text>
    </TouchableOpacity>
  );
}

class DeckDetail extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.title
    };
  };
  static propTypes = {
    isFocused: PropTypes.bool.isRequired
  };
  state = {
    cardsNo: 0
  };

  getMyDeck = async () => {
    const deck = await getDeck(this.props.navigation.state.params.title);
    this.setState({ cardsNo: deck.questions.length });
    this.forceUpdate();
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.isFocused && nextProps.isFocused) {
      this.getMyDeck();
    }
    if (this.props.isFocused && !nextProps.isFocused) {
      // screen exit
    }
  }

  shouldComponentUpdate(nextProps) {
    // Update only once after the screen disappears
    if (this.props.isFocused && !nextProps.isFocused) {
      return true;
    }

    // Don't update if the screen is not focused
    if (!this.props.isFocused && !nextProps.isFocused) {
      return false;
    }

    // Update the screen if its re-enter
    return !this.props.isFocused && nextProps.isFocused;
  }

  componentDidMount() {
    this.getMyDeck();
  }

  render() {
    const { title } = this.props.navigation.state.params;

    return (
      <View style={styles.container}>
        <Text style={styles.header}>{title}</Text>
        <Text style={styles.subHeader}>{`${this.state.cardsNo} cards`}</Text>
        <AddCardBtn
          onPress={() =>
            this.props.navigation.navigate("AddCard", {
              title
            })
          }
        />
        {this.state.cardsNo > 0 && (
          <StartQuizBtn
            onPress={() =>
              this.props.navigation.navigate("Quiz", {
                title
              })
            }
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 15
  },
  header: {
    fontSize: 35,
    textAlign: "center"
  },
  subHeaderButton: {
    fontSize: 25,
    textAlign: "center",
    marginTop: 5,
    backgroundColor: "white",
    color: "black"
  },
  subHeader: {
    fontSize: 25,
    textAlign: "center",
    marginTop: 5
  },
  subHeaderQuiz: {
    fontSize: 25,
    textAlign: "center",
    marginTop: 5,
    backgroundColor: "black",
    color: "white"
  },
  iosSubmitBtn: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40
  },
  AndroidSubmitBtn: {
    backgroundColor: "white",
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default withNavigationFocus(DeckDetail);
