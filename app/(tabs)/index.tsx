import { Image, StyleSheet, FlatList } from "react-native";
import axios from "axios";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import { TaskType } from "@/types/Task.type";
import { Snackbar } from "react-native-paper";
import { Task } from "@/components/Task";
import { STRAPI_URL } from "babel-dotenv";

export default function HomeScreen() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isDeleting, setIsDeleting] = useState(false);
  const onToggleSnackBar = () => setIsDeleting(!isDeleting);
  const onDismissSnackBar = () => setIsDeleting(false);

  const [deletingTask, setDeletingTask] = useState<TaskType | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  function loadTasks() {
    axios
      .get(STRAPI_URL + "/tasks")
      .then(({ data }) => {
        setTasks(data.data as TaskType[]);
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setError("An error occured, please try again later.");
        setIsLoading(false);
      });
  }

  function removeTask(task: TaskType) {
    axios
      .delete(STRAPI_URL + `/tasks/${task.id}`)
      .then(({}) => {
        setIsLoading(true);
        setDeletingTask(null);
        loadTasks();
      })
      .catch((e) => {
        console.error(e);
        setError("An error occured, please try again later.");
        setIsLoading(true);
        setDeletingTask(null);
        loadTasks();
      });
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <FlatList
          data={tasks}
          renderItem={({ item }) => (
            <Task
              key={item.id}
              task={item}
              onDelete={(task) => {
                setDeletingTask(task);
                onToggleSnackBar();
              }}
              onUpdate={(task) => {}}
            />
          )}
          ListEmptyComponent={
            <ThemedText type="default">No tasks found.</ThemedText>
          }
          refreshing={isLoading}
          onRefresh={loadTasks}
          style={{ width: "100%", height: "100%" }}
        />
        <Snackbar
          visible={isDeleting}
          onDismiss={onDismissSnackBar}
          action={{
            label: "Got it.",
            onPress: () => {
              removeTask(deletingTask!);
            },
          }}>
          <ThemedText type="default">
            The task {deletingTask?.attributes.goal} has been deleted.
          </ThemedText>
        </Snackbar>
        <Snackbar visible={error.length > 0} onDismiss={() => setError("")}>
          {error}
        </Snackbar>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  captionNoTasks: {
    marginTop: 10,
    textAlign: "center",
  },
});
