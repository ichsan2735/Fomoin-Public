import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Home from "../screens/Home"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Profile from "../screens/Profile";
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AddPost from "../screens/AddPost";
import { Image, StyleSheet, View } from "react-native";
import Search from "../screens/Search";

const Tab = createBottomTabNavigator()

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: true,
                tabBarStyle: { position: 'relative' },
                tabBarActiveTintColor: "#0A66C2",
                tabBarInactiveTintColor: "gray",
                tabBarIcon: ({ focused, color, size }) => {
                    let iconColor;

                    if (route.name === "Home") {
                        iconColor = focused ? "#0A66C2" : "gray"
                        return <FontAwesome name="home" size={24} color={iconColor} />
                    }

                    if (route.name === "Search") {
                        iconColor = focused ? "#0A66C2" : "gray"
                        return <FontAwesome5 name="search" size={24} color={iconColor} />
                    }

                    if (route.name === "Create") {
                        iconColor = focused ? "#0A66C2" : "gray"
                        return <Entypo name="squared-plus" size={24} color={iconColor} />
                    }

                    if (route.name === "Network") {
                        iconColor = focused ? "#0A66C2" : "gray"
                        return <FontAwesome6 name="people-group" size={24} color={iconColor} />
                    }

                    if (route.name === "Profile") {
                        iconColor = focused ? "#0A66C2" : "gray"
                        return <Ionicons name="person-sharp" size={20} color={iconColor} />
                    }

                },
            })}
        >

            <Tab.Screen name="Home" options={{
                headerTitle: () => (
                    <View style={styles.header}>
                        <Image source={require('../assets/FinLogo.png')} style={styles.logo} />
                    </View>
                ),
                headerTitleAlign: "center"
            }} component={Home} />
            <Tab.Screen name="Search" component={Search} />
            <Tab.Screen name="Create" component={AddPost} />
            <Tab.Screen name="Network" component={Home} />
            <Tab.Screen name="Profile" component={Profile} />


        </Tab.Navigator>
    )
}
const styles = StyleSheet.create({
    header: {
        flex: 1,
        justifyContent: "center"
    },
    logo: {
        width: 100,
        height: 30,
        resizeMode: 'contain'
    }
})