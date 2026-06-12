import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge, getToolCallLabel } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

// --- getToolCallLabel unit tests ---

test("str_replace_editor create shows filename", () => {
  expect(getToolCallLabel("str_replace_editor", { command: "create", path: "/components/Button.jsx" })).toBe("Creating Button.jsx");
});

test("str_replace_editor create with no path shows generic label", () => {
  expect(getToolCallLabel("str_replace_editor", { command: "create" })).toBe("Creating file");
});

test("str_replace_editor str_replace shows Editing", () => {
  expect(getToolCallLabel("str_replace_editor", { command: "str_replace", path: "/App.jsx" })).toBe("Editing App.jsx");
});

test("str_replace_editor insert shows Editing", () => {
  expect(getToolCallLabel("str_replace_editor", { command: "insert", path: "/lib/utils.ts" })).toBe("Editing utils.ts");
});

test("str_replace_editor view shows Viewing", () => {
  expect(getToolCallLabel("str_replace_editor", { command: "view", path: "/App.jsx" })).toBe("Viewing App.jsx");
});

test("str_replace_editor unknown command falls back", () => {
  expect(getToolCallLabel("str_replace_editor", { command: "unknown", path: "/App.jsx" })).toBe("Editing files");
});

test("str_replace_editor no args falls back", () => {
  expect(getToolCallLabel("str_replace_editor", {})).toBe("Editing files");
});

test("file_manager rename shows old and new filename", () => {
  expect(
    getToolCallLabel("file_manager", { command: "rename", path: "/Button.jsx", new_path: "/components/Button.jsx" })
  ).toBe("Renaming Button.jsx → Button.jsx");
});

test("file_manager rename with no new_path omits arrow", () => {
  expect(getToolCallLabel("file_manager", { command: "rename", path: "/Button.jsx" })).toBe("Renaming Button.jsx");
});

test("file_manager delete shows filename", () => {
  expect(getToolCallLabel("file_manager", { command: "delete", path: "/old/Component.jsx" })).toBe("Deleting Component.jsx");
});

test("file_manager unknown command falls back", () => {
  expect(getToolCallLabel("file_manager", { command: "move", path: "/App.jsx" })).toBe("Managing files");
});

test("unknown tool name returns tool name as-is", () => {
  expect(getToolCallLabel("some_other_tool", { command: "run" })).toBe("some_other_tool");
});

// --- ToolCallBadge rendering tests ---

test("ToolCallBadge renders label for create command", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("ToolCallBadge renders label for str_replace command", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "str_replace", path: "/components/Card.tsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Editing Card.tsx")).toBeDefined();
});

test("ToolCallBadge shows green dot when done", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="result"
      result="File created"
    />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
});

test("ToolCallBadge shows spinner when in progress", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="call"
    />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
});

test("ToolCallBadge treats result=null as still in progress", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="result"
      result={null}
    />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("ToolCallBadge renders file_manager delete label", () => {
  render(
    <ToolCallBadge
      toolName="file_manager"
      args={{ command: "delete", path: "/old/Legacy.jsx" }}
      state="result"
      result="Deleted"
    />
  );
  expect(screen.getByText("Deleting Legacy.jsx")).toBeDefined();
});
