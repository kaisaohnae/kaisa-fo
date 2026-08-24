'use client';

import {useMemo, useState, type DragEvent} from 'react';
import {Ex4FileIcon, Ex4FolderClosedIcon, Ex4FolderOpenIcon} from './example4-tree-icons';
import {
  canDrop,
  dropZone,
  findNode,
  isFolder,
  moveNode,
  type Ex4DropPos,
  type Ex4TreeMode,
  type Ex4TreeNode,
} from './tree-utils';

type DragPayload = {
  treeId: string;
  nodeId: string;
  label: string;
};

let activeDrag: DragPayload | null = null;

type Example4TreeBoardProps = {
  treeId: string;
  nodes: Ex4TreeNode[];
  onChange: (nodes: Ex4TreeNode[]) => void;
  mode: Ex4TreeMode;
  maxDepth?: number;
  allowExternal?: boolean;
  onExternalDrop?: (payload: {
    fromTreeId: string;
    sourceId: string;
    label: string;
    targetId: string | null;
    pos: Ex4DropPos;
  }) => boolean;
  emptyText?: string;
  initialCollapsed?: string[];
};

type FlatRow = {
  node: Ex4TreeNode;
  depth: number;
};

function flatten(nodes: Ex4TreeNode[], collapsed: Set<string>, depth = 0): FlatRow[] {
  const rows: FlatRow[] = [];
  for (const node of nodes) {
    rows.push({node, depth});
    if (isFolder(node) && node.children?.length && !collapsed.has(node.id)) {
      rows.push(...flatten(node.children, collapsed, depth + 1));
    }
  }
  return rows;
}

function canAcceptExternal(node: Ex4TreeNode | null, pos: Ex4DropPos, mode: Ex4TreeMode) {
  if (!node) return pos !== 'inside';
  if (pos === 'inside') return mode !== 'reorder' && isFolder(node) && !node.locked;
  return true;
}

export default function Example4TreeBoard({
  treeId,
  nodes,
  onChange,
  mode,
  maxDepth = 3,
  allowExternal = false,
  onExternalDrop,
  emptyText = 'Empty',
  initialCollapsed = [],
}: Example4TreeBoardProps) {
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set(initialCollapsed));
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [over, setOver] = useState<{id: string | 'root'; pos: Ex4DropPos} | null>(null);
  const [log, setLog] = useState('');

  const rows = useMemo(() => flatten(nodes, collapsed), [collapsed, nodes]);
  const allowInside = mode !== 'reorder';

  const toggle = (id: string) => {
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const finishDrop = (payload: DragPayload, targetId: string | null, pos: Ex4DropPos) => {
    if (payload.treeId !== treeId) {
      if (!allowExternal || !onExternalDrop) return;
      const target = targetId ? findNode(nodes, targetId) : null;
      if (!canAcceptExternal(target, targetId ? pos : 'after', mode)) return;
      const ok = onExternalDrop({
        fromTreeId: payload.treeId,
        sourceId: payload.nodeId,
        label: payload.label,
        targetId,
        pos: targetId ? pos : 'after',
      });
      if (ok) setLog(`${payload.label} → here`);
      return;
    }

    if (!targetId) return;
    const next = moveNode(nodes, payload.nodeId, targetId, pos, mode, maxDepth);
    if (!next) return;
    onChange(next);
    const target = findNode(nodes, targetId);
    setLog(`${payload.label} → ${target?.label ?? ''} (${pos})`);
  };

  const onDragStart = (event: DragEvent<HTMLDivElement>, node: Ex4TreeNode) => {
    if (node.locked) {
      event.preventDefault();
      return;
    }
    const payload: DragPayload = {treeId, nodeId: node.id, label: node.label};
    activeDrag = payload;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', node.id);
    setDraggingId(node.id);
  };

  const clearDrag = () => {
    setDraggingId(null);
    setOver(null);
    activeDrag = null;
  };

  const onDragOverRow = (event: DragEvent<HTMLDivElement>, node: Ex4TreeNode) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const pos = dropZone((event.clientY - rect.top) / rect.height, allowInside && isFolder(node) && !node.locked);
    const payload = activeDrag;
    if (!payload) {
      event.dataTransfer.dropEffect = 'move';
      setOver({id: node.id, pos});
      return;
    }

    const ok =
      payload.treeId === treeId
        ? canDrop({mode, nodes, sourceId: payload.nodeId, targetId: node.id, pos, maxDepth})
        : allowExternal && canAcceptExternal(node, pos, mode);

    event.dataTransfer.dropEffect = ok ? 'move' : 'none';
    setOver(ok ? {id: node.id, pos} : null);
  };

  const onDropRow = (event: DragEvent<HTMLDivElement>, node: Ex4TreeNode) => {
    event.preventDefault();
    const payload = activeDrag;
    const pos = over?.id === node.id ? over.pos : 'after';
    setOver(null);
    setDraggingId(null);
    if (!payload) return;
    finishDrop(payload, node.id, pos);
    activeDrag = null;
  };

  return (
    <div className="ex4-tree">
      <div
        className="ex4-tree__list"
        onDragOver={(event) => {
          if (rows.length || !allowExternal || !activeDrag || activeDrag.treeId === treeId) return;
          event.preventDefault();
          setOver({id: 'root', pos: 'after'});
        }}
        onDrop={(event) => {
          if (rows.length || !activeDrag) return;
          event.preventDefault();
          finishDrop(activeDrag, null, 'after');
          clearDrag();
        }}
      >
        {rows.length ? (
          rows.map(({node, depth}) => {
            const folder = isFolder(node);
            const open = folder && !collapsed.has(node.id);
            const dropPos = over?.id === node.id ? over.pos : null;
            return (
              <div
                key={node.id}
                className={[
                  'ex4-tree__row',
                  node.locked && 'ex4-tree__row--locked',
                  draggingId === node.id && 'ex4-tree__row--dragging',
                  dropPos && `ex4-tree__row--${dropPos}`,
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{paddingLeft: 8 + depth * 18}}
                draggable={!node.locked}
                onDragStart={(event) => onDragStart(event, node)}
                onDragEnd={clearDrag}
                onDragOver={(event) => onDragOverRow(event, node)}
                onDragLeave={() => setOver((current) => (current?.id === node.id ? null : current))}
                onDrop={(event) => onDropRow(event, node)}
              >
                {folder ? (
                  <button
                    type="button"
                    className="ex4-tree__folder"
                    aria-expanded={open}
                    aria-label={open ? 'Collapse folder' : 'Expand folder'}
                    onMouseDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggle(node.id);
                    }}
                  >
                    {open ? <Ex4FolderOpenIcon /> : <Ex4FolderClosedIcon />}
                  </button>
                ) : (
                  <span className="ex4-tree__file">
                    <Ex4FileIcon />
                  </span>
                )}
                <span className="ex4-tree__label">{node.label}</span>
                {node.locked ? <span className="ex4-tree__lock">lock</span> : <span className="ex4-tree__grip" aria-hidden="true" />}
              </div>
            );
          })
        ) : (
          <p className="ex4-tree__empty">{emptyText}</p>
        )}
      </div>
      <p className="ex4-tree__log">{log || ' '}</p>
    </div>
  );
}
