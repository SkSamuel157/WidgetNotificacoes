import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import WidgetNotificacoes from './WidgetNotificacoes';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <WidgetNotificacoes />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
