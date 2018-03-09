import { AsyncStorage } from 'react-native';
import { DECKS } from '../constants';

export function getDecks () {
  return AsyncStorage.getItem(DECKS);
}

export function getDeck (id) {
  return AsyncStorage.getItem(DECKS)
    .then((decks) => {
      return JSON.parse(decks)[id];
    });
}

export function saveDeckTitle (title) {
  return AsyncStorage.mergeItem(DECKS, JSON.stringify({
    [title]: {
      title,
      questions: []
    }
  }));
}

export function addCardToDeck (title, card) {
  getDeck(title).then(deck => {
      deck.questions.push(card);
      return AsyncStorage.mergeItem(DECKS, JSON.stringify(
        { [title]: deck }
      ));
    }
  );
}
