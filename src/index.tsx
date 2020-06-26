import React from 'react';
import { View, SafeAreaView } from 'react-native';
import ClickAnimations from './screens/ClickAnimations';
import SideCardAnimation from './screens/SideCardAnimation';
import SpinningWheel from './screens/SpinningWheel';

const App = () => (
  <>
    {/* <SafeAreaView /> */}
    <View style={{ flex: 1 }}>
      {/* <SideCardAnimation /> */}
      {/* <ClickAnimations /> */}
      <SpinningWheel />
    </View>
  </>
);

export default App;
