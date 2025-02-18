import { useContext, useState } from "react";
import { Image, Text, View, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { gql, useMutation } from "@apollo/client"
import * as SecureStore from "expo-secure-store"
import { useNavigation } from "@react-navigation/native";
import Feather from '@expo/vector-icons/Feather';


const LOGIN = gql`
    mutation Login($username: String, $password: String) {
        login(username: $username, password: $password) {
            access_token
        }
}
`

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const { setIsLogin } = useContext(AuthContext)

    const navigation = useNavigation()

    const [login, { loading }] = useMutation(LOGIN)
    const [showPassword, setShowPassword] = useState(false)

    async function submitLogin() {
        try {
            const result = await login({
                variables: {
                    username,
                    password
                }
            })

            setIsLogin(true)

            const access_token = result.data.login.access_token
            await SecureStore.setItemAsync("access_token", access_token)

        } catch (error) {
            Alert.alert(error.message)
        }
    }

    return (
        <View style={styles.container}>

            <View style={styles.card}>

                {/* Fin logo */}
                <Image
                    source={require("../assets/Fin.png")}
                    style={styles.logo}
                />

                <Text style={styles.title}>Login First</Text>


                {/* input */}

                {/* username */}
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#666"
                    onChangeText={setUsername}
                    value={username}
                />

                {/* password */}
                <View style={{position: "relative"}}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#666"
                        secureTextEntry={!showPassword}
                        onChangeText={setPassword}
                        value={password}
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: 15,            
                            height: '100%',       
                            justifyContent: 'center',
                            marginTop: -5
                        }}
                    >
                        <Feather
                            name={showPassword ? "eye-off" : "eye"}
                            size={24}
                            color="black"
                        />
                    </TouchableOpacity>
                </View>


                {/* button */}
                {loading ? (
                    <ActivityIndicator />
                ) : (
                    <TouchableOpacity onPress={submitLogin} style={styles.button}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                )}


                {/* register */}
                <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                    <Text style={styles.register}>Do not have any account? Register</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '100%',
        maxWidth: 400,
        elevation: 1,
        marginTop: -50
    },
    logo: {
        width: 75,
        height: 75,
        alignSelf: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderRadius: 5,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        backgroundColor: '#0A66C2',
        padding: 15,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    register: {
        color: '#0A66C2',
        textAlign: 'center',
        marginTop: 15,
    }
});