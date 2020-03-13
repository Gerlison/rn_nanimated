import React from 'react';
import { View, SafeAreaView } from 'react-native';
import ClickAnimations from './screens/ClickAnimations';
import SideCardAnimation from './screens/SideCardAnimation';

const App = () => (
  <>
    <View style={{ flex: 1 }}>
      <SideCardAnimation />
      {/* <ClickAnimations /> */}
    </View>
  </>
);

export default App;
