// форма заказа для компонета заказа
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface OrderFormProps {
  tableNumber: string;
  setTableNumber: (value: string) => void;
  message: string;
  setMessage: (value: string) => void;
  error?: string;
}

export default function OrderForm({
  tableNumber,
  setTableNumber,
  message,
  setMessage,
  error
}: OrderFormProps) {
  return (
    <View style={styles.container}>

      {/* Номер стола */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Номер стола *</Text>

        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="Введите номер стола"
          placeholderTextColor="#999"
          value={tableNumber}
          onChangeText={setTableNumber}
          keyboardType="number-pad"
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      {/* Сообщение */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Ваше сообщение</Text>
        <TextInput
          style={[styles.input, styles.messageInput]}
          placeholder="Напишите ваши пожелания..."
          placeholderTextColor="#999"
          value={message}
          onChangeText={setMessage}
          multiline
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity style={styles.agreementLink}>
        <Text style={styles.agreementText}>Пользовательское соглашение</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  messageInput: {
    height: 80,
  },
  agreementLink: {
    marginBottom: 16,
  },
  agreementText: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'underline',
  },
  inputError: {
    borderColor: 'red',
  },

  errorText: {
    color: 'red',
    fontSize: 13,
    marginTop: 6,
  },
});