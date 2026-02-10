/**
 * API key auth for agent routes. Roles are derived from key match only.
 * - OWNER_AGENT_API_KEY => owner role
 * - AGENT_API_KEY => delegated agent role
 */

export type AgentRole = "owner" | "agent";

export type AgentActor = {
  actorRole: AgentRole;
  actorId: string;
  credential: "owner_api_key" | "agent_api_key" | "unconfigured";
};

type Unauthorized = {
  ok: false;
  status: number;
  body: { ok: false; error: string };
};

type Authorized = {
  ok: true;
  actor: AgentActor;
};

function getProvidedApiKey(request: Request): string {
  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  const xApiKey = request.headers.get("x-api-key")?.trim() ?? "";
  return bearer || xApiKey;
}

function unauthorized(): Unauthorized {
  return {
    ok: false,
    status: 401,
    body: { ok: false, error: "Unauthorized." },
  };
}

export function resolveAgentActor(request: Request): Authorized | Unauthorized {
  const ownerKey = process.env.OWNER_AGENT_API_KEY?.trim();
  const ownerId = process.env.OWNER_AGENT_ID?.trim() || "patrick_mackin_iv";
  const agentKey = process.env.AGENT_API_KEY?.trim();
  const provided = getProvidedApiKey(request);

  const hasConfiguredKeys = Boolean(ownerKey || agentKey);
  if (!hasConfiguredKeys) {
    return {
      ok: true,
      actor: {
        actorRole: "owner",
        actorId: ownerId,
        credential: "unconfigured",
      },
    };
  }

  if (!provided) {
    return unauthorized();
  }

  if (ownerKey && provided === ownerKey) {
    return {
      ok: true,
      actor: {
        actorRole: "owner",
        actorId: ownerId,
        credential: "owner_api_key",
      },
    };
  }

  if (agentKey && provided === agentKey) {
    return {
      ok: true,
      actor: {
        actorRole: "agent",
        actorId: "delegated_agent",
        credential: "agent_api_key",
      },
    };
  }

  return unauthorized();
}

export function requireAgentApiKey(request: Request): { ok: true } | Unauthorized {
  const actor = resolveAgentActor(request);
  if (!actor.ok) return actor;
  return { ok: true };
}
