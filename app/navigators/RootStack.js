import { createNativeStackNavigator } from "@react-navigation/native-stack"
import TabNavigator from "./TabNavigator"
import Detail from "../screens/Detail"
import Login from "../screens/Login"
import Register from "../screens/Register"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../contexts/AuthContext"
import * as SecureStore from "expo-secure-store"
import { Text, View } from "react-native"
import CurrentUserFollows from "../screens/CurrentUserFollows"
import LikeLists from "../screens/LikeLists"
import UsersProfile from "../screens/UsersProfile"


const Stack = createNativeStackNavigator()

export default function RootStack() {
    const { isLogin, setIsLogin } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkLogin = async () => {
            const token = await SecureStore.getItemAsync("access_token")

            if (token) setIsLogin(true)

            setLoading(false)
        }

        checkLogin()
    }, [])

    if (loading) {
        return <View>
            <Text>Loading...</Text>
        </View>
    }

    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            {
                !isLogin ? <>
                        <Stack.Screen name="Login" component={Login} /> 
                        <Stack.Screen name="Register" component={Register}/>

                </>
                
                :
                    <>
                        <Stack.Screen name="Home" component={TabNavigator} />
                        <Stack.Screen name="Detail" options={{headerShown: true}} component={Detail}/>
                        <Stack.Screen name="Follows" options={{headerShown: true}} component={CurrentUserFollows}/>
                        <Stack.Screen name="Likes" options={{headerShown: true}} component={LikeLists}/>
                        <Stack.Screen name="UserProfile" options={{headerShown: true}} component={UsersProfile}/>

                    </>
            }
        </Stack.Navigator>
    )
}