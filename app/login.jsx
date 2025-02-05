import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginPage() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const ProceedLogin = async () => {
    if (validation()) {
      try {
        const response = await fetch(`http://localhost:3000/users?email=${email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }

        const resp = await response.json();
        console.log(resp);

        if (resp.length === 0) {
          Alert.alert('Error', 'Please enter a valid user');
        } else {
          const user = resp[0];

          if (user.password === password) {
            navigation.navigate('HomePage');
          } else {
            Alert.alert('Error', 'Please enter valid credentials');
          }
        }
      } catch (err) {
        Alert.alert('Login failed', `Login failed due to: ${err.message}`);
      }
    }
  };

  const validation = () => {
    let result = true;
    if (email === '' || email === null) {
      result = false;
      Alert.alert('Validation Error', 'Please enter your email');
    }
    if (password === '' || password === null) {
      result = false;
      Alert.alert('Validation Error', 'Please enter your password');
    }
    return result;
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://your-image-url.com/FoxTrot.jpg' }} style={styles.image} />
      <Text style={styles.title}>Log in</Text>
      <TextInput
        style={styles.input}
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Submit" onPress={ProceedLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('RegistrationPage')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 400,
    height: 500,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  link: {
    color: 'blue',
    marginTop: 20,
  },
});
