'use client';

import {useState} from 'react';
import Example4PageHeader from './example4-page-header';
import Example4PercentMeters from './example4-percent';
import Example4TreeBoard from './example4-tree';
import {
  ASSIGNED_TREE,
  DOCK_TREE,
  STAGING_TREE,
  STRICT_TREE,
  TREE_COPY,
  ZONE_TREE,
} from './tree-data';
import {cloneTree, insertNode, removeNode, type Ex4TreeNode} from './tree-utils';

function resetButton(onClick: () => void, label: string) {
  return (
    <button type="button" className="ex4-tree-reset" onClick={onClick}>
      {label}
    </button>
  );
}

export default function Example4TreePage() {
  const [docks, setDocks] = useState(() => cloneTree(DOCK_TREE));
  const [zones, setZones] = useState(() => cloneTree(ZONE_TREE));
  const [staging, setStaging] = useState(() => cloneTree(STAGING_TREE));
  const [assigned, setAssigned] = useState(() => cloneTree(ASSIGNED_TREE));
  const [strict, setStrict] = useState(() => cloneTree(STRICT_TREE));

  const transfer = (
    sourceId: string,
    targetTree: Ex4TreeNode[],
    setTarget: (nodes: Ex4TreeNode[]) => void,
    setSource: (nodes: Ex4TreeNode[]) => void,
    sourceTree: Ex4TreeNode[],
    targetId: string | null,
    pos: 'before' | 'after' | 'inside',
  ) => {
    const {tree: nextSource, removed} = removeNode(sourceTree, sourceId);
    if (!removed) return false;
    if (!targetId) {
      setSource(nextSource);
      setTarget([...targetTree, removed]);
      return true;
    }
    const nextTarget = insertNode(targetTree, targetId, pos, removed);
    if (!nextTarget) return false;
    setSource(nextSource);
    setTarget(nextTarget);
    return true;
  };

  return (
    <>
      <Example4PageHeader
        title={TREE_COPY.pageTitle}
        description={TREE_COPY.pageDesc}
        library="Tree DnD"
        asideLabel={TREE_COPY.asideLabel}
        period={TREE_COPY.kicker}
      />

      <Example4PercentMeters />

      <div className="ex4-tree-grid">
        <section className="ex4-panel">
          <div className="ex4-panel__head">
            <div>
              <h2>{TREE_COPY.reorder.title}</h2>
              <p>{TREE_COPY.reorder.hint}</p>
            </div>
            {resetButton(() => setDocks(cloneTree(DOCK_TREE)), TREE_COPY.reset)}
          </div>
          <Example4TreeBoard treeId="docks" mode="reorder" nodes={docks} onChange={setDocks} />
        </section>

        <section className="ex4-panel">
          <div className="ex4-panel__head">
            <div>
              <h2>{TREE_COPY.reparent.title}</h2>
              <p>{TREE_COPY.reparent.hint}</p>
            </div>
            {resetButton(() => setZones(cloneTree(ZONE_TREE)), TREE_COPY.reset)}
          </div>
          <Example4TreeBoard
            treeId="zones"
            mode="reparent"
            nodes={zones}
            onChange={setZones}
            initialCollapsed={['a', 'b']}
          />
        </section>

        <section className="ex4-panel ex4-panel--span">
          <div className="ex4-panel__head">
            <div>
              <h2>{TREE_COPY.transfer.title}</h2>
              <p>{TREE_COPY.transfer.hint}</p>
            </div>
            {resetButton(() => {
              setStaging(cloneTree(STAGING_TREE));
              setAssigned(cloneTree(ASSIGNED_TREE));
            }, TREE_COPY.reset)}
          </div>
          <div className="ex4-tree-pair">
            <div>
              <p className="ex4-tree-pair__label">{TREE_COPY.transfer.left}</p>
              <Example4TreeBoard
                treeId="staging"
                mode="reparent"
                nodes={staging}
                onChange={setStaging}
                allowExternal
                emptyText={TREE_COPY.empty}
                onExternalDrop={({fromTreeId, sourceId, targetId, pos}) => {
                  if (fromTreeId !== 'assigned') return false;
                  return transfer(sourceId, staging, setStaging, setAssigned, assigned, targetId, pos);
                }}
              />
            </div>
            <div>
              <p className="ex4-tree-pair__label">{TREE_COPY.transfer.right}</p>
              <Example4TreeBoard
                treeId="assigned"
                mode="reparent"
                nodes={assigned}
                onChange={setAssigned}
                allowExternal
                initialCollapsed={['as-a']}
                emptyText={TREE_COPY.empty}
                onExternalDrop={({fromTreeId, sourceId, targetId, pos}) => {
                  if (fromTreeId !== 'staging') return false;
                  return transfer(sourceId, assigned, setAssigned, setStaging, staging, targetId, pos);
                }}
              />
            </div>
          </div>
        </section>

        <section className="ex4-panel">
          <div className="ex4-panel__head">
            <div>
              <h2>{TREE_COPY.strict.title}</h2>
              <p>{TREE_COPY.strict.hint}</p>
            </div>
            {resetButton(() => setStrict(cloneTree(STRICT_TREE)), TREE_COPY.reset)}
          </div>
          <Example4TreeBoard treeId="strict" mode="constrained" maxDepth={3} nodes={strict} onChange={setStrict} />
        </section>
      </div>
    </>
  );
}

