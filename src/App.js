import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from "./services/api";

export default function App() {
  const[repositories, setRepositories] = useState([])

  useEffect(() => {
    async function GetAllRepositories() {

      api.get('repositories').then(response => {

        setRepositories(response.data)
      })
    }

    GetAllRepositories()
  }, [])

  async function handleLikeRepository(id) {
    
    api.post(`repositories/${id}/like`).then(response => {
      const repositoryIndex = repositories.findIndex( repository => repository.id === id )
      repositories[repositoryIndex] = response.data
      
      setRepositories( repositories=> [...repositories] )
    } )
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        
        <FlatList 
          data={repositories}
          keyExtractor={ repository => repository.id }
          renderItem={ ({ item: repository }) => (

            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repository.title}</Text>

              <View style={styles.techsContainer}>
                { repository.techs &&
                  repository.techs.map( ( tech, key ) =>
                    <Text style={styles.tech} key={key}>
                      {tech}
                    </Text>
                  )

                }
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repository.id}`}
                >
                  { repository.likes > 0 ?
                      repository.likes > 1 
                        ? `${repository.likes} curtidas` 
                        : '1 curtida'
                    : 'Sem curtidas'
                  }
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                testID={`like-button-${repository.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          )}        
        />


      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
    paddingTop: 10
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
    textAlign: 'center',
    borderRadius: 8
  },
});