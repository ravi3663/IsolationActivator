import React from 'react';
import { Scene, Router, Stack } from 'react-native-router-flux';
import AppLoading from './components/AppLoading';

const Routes = () => (
  <Router>
    <Stack key="root">
      <Scene key="appLoading" component={AppLoading} title="Login" />
    </Stack>
  </Router>
);

export default Routes;
