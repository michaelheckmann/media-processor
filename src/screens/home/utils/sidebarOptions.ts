type SideBarOptions<T> = Array<{
  label: string;
  value: T;
}>;

export type TaskOption =
  | ""
  | "reduce"
  | "transcribe"
  | "anonymize"
  | "ner"
  | "upload";
export const TASKS: SideBarOptions<TaskOption> = [
  {
    label: "Choose a task",
    value: "",
  },
  {
    label: "Video reduction",
    value: "reduce",
  },
  {
    label: "Transcription",
    value: "transcribe",
  },
  {
    label: "Anonymization",
    value: "anonymize",
  },
  {
    label: "Entity recognition",
    value: "ner",
  },
  {
    label: "S3 Upload",
    value: "upload",
  },
];

export type CompressionOption = "low" | "medium" | "high";
export const COMPRESSIONS: SideBarOptions<CompressionOption> = [
  {
    label: "Low",
    value: "low",
  },
  {
    label: "Medium",
    value: "medium",
  },
  {
    label: "High",
    value: "high",
  },
];
