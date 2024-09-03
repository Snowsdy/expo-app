import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Task } from "@/components/Task";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TaskType } from "@/types/Task.type";
import axios from "axios";
import { STRAPI_URL } from "babel-dotenv";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet } from "react-native";
import {
  Button,
  Dialog,
  PaperProvider,
  Portal,
  Snackbar,
  TextInput,
} from "react-native-paper";

export default function HomeScreen() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isDeleting, setIsDeleting] = useState(false);
  const onToggleSnackBar = () => setIsDeleting(!isDeleting);
  const onDismissSnackBar = () => setIsDeleting(false);

  const [deletingTask, setDeletingTask] = useState<TaskType | null>(null);
  const [updatingTask, setUpdatingTask] = useState<TaskType | null>(null);

  const [updatedGoal, setUpdatedGoal] = useState("");

  loadTasks();

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

  function updateTask(task: TaskType, updatedGoal: string) {
    axios
      .put<TaskType>(
        STRAPI_URL + `/tasks/${task.id}`,
        JSON.stringify({
          data: {
            goal: updatedGoal,
            isDone: task.attributes.isDone,
          },
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(({}) => {
        setIsLoading(true);
        setUpdatingTask(null);
        loadTasks();
      })
      .catch((e) => {
        console.error(e);
        setError("An error occured, please try again later.");
        setIsLoading(true);
        setUpdatingTask(null);
        loadTasks();
      });
  }

  return (
    <PaperProvider>
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
                onUpdate={(task) => {
                  setUpdatingTask(task);
                  setUpdatedGoal(task.attributes.goal);
                }}
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
          <Portal>
            <Dialog
              visible={updatingTask ? true : false}
              onDismiss={() => setUpdatingTask(null)}>
              <Dialog.Title>Updating Task</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  label="Goal"
                  value={updatedGoal}
                  onChangeText={(text) => setUpdatedGoal(text)}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={(e) => {
                    e.preventDefault();
                    updateTask(updatingTask!, updatedGoal);
                  }}>
                  <ThemedText type="default">Update</ThemedText>
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </ThemedView>
      </ParallaxScrollView>
    </PaperProvider>
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
