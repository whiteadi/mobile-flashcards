import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { setLocalNotification } from './src/utils';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { Constants } from 'expo';
import { updateFocus } from 'react-navigation-is-focused-hoc';
import Decks from './src/components/Decks';
import AddDeck from './src/components/AddDeck';
import DeckDetail from './src/components/DeckDetail';
import Quiz from './src/components/Quiz';
import AddCard from './src/components/AddCard';

function FCStatusBar ({ backgroundColor, ...props }) {
  return (
    <View style={{ backgroundColor, height: Constants.statusBarHeight }} >
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View >
  );
}

const Tabs = TabNavigator({
  Decks: {
    screen: Decks,
    navigationOptions: {
      tabBarLabel: 'Decks'
    },
  },
  AddDeck: {
    screen: AddDeck,
    navigationOptions: {
      tabBarLabel: 'New Deck'
    }
  }
}, {
  navigationOptions: {
    header: null
  },
  tabBarOptions: {
    activeTintColor: Platform.OS === 'ios' ? 'purple' : 'white',
    style: {
      height: 56,
      backgroundColor: Platform.OS === 'ios' ? 'purple' : 'white',
      shadowColor: 'rgba(0, 0, 0, 0.24)',
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 6,
      shadowOpacity: 1
    }
  }
});

const MainNavigator = StackNavigator({
  Home: {
    screen: Tabs,
  },
  DeckDetail: {
    screen: DeckDetail,
    navigationOptions: {
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: 'purple',
      }
    }
  },
  Quiz: {
    screen: Quiz,
    navigationOptions: {
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: 'purple',
      }
    }
  },
  AddCard: {
    screen: AddCard,
    navigationOptions: {
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: 'purple',
      }
    }
  }
});

export default class App extends React.Component {
  componentDidMount () {
    setLocalNotification();
  }

  render () {
    return (
      <View style={{ flex: 1 }} >
        <FCStatusBar backgroundColor={'purple'} barStyle='light-content' />
        <MainNavigator
          onNavigationStateChange={(prevState, currentState) => {
            updateFocus(currentState);
          }}
        />
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
