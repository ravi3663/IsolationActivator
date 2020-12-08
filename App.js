import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { Provider } from 'react-redux';
import { Store } from './src/reducers/index';

import Routes from './src/Routes';

class App extends Component {
  render() {
    return (
      <View style={styles.safeArea}>
        <Provider store={Store}>
          <View style={styles.appLayout}>
            <SafeAreaView>
              <Routes />
            </SafeAreaView>
          </View>
        </Provider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: '#fff'
    // position: 'absolute'
  },
  appLayout: {
    flex: 1
  },
});

export default App;
