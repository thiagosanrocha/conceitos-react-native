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

import api from './services/api';

export default function App() {
  const [repositories, setRepositories] = useState([]);
  const [errorApi, setErrorApi] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    (async function request(){
      try {
        const { data } = await api.get("/repositories");

        setRepositories(data);
      } catch {
        setErrorApi(true);
      }
    })();

    setLoading(false);
  }, []);

  async function handleLikeRepository(id) {
    const { data } = await api.post(`/repositories/${id}/like`);

    const repoIndex = repositories.findIndex(repo => repo.id === id);

    setRepositories([...repositories.fill(data, repoIndex, repoIndex + 1)]);
  }

  if (loading) {
    return (
      <View style={styles.containerLoadingOrError}>
        <Text style={styles.textLoadingOrError}>
          Carregando...
        </Text>
      </View>
    );
  }

  if (errorApi) {
    return (
      <View style={styles.containerLoadingOrError}>
        <Text style={styles.textLoadingOrError}>
          Não foi possível consultar os repositórios, verifique sua conexão
        </Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList 
          data={repositories}
          keyExtractor={repo => repo.id}
          renderItem={({ item: repo }) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{ repo.title }</Text>
    
              <View style={styles.techsContainer}>
                {repo.techs.map(tech => (
                  <Text key={tech} style={styles.tech}>{tech}</Text>
                ))}
              </View>
    
              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repo.id}`}
                >
                  {repo.likes} curtidas
                </Text>
              </View>
    
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repo.id)}
                testID={`like-button-${repo.id}`}
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
  },
  containerLoadingOrError: {
    flex: 1,
    backgroundColor: '#7159c1',
    justifyContent: 'center',
    alignItems: 'center', 
  },
  textLoadingOrError: {
    textAlign: 'center',
    fontSize: 16,
    color: '#FFF',
  }
});
