import React, { Component } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addCardToDeck } from '../utils/api';
import { NavigationActions } from 'react-navigation';

function SubmitBtn ({ onPress, disabled }) {
  return (
    <TouchableOpacity
      style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.AndroidSubmitBtn}
      onPress={onPress} disabled={disabled} >
      <Text style={styles.submitBtnText} >Submit</Text >
    </TouchableOpacity >
  );
}

class AddCard extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Add Card'
    };
  };
  state = {
    question: '',
    answer: '',
  };

  canBeSubmitted () {
    const { question, answer } = this.state;
    return (
      question.length > 0 &&
      answer.length > 0
    );
  }

  submit = (evt) => {
    if (!this.canBeSubmitted()) {
      evt.preventDefault();
      return;
    }

    const { title } = this.props.navigation.state.params;

    this.toHome();

    addCardToDeck(title, { question: this.state.question, answer: this.state.answer });

    this.setState(() => ({ question: '', answer: '' }));

  };
  toHome = () => {
    this.props.navigation.dispatch(NavigationActions.back({ key: 'AddCard' }));
  };

  render () {
    const isEnabled = this.canBeSubmitted();
    return (
      <KeyboardAvoidingView
        behavior='padding'
        style={styles.container} >
        <TextInput
          style={{ height: 40 }}
          placeholder='Question'
          onChangeText={(text) => this.setState({ question: text })}
          value={this.state.question}
        />
        <TextInput
          style={{ height: 40 }}
          placeholder='Answer'
          onChangeText={(text) => this.setState({ answer: text })}
          value={this.state.answer}
        />
        <SubmitBtn onPress={this.submit} disbled={!isEnabled} />
      </KeyboardAvoidingView >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white'
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  iosSubmitBtn: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
  },
  AndroidSubmitBtn: {
    backgroundColor: 'black',
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
    backgroundColor: 'black'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
  },
  header: {
    fontSize: 35,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 25,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default AddCard;

