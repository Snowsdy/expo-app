import { deleteTodo, getTodos, putTodo } from "@/api/crud";
import { Task } from "@/components/Task";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TaskType } from "@/types/Task.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import {
  Button,
  Dialog,
  PaperProvider,
  Portal,
  Snackbar,
  TextInput,
} from "react-native-paper";

export default function HomeScreen() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["todos"], queryFn: getTodos });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const putMutation = useMutation({
    mutationFn: putTodo,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setUpdatedGoal("");
      setUpdatingTask(null);
    },
  });

  const [updatingTask, setUpdatingTask] = useState<TaskType | null>(null);
  const [updatedGoal, setUpdatedGoal] = useState("");

  return (
    <PaperProvider>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">My TaskList</ThemedText>
        <FlatList
          data={query.data}
          renderItem={({ item }) => (
            <Task
              key={item.id}
              task={item}
              onDelete={(task) => {
                deleteMutation.mutate(task.id);
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
          refreshing={query.isFetching}
          style={{ width: "100%", height: "100%" }}
        />
        <Snackbar
          visible={query.error != null ? true : false}
          onDismiss={() => {}}>
          {query.error?.message}
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
                  var updatedTask = updatingTask!;
                  updatedTask.attributes.goal = updatedGoal;
                  putMutation.mutate(updatedTask);
                }}>
                <ThemedText type="default">Update</ThemedText>
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ThemedView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    padding: 48,
    gap: 16,
    overflow: "hidden",
    alignItems: "center",
    // gap: 8,
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
