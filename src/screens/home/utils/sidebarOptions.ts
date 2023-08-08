type SideBarOptions<T> = Array<{
  label: string;
  value: T;
  disabled?: boolean;
}>;

export type TaskOption =
  | ""
  | "compress"
  | "transcribe"
  | "anonymize"
  | "ner"
  | "redact"
  | "upload";
export const TASKS: SideBarOptions<TaskOption> = [
  {
    label: "Choose a task",
    value: "",
  },
  {
    label: "Video compression",
    value: "compress",
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
    disabled: true,
  },
  {
    label: "Redaction",
    value: "redact",
  },
  {
    label: "S3 Upload",
    value: "upload",
    disabled: true,
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

export type ModelOption = "whisper-large" | "nova";
export const MODELS: SideBarOptions<ModelOption> = [
  {
    label: "Whisper",
    value: "whisper-large",
  },
  {
    label: "Nova",
    value: "nova",
  },
];

export type AnonymizationStrengthOption = "low" | "medium" | "high";
export const ANONYMIZATIONS: SideBarOptions<AnonymizationStrengthOption> = [
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
