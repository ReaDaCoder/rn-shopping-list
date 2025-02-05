import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function ShoppingList() {
  const [input, setInput] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/items')
      .then(response => setItems(response.data))
      .catch(error => Alert.alert('Error', 'Error fetching items: ' + error.message));
  }, []);

  const addItemHandler = () => {
    if (input.trim()) {
      const newItem = { id: Date.now(), name: input };

      axios.post('http://localhost:3000/items', newItem)
        .then(response => {
          setItems([...items, response.data]);
          setInput('');
        })
        .catch(error => Alert.alert('Error', 'Error adding item: ' + error.message));
    }
  };

  const deleteItemHandler = (id) => {
    axios.delete(`http://localhost:3000/items/${id}`)
      .then(() => {
        setItems(items.filter(item => item.id !== id));
      })
      .catch(error => Alert.alert('Error', 'Error deleting item: ' + error.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping List</Text>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input}
          value={input} 
          onChangeText={setInput} 
          placeholder="Add an item"
        />
        <Button title="Add Item" onPress={addItemHandler} />
      </View>
      <FlatList
        data={items}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.name}</Text>
            <TouchableOpacity onPress={() => deleteItemHandler(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    height: 40,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 18,
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
  },
});
