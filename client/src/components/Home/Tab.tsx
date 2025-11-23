import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface TabsProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

export default function Tabs({ activeTab, onChange }: TabsProps) {
  return (
    <View style={styles.tabs}>
      <TouchableOpacity onPress={() => onChange('all')}>
        <Text style={[styles.tab, activeTab === 'all' && styles.activeTab]}>Все</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onChange('open')}>
        <Text style={[styles.tab, activeTab === 'open' && styles.activeTab]}>
          Работают сейчас
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', marginBottom: 12 },
  tab: {
    fontSize: 12,
    color: '#777',
    marginRight: 16,
    paddingBottom: 4,
    paddingLeft: 10,
  },
  activeTab: {
    color: '#000',
    borderBottomWidth: 2,
    borderBottomColor: '#CDE589',
  },
});