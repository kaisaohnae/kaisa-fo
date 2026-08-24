export type Ex4TreeKind = 'folder' | 'leaf';

export type Ex4TreeNode = {
  id: string;
  label: string;
  kind?: Ex4TreeKind;
  locked?: boolean;
  children?: Ex4TreeNode[];
};

export type Ex4DropPos = 'before' | 'after' | 'inside';
export type Ex4TreeMode = 'reorder' | 'reparent' | 'constrained';

export function cloneTree(nodes: Ex4TreeNode[]): Ex4TreeNode[] {
  return nodes.map((node) => ({
    ...node,
    children: node.children ? cloneTree(node.children) : undefined,
  }));
}

export function isFolder(node: Ex4TreeNode) {
  return node.kind !== 'leaf';
}

export function findNode(nodes: Ex4TreeNode[], id: string): Ex4TreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function findContext(nodes: Ex4TreeNode[], id: string, parent: Ex4TreeNode | null = null) {
  const index = nodes.findIndex((node) => node.id === id);
  if (index >= 0) {
    return {parent, index, siblings: nodes, node: nodes[index]};
  }
  for (const node of nodes) {
    if (!node.children) continue;
    const found = findContext(node.children, id, node);
    if (found) return found;
  }
  return null;
}

export function isDescendant(nodes: Ex4TreeNode[], ancestorId: string, maybeChildId: string) {
  const ancestor = findNode(nodes, ancestorId);
  if (!ancestor?.children) return false;
  if (findNode(ancestor.children, maybeChildId)) return true;
  return false;
}

export function nodeDepth(nodes: Ex4TreeNode[], id: string, depth = 0): number {
  for (const node of nodes) {
    if (node.id === id) return depth;
    if (node.children) {
      const found = nodeDepth(node.children, id, depth + 1);
      if (found >= 0) return found;
    }
  }
  return -1;
}

export function subtreeHeight(node: Ex4TreeNode): number {
  if (!node.children?.length) return 0;
  return 1 + Math.max(...node.children.map(subtreeHeight));
}

export function removeNode(nodes: Ex4TreeNode[], id: string): {tree: Ex4TreeNode[]; removed: Ex4TreeNode | null} {
  const next: Ex4TreeNode[] = [];
  let removed: Ex4TreeNode | null = null;

  for (const node of nodes) {
    if (node.id === id) {
      removed = cloneTree([node])[0];
      continue;
    }
    if (node.children) {
      const result = removeNode(node.children, id);
      if (result.removed) removed = result.removed;
      next.push({...node, children: result.tree});
    } else {
      next.push(node);
    }
  }

  return {tree: next, removed};
}

export function insertNode(
  nodes: Ex4TreeNode[],
  targetId: string,
  pos: Ex4DropPos,
  incoming: Ex4TreeNode,
): Ex4TreeNode[] | null {
  const next = cloneTree(nodes);

  if (pos === 'inside') {
    const target = findNode(next, targetId);
    if (!target || !isFolder(target)) return null;
    target.children = [...(target.children ?? []), incoming];
    return next;
  }

  const ctx = findContext(next, targetId);
  if (!ctx) return null;
  const index = pos === 'before' ? ctx.index : ctx.index + 1;
  ctx.siblings.splice(index, 0, incoming);
  return next;
}

export function canDrop(options: {
  mode: Ex4TreeMode;
  nodes: Ex4TreeNode[];
  sourceId: string;
  targetId: string;
  pos: Ex4DropPos;
  maxDepth?: number;
}) {
  const {mode, nodes, sourceId, targetId, pos, maxDepth = 4} = options;
  if (sourceId === targetId) return false;

  const source = findNode(nodes, sourceId);
  const target = findNode(nodes, targetId);
  if (!source || !target) return false;
  if (source.locked) return false;
  if (isDescendant(nodes, sourceId, targetId)) return false;

  if (pos === 'inside') {
    if (mode === 'reorder') return false;
    if (!isFolder(target) || target.locked) return false;
    if (mode === 'constrained') {
      const depth = nodeDepth(nodes, targetId) + 1 + subtreeHeight(source);
      if (depth > maxDepth) return false;
    }
    return true;
  }

  const sourceCtx = findContext(nodes, sourceId);
  const targetCtx = findContext(nodes, targetId);
  if (!sourceCtx || !targetCtx) return false;

  if (mode === 'reorder') {
    return sourceCtx.parent?.id === targetCtx.parent?.id;
  }

  if (target.locked) {
    return !targetCtx.parent?.locked;
  }

  if (mode === 'constrained') {
    const parent = targetCtx.parent;
    const nextDepth = (parent ? nodeDepth(nodes, parent.id) + 1 : 0) + subtreeHeight(source);
    if (nextDepth > maxDepth) return false;
  }

  return true;
}

export function moveNode(
  nodes: Ex4TreeNode[],
  sourceId: string,
  targetId: string,
  pos: Ex4DropPos,
  mode: Ex4TreeMode,
  maxDepth?: number,
) {
  if (!canDrop({mode, nodes, sourceId, targetId, pos, maxDepth})) return null;
  const {tree, removed} = removeNode(nodes, sourceId);
  if (!removed) return null;
  return insertNode(tree, targetId, pos, removed);
}

export function dropZone(ratio: number, allowInside: boolean): Ex4DropPos {
  if (allowInside) {
    if (ratio < 0.28) return 'before';
    if (ratio > 0.72) return 'after';
    return 'inside';
  }
  return ratio < 0.5 ? 'before' : 'after';
}
