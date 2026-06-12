"use client";

import { Loader2 } from "lucide-react";

interface ToolCallBadgeProps {
  toolName: string;
  args: Record<string, any>;
  state: string;
  result?: any;
}

export function getToolCallLabel(toolName: string, args: Record<string, any>): string {
  const { command, path, new_path } = args ?? {};
  const filename = path?.split("/").pop() ?? "";

  if (toolName === "str_replace_editor") {
    switch (command) {
      case "create":   return filename ? `Creating ${filename}` : "Creating file";
      case "str_replace": return filename ? `Editing ${filename}` : "Editing file";
      case "insert":   return filename ? `Editing ${filename}` : "Editing file";
      case "view":     return filename ? `Viewing ${filename}` : "Viewing file";
      default:         return "Editing files";
    }
  }

  if (toolName === "file_manager") {
    const newFilename = new_path?.split("/").pop() ?? "";
    switch (command) {
      case "rename": return filename ? `Renaming ${filename}${newFilename ? ` → ${newFilename}` : ""}` : "Renaming file";
      case "delete": return filename ? `Deleting ${filename}` : "Deleting file";
      default:       return "Managing files";
    }
  }

  return toolName;
}

export function ToolCallBadge({ toolName, args, state, result }: ToolCallBadgeProps) {
  const label = getToolCallLabel(toolName, args);
  const isDone = state === "result" && result != null;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600 flex-shrink-0" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
