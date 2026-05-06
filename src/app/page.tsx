"use client";

import { useState, useEffect } from "react";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

const APP_TITLE = process.env.NEXT_PUBLIC_APP_TITLE || "タスク管理アプリ";
const STORAGE_KEY = "tasks";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setTasks(JSON.parse(saved));
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, loaded]);

  const addTask = () => {
    const title = newTask.trim();
    if (!title) return;
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [task, ...prev]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const activeCount = tasks.filter((t) => !t.completed).length;

  if (!loaded) return null;

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-center mb-8">{APP_TITLE}</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="新しいタスクを入力..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTask}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          追加
        </button>
      </div>

      <div className="flex gap-1 mb-4">
        {(["all", "active", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 text-xs rounded-full ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {f === "all" ? "すべて" : f === "active" ? "未完了" : "完了済み"}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 self-center">
          残り {activeCount} 件
        </span>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">
          タスクがありません
        </p>
      ) : (
        <ul className="space-y-2">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="w-4 h-4 accent-blue-600"
              />
              <span
                className={`flex-1 text-sm ${
                  task.completed
                    ? "line-through text-gray-400"
                    : "text-gray-800"
                }`}
              >
                {task.title}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-gray-300 hover:text-red-500 text-lg"
                title="削除"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}

      <footer className="mt-10 text-center text-xs text-gray-400">
       Hands-on（自動デプロイ確認）
      </footer>
    </main>
  );
}
