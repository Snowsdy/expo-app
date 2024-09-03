import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import axios from "axios";
import { STRAPI_URL } from "babel-dotenv";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Button, PaperProvider, Snackbar, TextInput } from "react-native-paper";

export default function NewTaskScreen() {
  const [goal, setGoal] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);

  const router = useRouter();

  const onToggleSnackBar = () => setIsSnackbarVisible(!isSnackbarVisible);
  const onDismissSnackBar = () => setIsSnackbarVisible(false);

  const createTask = async () => {
    setIsSaving(true);
    try {
      await axios.post(
        `${STRAPI_URL}/tasks`,
        {
          data: {
            goal: goal,
            isDone: false, // Defaulting new tasks to not done
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setIsSaving(false);
      setGoal("");
      router.back();
    } catch (e) {
      console.error(e);
      setError("An error occurred while saving the task. Please try again.");
      setIsSaving(false);
      onToggleSnackBar();
    }
  };

  return (
    <PaperProvider>
      <ThemedView style={styles.container}>
        <TextInput
          label="Goal"
          value={goal}
          onChangeText={setGoal}
          mode="outlined"
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={createTask}
          loading={isSaving}
          disabled={!goal || isSaving}
          style={styles.button}>
          <ThemedText type="default">Save Task</ThemedText>
        </Button>
        <Snackbar
          visible={isSnackbarVisible}
          onDismiss={onDismissSnackBar}
          action={{
            label: "Close",
            onPress: () => {
              setIsSnackbarVisible(false);
            },
          }}>
          {error}
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
