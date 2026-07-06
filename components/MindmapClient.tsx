"use client";

import { useState, useRef, useCallback, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MindNode {
  id: string;
  text: string;
  children: MindNode[];
}

interface Layout {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Camera {
  x: number;
  y: number;
  zoom: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NODE_H = 36;
const NODE_PADDING_X = 18;
const H_GAP = 80;   // horizontal gap between levels
const V_GAP = 14;   // vertical gap between siblings
const STORAGE_KEY = "gadify_mindmap_v1";

const PALETTE = [
  "#6366f1", "#8b5cf6", "#ec4899", "#3b82f6",
  "#10b981", "#f59e0b", "#ef4444", "#06b6d4",
];

const DEFAULT_MAP: MindNode = {
  id: "root",
  text: "Main Topic",
  children: [
    {
      id: "n1", text: "Branch 1", children: [
        { id: "n1a", text: "Idea A", children: [] },
        { id: "n1b", text: "Idea B", children: [] },
      ]
    },
    { id: "n2", text: "Branch 2", children: [] },
    { id: "n3", text: "Branch 3", children: [] },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

let _idCounter = 0;
function newId() { return `n${Date.now()}${_idCounter++}`; }

function cloneTree(node: MindNode): MindNode {
  return { ...node, children: node.children.map(cloneTree) };
}

function findNode(root: MindNode, id: string): MindNode | null {
  if (root.id === id) return root;
  for (const c of root.children) {
    const found = findNode(c, id);
    if (found) return found;
  }
  return null;
}

function findParent(root: MindNode, id: string): MindNode | null {
  for (const c of root.children) {
    if (c.id === id) return root;
    const found = findParent(c, id);
    if (found) return found;
  }
  return null;
}

function depthOf(root: MindNode, id: string, depth = 0): number {
  if (root.id === id) return depth;
  for (const c of root.children) {
    const d = depthOf(c, id, depth + 1);
    if (d >= 0) return d;
  }
  return -1;
}

// ─── Layout engine ────────────────────────────────────────────────────────────
// Horizontal tree layout: root on left, children branch right.
// Each subtree gets a vertical slot proportional to its leaf count.

function measureText(text: string) {
  // Approximate: 8px per char, min 80, max 200
  return Math.min(200, Math.max(80, text.length * 8 + NODE_PADDING_X * 2));
}

function subtreeHeight(node: MindNode): number {
  if (!node.children.length) return NODE_H;
  const childrenH = node.children.reduce((s, c) => s + subtreeHeight(c) + V_GAP, 0) - V_GAP;
  return Math.max(NODE_H, childrenH);
}

function buildLayout(
  node: MindNode,
  x: number,
  centerY: number,
  layouts: Layout[],
) {
  const w = measureText(node.text);
  layouts.push({ id: node.id, x, y: centerY - NODE_H / 2, width: w, height: NODE_H });

  if (!node.children.length) return;

  const totalH = subtreeHeight(node);
  let curY = centerY - totalH / 2;

  for (const child of node.children) {
    const ch = subtreeHeight(child);
    buildLayout(child, x + w + H_GAP, curY + ch / 2, layouts);
    curY += ch + V_GAP;
  }
}

function computeLayouts(root: MindNode): Layout[] {
  const layouts: Layout[] = [];
  buildLayout(root, 0, 0, layouts);
  return layouts;
}

function layoutMap(layouts: Layout[]) {
  const byId = new Map<string, Layout>();
  layouts.forEach(l => byId.set(l.id, l));
  return byId;
}

// ─── Edge path ────────────────────────────────────────────────────────────────

function edgePath(parent: Layout, child: Layout): string {
  const x1 = parent.x + parent.width;
  const y1 = parent.y + parent.height / 2;
  const x2 = child.x;
  const y2 = child.y + child.height / 2;
  const mx = (x1 + x2) / 2;
  return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
}

// ─── Node color by depth ─────────────────────────────────────────────────────

function nodeColor(root: MindNode, id: string): string {
  const d = depthOf(root, id);
  if (d <= 0) return "#1e1b4b"; // root: deep indigo
  return PALETTE[(d - 1) % PALETTE.length];
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function MindmapClient() {
  const [root, setRoot] = useState<MindNode>(() => cloneTree(DEFAULT_MAP));

  // Load from localStorage after mount to avoid SSR/client hydration mismatch
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setRoot(JSON.parse(saved));
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selected, setSelected] = useState<string | null>("root");
  const [editing, setEditing] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [camera, setCamera] = useState<Camera>({ x: 120, y: 300, zoom: 1 });

  const svgRef = useRef<SVGSVGElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0, cx: 0, cy: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Autosave
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(root)); } catch { /* storage full */ }
  }, [root]);

  // Focus input when editing starts
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const layouts = computeLayouts(root);
  const byId = layoutMap(layouts);

  // ─── CRUD ───────────────────────────────────────────────────────────────────

  const mutate = useCallback((fn: (r: MindNode) => void) => {
    setRoot(prev => {
      const next = cloneTree(prev);
      fn(next);
      return next;
    });
  }, []);

  const addChild = useCallback(() => {
    if (!selected) return;
    const id = newId();
    mutate(r => {
      const parent = findNode(r, selected);
      if (parent) parent.children.push({ id, text: "New node", children: [] });
    });
    setSelected(id);
    setEditing(id);
    setEditText("New node");
  }, [selected, mutate]);

  const addSibling = useCallback(() => {
    if (!selected || selected === "root") return;
    const id = newId();
    mutate(r => {
      const parent = findParent(r, selected);
      if (!parent) return;
      const idx = parent.children.findIndex(c => c.id === selected);
      parent.children.splice(idx + 1, 0, { id, text: "New node", children: [] });
    });
    setSelected(id);
    setEditing(id);
    setEditText("New node");
  }, [selected, mutate]);

  const deleteNode = useCallback(() => {
    if (!selected || selected === "root") return;
    const parent = findParent(root, selected);
    mutate(r => {
      const p = findNode(r, parent!.id);
      if (p) p.children = p.children.filter(c => c.id !== selected);
    });
    setSelected(parent?.id ?? "root");
    setEditing(null);
  }, [selected, root, mutate]);

  const startEdit = useCallback((id: string) => {
    const node = findNode(root, id);
    if (!node) return;
    setEditing(id);
    setEditText(node.text);
  }, [root]);

  const commitEdit = useCallback(() => {
    if (!editing) return;
    const text = editText.trim() || "Node";
    mutate(r => {
      const node = findNode(r, editing);
      if (node) node.text = text;
    });
    setEditing(null);
  }, [editing, editText, mutate]);

  // ─── Pan & Zoom ─────────────────────────────────────────────────────────────

  const onMouseDownSvg = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if ((e.target as Element).closest("[data-node]")) return;
    isPanning.current = true;
    panStart.current = { x: e.clientX, y: e.clientY, cx: camera.x, cy: camera.y };
  }, [camera]);

  const onMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!isPanning.current) return;
    setCamera(c => ({
      ...c,
      x: panStart.current.cx + e.clientX - panStart.current.x,
      y: panStart.current.cy + e.clientY - panStart.current.y,
    }));
  }, []);

  const onMouseUp = useCallback(() => { isPanning.current = false; }, []);

  const onWheel = useCallback((e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    setCamera(c => ({ ...c, zoom: Math.min(3, Math.max(0.2, c.zoom * factor)) }));
  }, []);

  const resetView = useCallback(() => setCamera({ x: 120, y: 300, zoom: 1 }), []);

  // ─── Import / Export ────────────────────────────────────────────────────────

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(root, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "mindmap.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }, [root]);

  const importJson = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target?.result as string) as MindNode;
        if (!data.id || !data.text || !Array.isArray(data.children)) throw new Error("Invalid format");
        setRoot(data);
        setSelected(data.id);
        setEditing(null);
      } catch {
        alert("Invalid mindmap JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  const newMap = useCallback(() => {
    if (!confirm("Start a new mindmap? Unsaved changes will be lost.")) return;
    const fresh = cloneTree(DEFAULT_MAP);
    setRoot(fresh);
    setSelected("root");
    setEditing(null);
  }, []);

  // ─── Keyboard shortcuts ─────────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (editing) {
        if (e.key === "Enter") { e.preventDefault(); commitEdit(); }
        if (e.key === "Escape") { setEditing(null); }
        return;
      }
      if (!selected) return;
      if (e.key === "Tab") { e.preventDefault(); addChild(); }
      if (e.key === "Enter") { e.preventDefault(); addSibling(); }
      if ((e.key === "Delete" || e.key === "Backspace") && selected !== "root") { e.preventDefault(); deleteNode(); }
      if (e.key === "F2") { e.preventDefault(); startEdit(selected); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [editing, selected, addChild, addSibling, deleteNode, commitEdit, startEdit]);

  // ─── Render edges ────────────────────────────────────────────────────────────

  const renderEdges = useCallback((node: MindNode): React.ReactNode[] => {
    const edges: React.ReactNode[] = [];
    const pl = byId.get(node.id);
    if (!pl) return edges;
    for (const child of node.children) {
      const cl = byId.get(child.id);
      if (cl) {
        edges.push(
          <path
            key={`edge-${node.id}-${child.id}`}
            d={edgePath(pl, cl)}
            fill="none"
            stroke="#c7d2fe"
            strokeWidth={1.5}
          />
        );
      }
      edges.push(...renderEdges(child));
    }
    return edges;
  }, [byId]);

  // ─── Render nodes ────────────────────────────────────────────────────────────

  const renderNodes = useCallback((node: MindNode): React.ReactNode[] => {
    const nodes: React.ReactNode[] = [];
    const l = byId.get(node.id);
    if (!l) return nodes;

    const isSelected = selected === node.id;
    const isEditing = editing === node.id;
    const color = nodeColor(root, node.id);
    const depth = depthOf(root, node.id);
    const isRoot = depth === 0;

    nodes.push(
      <g
        key={node.id}
        data-node={node.id}
        onClick={(e) => { e.stopPropagation(); setSelected(node.id); }}
        onDoubleClick={(e) => { e.stopPropagation(); startEdit(node.id); }}
        style={{ cursor: "pointer" }}
      >
        <rect
          x={l.x}
          y={l.y}
          width={l.width}
          height={l.height}
          rx={isRoot ? 10 : 8}
          fill={color}
          opacity={isEditing ? 0.85 : 1}
          stroke={isSelected ? "#ffffff" : "transparent"}
          strokeWidth={isSelected ? 2.5 : 0}
          filter={isSelected ? "drop-shadow(0 0 6px rgba(99,102,241,0.7))" : undefined}
        />
        {!isEditing && (
          <text
            x={l.x + l.width / 2}
            y={l.y + l.height / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fill="white"
            fontSize={isRoot ? 13 : 12}
            fontWeight={isRoot ? 700 : 500}
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            pointerEvents="none"
            style={{ userSelect: "none" }}
          >
            {node.text.length > 22 ? node.text.slice(0, 21) + "…" : node.text}
          </text>
        )}
        {isEditing && (
          <foreignObject x={l.x + 4} y={l.y + 4} width={l.width - 8} height={l.height - 8}>
            <input
              ref={inputRef}
              value={editText}
              onChange={e => setEditText(e.target.value)}
              onBlur={commitEdit}
              style={{
                width: "100%", height: "100%", background: "transparent",
                border: "none", outline: "none", color: "white",
                fontSize: 12, fontFamily: "inherit", textAlign: "center",
                padding: 0,
              }}
            />
          </foreignObject>
        )}
      </g>
    );

    for (const child of node.children) nodes.push(...renderNodes(child));
    return nodes;
  }, [byId, selected, editing, editText, root, startEdit, commitEdit]);

  const selectedNode = selected ? findNode(root, selected) : null;
  const canDelete = selected !== null && selected !== "root";

  // ─── Bounding box for fit-to-screen ─────────────────────────────────────────
  const allX = layouts.map(l => l.x);
  const allY = layouts.map(l => l.y);
  const allX2 = layouts.map(l => l.x + l.width);
  const allY2 = layouts.map(l => l.y + l.height);
  const minX = Math.min(...allX);
  const minY = Math.min(...allY);
  const maxX = Math.max(...allX2);
  const maxY = Math.max(...allY2);

  const fitToScreen = useCallback(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const { width, height } = svgEl.getBoundingClientRect();
    const mapW = maxX - minX + 80;
    const mapH = maxY - minY + 80;
    const zoom = Math.min(2, Math.max(0.2, Math.min(width / mapW, height / mapH) * 0.9));
    setCamera({
      x: (width - mapW * zoom) / 2 - minX * zoom + 40 * zoom,
      y: (height - mapH * zoom) / 2 - minY * zoom + 40 * zoom,
      zoom,
    });
  }, [maxX, maxY, minX, minY]);

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 56px)" }}>
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-gray-200 flex-wrap">
        {/* Map actions */}
        <button onClick={newMap} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          New
        </button>
        <button onClick={exportJson} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export JSON
        </button>
        <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          Import JSON
          <input ref={fileInputRef} type="file" accept=".json,application/json" className="hidden" onChange={importJson} />
        </label>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Node actions */}
        <button onClick={addChild} disabled={!selected} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add Child
          <span className="opacity-60 text-xs hidden sm:inline">Tab</span>
        </button>
        <button onClick={addSibling} disabled={!selected || selected === "root"} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-indigo-300 text-indigo-700 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add Sibling
          <span className="opacity-60 text-xs hidden sm:inline">Enter</span>
        </button>
        <button onClick={() => selected && startEdit(selected)} disabled={!selected} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          Rename
          <span className="opacity-60 text-xs hidden sm:inline">F2</span>
        </button>
        <button onClick={deleteNode} disabled={!canDelete} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          Delete
          <span className="opacity-60 text-xs hidden sm:inline">Del</span>
        </button>

        <div className="flex-1" />

        {/* View controls */}
        <button onClick={fitToScreen} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
          Fit
        </button>
        <button onClick={resetView} className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">Reset view</button>
        <span className="text-xs text-gray-400 tabular-nums hidden sm:inline">{Math.round(camera.zoom * 100)}%</span>
      </div>

      {/* ── Canvas ── */}
      <div className="flex-1 relative overflow-hidden bg-gray-50" style={{ backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)", backgroundSize: `${20 * camera.zoom}px ${20 * camera.zoom}px`, backgroundPosition: `${camera.x}px ${camera.y}px` }}>
        <svg
          ref={svgRef}
          className="w-full h-full"
          style={{ cursor: isPanning.current ? "grabbing" : "grab" }}
          onMouseDown={onMouseDownSvg}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onWheel={onWheel}
          onClick={() => { if (editing) commitEdit(); }}
        >
          <g transform={`translate(${camera.x}, ${camera.y}) scale(${camera.zoom})`}>
            {/* Edges first, then nodes on top */}
            {renderEdges(root)}
            {renderNodes(root)}
          </g>
        </svg>

        {/* Status bar overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 pointer-events-none">
          {selectedNode && (
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 shadow-sm">
              Selected: <span className="font-semibold text-gray-900">{selectedNode.text}</span>
              {selectedNode.children.length > 0 && <span className="text-gray-400 ml-1.5">· {selectedNode.children.length} children</span>}
            </div>
          )}
        </div>

        {/* Keyboard hint */}
        <div className="absolute bottom-3 right-3 pointer-events-none hidden md:flex items-center gap-3 text-xs text-gray-400 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
          <span><kbd className="font-mono bg-gray-100 px-1 rounded">Tab</kbd> child</span>
          <span><kbd className="font-mono bg-gray-100 px-1 rounded">Enter</kbd> sibling</span>
          <span><kbd className="font-mono bg-gray-100 px-1 rounded">F2</kbd> rename</span>
          <span><kbd className="font-mono bg-gray-100 px-1 rounded">Del</kbd> delete</span>
          <span><kbd className="font-mono bg-gray-100 px-1 rounded">scroll</kbd> zoom</span>
        </div>
      </div>
    </div>
  );
}
