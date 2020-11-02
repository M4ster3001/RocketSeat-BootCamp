import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text, StyleSheet, StatusBar, ScrollView, FlatList, TouchableOpacity, TextInput } from 'react-native'

import api from './services/api'

export default function App() {
    const [projects, setProjects] = useState([])
    const [title, setTitle] = useState('')
    const [owner, setOwner] = useState('')

    useEffect( () => {
        api.get('projects').then( response => {

            setProjects( response.data )
        })
    }, [])

    async function handleNewProject() {
        const data = {
            title,
            owner
        }

        api.post('projects', data).then( response => {

            setProjects([...projects, response.data]) 
        } )
    }

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="#7159c1"/>

            <SafeAreaView style={styles.container}>
                <TextInput 
                    style={styles.input}
                    onChangeText={ text => setTitle(text) }
                    value={title}
                    placeholder="Titulo do projeto"
                />
                <TextInput 
                    style={styles.input}
                    onChangeText={ text => setOwner(text) }
                    value={owner}
                    placeholder="Autor do projeto"
                />

                <TouchableOpacity 
                    style={styles.button}
                    onPress={handleNewProject}
                >
                    <Text style={styles.buttonText}>
                        Adicionar projeto
                    </Text>
                </TouchableOpacity>

                <FlatList 
                    data={projects}
                    keyExtractor={ project => project.id }
                    renderItem={({ item: project}) => (
                        <Text>{project.title} - {project.owner}</Text>
                    )}
                />
            </SafeAreaView>

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7159c1',
        paddingTop: 8
    },

    button: {
        backgroundColor: '#fff',
        margin: 20,
        height: 50,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        fontWeight: 'bold',
        fontSize: 16
    },

    input: {
        height: 38,
        borderWidth: 1,
        borderColor: 'gray',
        paddingLeft: 6,    
        margin: 15,
        backgroundColor: '#fff',
        borderRadius: 5   
    }
})