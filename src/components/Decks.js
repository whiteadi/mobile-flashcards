import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getDecks } from '../utils/api';
import { AppLoading } from 'expo';
import _ from 'lodash';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { withNavigationFocus } from 'react-navigation-is-focused-hoc';
import { NavigationActions } from 'react-navigation';

class Decks extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Decks'
    };
  };
  static propTypes = {
    isFocused: PropTypes.bool.isRequired,
  };
  state = {
    ready: false,
    decks: {},
  };

  getMyDecks  = async () => {
    const decks = await getDecks();
    this.setState(() => ({ decks: JSON.parse(decks), ready: true }));
    this.forceUpdate();
  };

  componentWillReceiveProps (nextProps) {
    if (!this.props.isFocused && nextProps.isFocused) {
      this.getMyDecks();
    }
    if (this.props.isFocused && !nextProps.isFocused) {
      // screen exit
    }
  }

  shouldComponentUpdate (nextProps) {
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

  componentDidMount () {
    this.getMyDecks();
  }

  render () {
    const { ready, decks } = this.state;

    if (ready === false) {
      return <AppLoading />;
    }

    let deckItems = [];
    _.forOwn(decks, (deck, title) => {
      deckItems.push({ title, cardsNo: deck.questions.length });
    });

    const items = deckItems.map(item =>
      <View style={styles.center} key={item.title} >
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate(
            'DeckDetail',
            {
              title: item.title,
              cardsNo: item.cardsNo
            }
          )}
        >
          <Text style={styles.header} >{item.title}</Text >
          <Text style={styles.subHeader} >{`${item.cardsNo} cards`}</Text >
        </TouchableOpacity >
      </View >
    );

    return (
      <View style={styles.container} >
        {items}
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
  },
  button: {
    padding: 10,
    backgroundColor: 'purple',
    alignSelf: 'center',
    borderRadius: 5,
    margin: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
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

export default withNavigationFocus(Decks);
