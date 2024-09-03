import { TaskType } from "@/types/Task.type";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { TabBarIcon } from "./navigation/TabBarIcon";

export type TaskProps = {
  task: TaskType;
  onUpdate: (task: TaskType) => void;
  onDelete: (task: TaskType) => void;
};

export function Task({ task, onDelete, onUpdate }: TaskProps) {
  const [isDone, setIsDone] = useState(task.attributes.isDone);
  const [textColor, setTextColor] = useState<"white" | "green">("white");

  function updateTaskStatus() {
    task.attributes.isDone = isDone;
    setTextColor(isDone ? "green" : "white");
  }

  function removeTask() {
    onDelete(task);
  }

  function updateTask() {
    onUpdate(task);
  }

  return (
    <ThemedView style={styles.taskContainer}>
      <ThemedText type="subtitle">-</ThemedText>
      <ThemedText type="subtitle" style={{ color: textColor }}>
        {task.attributes.goal}
      </ThemedText>
      <ThemedView style={styles.actionContainer}>
        <TabBarIcon name={"trash-bin"} color={"red"} onPress={removeTask} />
        <TabBarIcon name={"pencil"} color={"orange"} onPress={updateTask} />
        <TabBarIcon
          name={"checkmark"}
          color={"green"}
          onPress={(e) => {
            e.preventDefault();
            setIsDone(!isDone);
            updateTaskStatus();
          }}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  actionContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    gap: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "gray",
    padding: 4,
  },
});
