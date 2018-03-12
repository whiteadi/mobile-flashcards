import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { getDeck } from "../utils/api";
import { NavigationActions } from "react-navigation";
import _ from "lodash";

function TheButton({ onPress, customText, bgColor, textColor }) {
  return (
    <TouchableOpacity
      style={[
        Platform.OS === "ios" ? styles.iosSubmitBtn : styles.AndroidSubmitBtn,
        { backgroundColor: bgColor }
      ]}
      onPress={onPress}
    >
      <Text
        style={
          textColor
            ? [
                styles.subHeaderQuiz,
                { backgroundColor: bgColor, color: textColor }
              ]
            : [styles.subHeaderQuiz, { backgroundColor: bgColor }]
        }
      >
        {customText}
      </Text>
    </TouchableOpacity>
  );
}

class Quiz extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Quiz"
    };
  };
  state = {
    questions: [],
    done: false,
    showAnswer: false
  };

  componentDidMount() {
    const { title } = this.props.navigation.state.params;

    getDeck(title).then(deck => {
      const questions = deck.questions.map(question => {
        question.correct = null;
        return question;
      });
      this.setState(() => ({ questions }));
    });
  }

  toHome = () => {
    this.props.navigation.dispatch(NavigationActions.back({ key: "quiz" }));
  };

  render() {
    const { questions, done } = this.state;
    let unansweredQuestions = [];
    let currentQuestion = null;
    let score = "";
    if (questions.length > 0) {
      unansweredQuestions = _.filter(questions, question =>
        _.isNil(question.correct)
      );
      if (unansweredQuestions.length > 0) {
        currentQuestion =
          unansweredQuestions[
            Math.floor(Math.random() * unansweredQuestions.length)
          ];
      }
    }
    if (this.state.done) {
      const correctAnswers = _.filter(questions, question => question.correct)
        .length;
      score = `You got ${correctAnswers} right from ${
        questions.length
      } questions.`;
    }
    return (
      <View style={styles.container}>
        {!_.isNil(currentQuestion) && (
          <Text style={styles.subHeader}>{`${questions.length -
            unansweredQuestions.length +
            1}/${questions.length}`}</Text>
        )}
        {!_.isNil(currentQuestion) &&
          this.state.showAnswer && (
            <View>
              <Text style={styles.header}>{currentQuestion.answer}</Text>
              <TheButton
                onPress={() => {
                  this.setState(() => ({ ...this.state, showAnswer: false }));
                }}
                customText="See the question"
                bgColor={"white"}
                textColor={"red"}
              />
            </View>
          )}
        {!_.isNil(currentQuestion) &&
          !this.state.showAnswer && (
            <View>
              <Text style={styles.header}>{currentQuestion.question}</Text>
              <TheButton
                onPress={() => {
                  this.setState(() => ({ ...this.state, showAnswer: true }));
                }}
                customText="See the answer"
                bgColor={"white"}
                textColor={"red"}
              />
            </View>
          )}
        {this.state.done && (
          <View>
            <Text style={styles.header}>{score}</Text>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("Quiz", {
                  title: this.props.navigation.state.params.title
                })
              }
            >
              <Text style={styles.subHeaderRestart}>Restart Quiz</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("DeckDetail", {
                  title: this.props.navigation.state.params.title
                })
              }
            >
              <Text style={styles.subHeaderRestart}>Back to Deck</Text>
            </TouchableOpacity>
          </View>
        )}
        {!_.isNil(currentQuestion) &&
          _.isNil(currentQuestion.correct) && (
            <View>
              <TheButton
                onPress={() => {
                  const index = _.findIndex(questions, {
                    question: currentQuestion.question
                  });
                  currentQuestion.correct = true;
                  questions.splice(index, 1, currentQuestion);
                  let isDone = false;
                  if (unansweredQuestions.length === 1) {
                    isDone = true;
                  }
                  this.setState(() => ({
                    questions,
                    done: isDone,
                    showAnswer: false
                  }));
                }}
                customText="Correct"
                bgColor={"green"}
              />
              <TheButton
                onPress={() => {
                  const index = _.findIndex(questions, {
                    question: currentQuestion.question
                  });
                  currentQuestion.correct = false;
                  questions.splice(index, 1, currentQuestion);
                  let isDone = false;
                  if (unansweredQuestions.length === 1) {
                    isDone = true;
                  }
                  this.setState(() => ({
                    questions,
                    done: isDone,
                    showAnswer: false
                  }));
                }}
                customText="Incorrect"
                bgColor={"red"}
              />
            </View>
          )}
      </View>
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
    marginRight: 40,
    marginBottom: 20
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
    alignItems: "center",
    marginBottom: 20
  },
  submitBtnText: {
    color: "white",
    fontSize: 22,
    textAlign: "center",
    backgroundColor: "black",
    padding: 50
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
    textAlign: "center",
    marginBottom: 14
  },
  subHeaderQuiz: {
    fontSize: 25,
    textAlign: "center",
    marginTop: 5,
    color: "white"
  },
  subHeader: {
    fontSize: 25,
    textAlign: "center",
    marginTop: 5,
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  subHeaderRestart: {
    fontSize: 25,
    textAlign: "center",
    marginTop: 5,
    backgroundColor: "black",
    color: "white"
  }
});

export default Quiz;
