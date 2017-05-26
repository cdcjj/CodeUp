import React from 'react';
import { connect } from 'react-redux';
import GrommetApp from 'grommet/components/App';
import Box from 'grommet/components/Box';
import Split from 'grommet/components/Split';
import Animate from 'grommet/components/Animate';

import LoginComponent from './components/LoginComponent';
import Events from './containers/Events';
import Profile from './containers/Profile';

const App = () => (
  <GrommetApp>
    <Animate
      enter={{ animation: 'fade', duration: 5000, delay: 0 }}
      keep
    >
      <LoginComponent />
    </Animate>
    <Events />
    <Split>
      <Box
        colorIndex={'neutral-1'}
        justify={'center'}
        align={'center'}
        pad={'medium'}
      >
        Left Side
      </Box>
      <Box
        colorIndex={'neutral-2'}
        justify={'center'}
        align={'center'}
        pad={'medium'}
      >
        Right Side
      </Box>
    </Split>
    <Profile />
  </GrommetApp>
);

export default connect()(App);
