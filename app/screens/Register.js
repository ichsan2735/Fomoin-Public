import { useState } from "react";
import { Image, Text, View, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { gql, useMutation } from "@apollo/client"
import { useNavigation } from "@react-navigation/native";
import Feather from '@expo/vector-icons/Feather';



const REGISTER = gql`
    mutation Register($name: String, $username: String, $email: String, $password: String) {
        register(name: $name, username: $username, email: $email, password: $password)
}
`

export default function Register() {
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [register, { loading }] = useMutation(REGISTER)
    const [showPassword, setShowPassword] = useState(false)

    const navigation = useNavigation()

    async function submitRegister() {
        try {
            const result = await register({
                variables: {
                    name,
                    username,
                    email,
                    password
                }
            })

            navigation.navigate("Login")

            Alert.alert(result.data.register)

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

                <Text style={styles.title}>Create Account</Text>


                {/* form */}
                <View style={styles.formInput}>

                    {/* name */}
                    <Text>Name</Text>
                    <TextInput
                        style={styles.input}
                        // placeholder="name"
                        placeholderTextColor="#666"
                        onChangeText={setName}
                        value={name}
                    />

                    {/* username */}
                    <Text>Username</Text>
                    <TextInput
                        style={styles.input}
                        // placeholder="Username"
                        placeholderTextColor="#666"
                        onChangeText={setUsername}
                        value={username}
                    />

                    {/* email */}
                    <Text>Email</Text>
                    <TextInput
                        style={styles.input}
                        // placeholder="Email"
                        placeholderTextColor="#666"
                        onChangeText={setEmail}
                        value={email}
                    />

                    {/* password */}
                    <Text>Password</Text>
                    {/* password */}
                    <View style={{ position: "relative" }}>
                        <TextInput
                            style={styles.input}
                            // placeholder="Password"
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

                </View>

                {/* button */}
                {loading ? (
                    <ActivityIndicator />
                ) : (
                    <TouchableOpacity onPress={submitRegister} style={styles.button}>
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                )}


                {/* login */}
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.register}>Already has account? Login</Text>
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
    formInput: {
        alignItems: "start",
        width: "100%"
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