import { postTodo } from "@/api/crud";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Button, PaperProvider, Snackbar, TextInput } from "react-native-paper";

export default function NewTaskScreen() {
  const [goal, setGoal] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  const queryClient = useQueryClient();
  const postMutation = useMutation({
    mutationFn: postTodo,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setGoal("");
      router.back();
    },
  });

  return (
    <PaperProvider>
      <ThemedView style={styles.container}>
        <ThemedText
          type="title"
          style={{ textAlign: "center", marginBottom: 8 }}>
          Add a new Task
        </ThemedText>
        <TextInput
          label="Goal"
          value={goal}
          onChangeText={setGoal}
          mode="outlined"
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={() => {
            postMutation.mutate(goal);
          }}
          loading={isSaving}
          disabled={!goal || isSaving}
          style={styles.button}>
          <ThemedText type="default">Save Task</ThemedText>
        </Button>
        <Snackbar
          visible={postMutation.error != null ? true : false}
          onDismiss={() => {}}
          action={{
            label: "Close",
            onPress: () => {
              postMutation.error = null;
            },
          }}>
          {postMutation.error?.message}
        </Snackbar>
      </ThemedView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});
