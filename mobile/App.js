import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, AuthContext } from './src/context/AuthContext';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import RecipeScreen from './src/screens/RecipeScreen';
import MyRecipeScreen from './src/screens/MyRecipeScreen';
import AddRecipeScreen from './src/screens/AddRecipeScreen';
import UpdateRecipeScreen from './src/screens/UpdateRecipeScreen';
import RecipeDetailScreen from './src/screens/RecipeDetailScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const RecipeStack = createStackNavigator();
const MyRecipeStack = createStackNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
  </HomeStack.Navigator>
);

const RecipeStackScreen = () => (
  <RecipeStack.Navigator>
    <RecipeStack.Screen name="RecipeList" component={RecipeScreen} options={{ headerTitle: 'Resep' }} />
    <RecipeStack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{ headerTitle: 'Detail Resep' }} />
  </RecipeStack.Navigator>
);

const MyRecipeStackScreen = () => (
  <MyRecipeStack.Navigator>
    <MyRecipeStack.Screen name="MyRecipeList" component={MyRecipeScreen} options={{ headerTitle: 'Resep Saya', headerShown: false }} />
    <MyRecipeStack.Screen name="AddRecipe" component={AddRecipeScreen} options={{ headerTitle: 'Tambah Resep' }} />
    <MyRecipeStack.Screen name="UpdateRecipe" component={UpdateRecipeScreen} options={{ headerTitle: 'Update Resep' }} />
    <MyRecipeStack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{ headerTitle: 'Detail Resep' }} />
  </MyRecipeStack.Navigator>
);

const AppNav = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken === null ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      ) : (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#3B82F6',
            tabBarInactiveTintColor: 'gray',
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'HomeTab') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'RecipeTab') {
                iconName = focused ? 'restaurant' : 'restaurant-outline';
              } else if (route.name === 'MyRecipeTab') {
                iconName = focused ? 'book' : 'book-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="HomeTab" component={HomeStackScreen} options={{ title: 'Beranda' }} />
          <Tab.Screen name="RecipeTab" component={RecipeStackScreen} options={{ title: 'Resep' }} />
          <Tab.Screen name="MyRecipeTab" component={MyRecipeStackScreen} options={{ title: 'Resep Saya' }} />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppNav />
    </AuthProvider>
  );
}
