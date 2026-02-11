import assert from "node:assert/strict";
import test from "node:test";
import { applyArtifactDecision, updateTaskStatus } from "../../src/app/admin/_lib/artifacts";

type Artifact = { id: string; status: string };
type Decision = { artifactId: string; decision: string; decidedBy: string; notes: string };
type Task = { id: string; status: string };

function makeDbFixture() {
  const artifacts = new Map<string, Artifact>([["a1", { id: "a1", status: "PENDING" }]]);
  const decisions: Decision[] = [];
  const tasks = new Map<string, Task>([["t1", { id: "t1", status: "PENDING" }]]);

  const tx = {
    artifact: {
      update: async ({ where, data }: { where: { id: string }; data: { status: string } }) => {
        const current = artifacts.get(where.id);
        if (!current) throw new Error("artifact not found");
        current.status = data.status;
        return { ...current };
      },
    },
    decision: {
      create: async ({ data }: { data: { artifactId: string; decision: string; decidedBy: string; notes: string } }) => {
        decisions.push({ ...data });
        return data;
      },
    },
  };

  const db = {
    $transaction: async <T>(fn: (client: typeof tx) => Promise<T>) => fn(tx),
    handoffTask: {
      update: async ({ where, data }: { where: { id: string }; data: { status: string } }) => {
        const current = tasks.get(where.id);
        if (!current) throw new Error("task not found");
        current.status = data.status;
        return { ...current };
      },
    },
  };

  return { db, artifacts, decisions, tasks };
}

test("approve decision updates artifact status and logs decision", async () => {
  const fixture = makeDbFixture();

  await applyArtifactDecision(fixture.db as never, {
    artifactId: "a1",
    decision: "APPROVE",
    notes: "Looks good",
    decidedBy: "owner@example.com",
    role: "OWNER",
  });

  assert.equal(fixture.artifacts.get("a1")?.status, "APPROVED");
  assert.equal(fixture.decisions.length, 1);
  assert.equal(fixture.decisions[0]?.decision, "APPROVE");
});

test("viewer role cannot mutate artifact decisions", async () => {
  const fixture = makeDbFixture();

  await assert.rejects(
    () =>
      applyArtifactDecision(fixture.db as never, {
        artifactId: "a1",
        decision: "DENY",
        notes: "Not compliant",
        decidedBy: "viewer@example.com",
        role: "VIEWER",
      }),
    /not allowed/,
  );

  assert.equal(fixture.artifacts.get("a1")?.status, "PENDING");
  assert.equal(fixture.decisions.length, 0);
});

test("task status update marks task done for admin role", async () => {
  const fixture = makeDbFixture();

  await updateTaskStatus(fixture.db as never, {
    taskId: "t1",
    status: "DONE",
    role: "ADMIN",
  });

  assert.equal(fixture.tasks.get("t1")?.status, "DONE");
});
