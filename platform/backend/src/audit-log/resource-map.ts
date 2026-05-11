type ResourceInfo = {
  resourceType: string;
  // The request.params key that holds the resource's ID, or null for collection endpoints
  idParam: string | null;
};

export const AUDIT_RESOURCE_MAP: Record<string, ResourceInfo> = {
  // Agents
  "POST /api/agents": { resourceType: "agent", idParam: null },
  "PUT /api/agents/:agentId": { resourceType: "agent", idParam: "agentId" },
  "PATCH /api/agents/:agentId": { resourceType: "agent", idParam: "agentId" },
  "DELETE /api/agents/:agentId": { resourceType: "agent", idParam: "agentId" },

  // Agent tools
  "POST /api/agents/:agentId/tools": {
    resourceType: "agent_tool",
    idParam: "agentId",
  },
  "DELETE /api/agents/:agentId/tools/:toolId": {
    resourceType: "agent_tool",
    idParam: "agentId",
  },

  // API keys
  "POST /api/api-keys": { resourceType: "api_key", idParam: null },
  "DELETE /api/api-keys/:keyId": { resourceType: "api_key", idParam: "keyId" },

  // Virtual API keys
  "POST /api/virtual-api-keys": { resourceType: "virtual_api_key", idParam: null },
  "PUT /api/virtual-api-keys/:keyId": {
    resourceType: "virtual_api_key",
    idParam: "keyId",
  },
  "DELETE /api/virtual-api-keys/:keyId": {
    resourceType: "virtual_api_key",
    idParam: "keyId",
  },

  // LLM provider API keys
  "POST /api/llm-provider-api-keys": {
    resourceType: "llm_provider_api_key",
    idParam: null,
  },
  "PUT /api/llm-provider-api-keys/:keyId": {
    resourceType: "llm_provider_api_key",
    idParam: "keyId",
  },
  "DELETE /api/llm-provider-api-keys/:keyId": {
    resourceType: "llm_provider_api_key",
    idParam: "keyId",
  },

  // Members / invitations
  "DELETE /api/members/:memberId": {
    resourceType: "member",
    idParam: "memberId",
  },
  "PUT /api/members/:memberId": {
    resourceType: "member",
    idParam: "memberId",
  },
  "POST /api/invitations": { resourceType: "invitation", idParam: null },

  // Teams
  "POST /api/teams": { resourceType: "team", idParam: null },
  "PUT /api/teams/:teamId": { resourceType: "team", idParam: "teamId" },
  "DELETE /api/teams/:teamId": { resourceType: "team", idParam: "teamId" },
  "POST /api/teams/:teamId/members": {
    resourceType: "team_member",
    idParam: "teamId",
  },
  "DELETE /api/teams/:teamId/members/:memberId": {
    resourceType: "team_member",
    idParam: "teamId",
  },

  // Roles
  "POST /api/roles": { resourceType: "role", idParam: null },
  "PUT /api/roles/:roleId": { resourceType: "role", idParam: "roleId" },
  "DELETE /api/roles/:roleId": { resourceType: "role", idParam: "roleId" },

  // Tool invocation policies
  "POST /api/tool-invocation-policies": {
    resourceType: "tool_invocation_policy",
    idParam: null,
  },
  "PUT /api/tool-invocation-policies/:policyId": {
    resourceType: "tool_invocation_policy",
    idParam: "policyId",
  },
  "DELETE /api/tool-invocation-policies/:policyId": {
    resourceType: "tool_invocation_policy",
    idParam: "policyId",
  },

  // Trusted data policies
  "POST /api/trusted-data-policies": {
    resourceType: "trusted_data_policy",
    idParam: null,
  },
  "PUT /api/trusted-data-policies/:policyId": {
    resourceType: "trusted_data_policy",
    idParam: "policyId",
  },
  "DELETE /api/trusted-data-policies/:policyId": {
    resourceType: "trusted_data_policy",
    idParam: "policyId",
  },

  // MCP servers
  "POST /api/mcp-servers": { resourceType: "mcp_server", idParam: null },
  "DELETE /api/mcp-servers/:serverId": {
    resourceType: "mcp_server",
    idParam: "serverId",
  },

  // MCP catalog
  "POST /api/mcp-catalog": { resourceType: "mcp_catalog", idParam: null },
  "PUT /api/mcp-catalog/:catalogId": {
    resourceType: "mcp_catalog",
    idParam: "catalogId",
  },
  "DELETE /api/mcp-catalog/:catalogId": {
    resourceType: "mcp_catalog",
    idParam: "catalogId",
  },

  // MCP installation requests
  "POST /api/mcp-server-installation-requests": {
    resourceType: "mcp_installation_request",
    idParam: null,
  },
  "POST /api/mcp-server-installation-requests/:requestId/approve": {
    resourceType: "mcp_installation_request",
    idParam: "requestId",
  },
  "POST /api/mcp-server-installation-requests/:requestId/decline": {
    resourceType: "mcp_installation_request",
    idParam: "requestId",
  },
  "DELETE /api/mcp-server-installation-requests/:requestId": {
    resourceType: "mcp_installation_request",
    idParam: "requestId",
  },

  // Optimization rules
  "POST /api/optimization-rules": {
    resourceType: "optimization_rule",
    idParam: null,
  },
  "PUT /api/optimization-rules/:ruleId": {
    resourceType: "optimization_rule",
    idParam: "ruleId",
  },
  "DELETE /api/optimization-rules/:ruleId": {
    resourceType: "optimization_rule",
    idParam: "ruleId",
  },

  // Limits
  "POST /api/limits": { resourceType: "limit", idParam: null },
  "PUT /api/limits/:limitId": { resourceType: "limit", idParam: "limitId" },
  "DELETE /api/limits/:limitId": {
    resourceType: "limit",
    idParam: "limitId",
  },

  // Identity providers
  "POST /api/identity-providers": {
    resourceType: "identity_provider",
    idParam: null,
  },
  "PUT /api/identity-providers/:providerId": {
    resourceType: "identity_provider",
    idParam: "providerId",
  },
  "DELETE /api/identity-providers/:providerId": {
    resourceType: "identity_provider",
    idParam: "providerId",
  },

  // LLM models
  "PUT /api/models/:modelId": { resourceType: "llm_model", idParam: "modelId" },

  // LLM settings
  "PUT /api/settings/llm": { resourceType: "llm_settings", idParam: null },
  "PUT /api/settings/agents": {
    resourceType: "agent_settings",
    idParam: null,
  },
  "PUT /api/settings/auth": { resourceType: "auth_settings", idParam: null },
  "PUT /api/settings/connection": {
    resourceType: "connection_settings",
    idParam: null,
  },
  "PUT /api/settings/knowledge": {
    resourceType: "knowledge_settings",
    idParam: null,
  },
  "PUT /api/settings/appearance": {
    resourceType: "appearance_settings",
    idParam: null,
  },
  "PUT /api/settings/security": {
    resourceType: "security_settings",
    idParam: null,
  },
};

const SENSITIVE_BODY_KEYS = new Set([
  "password",
  "token",
  "secret",
  "apiKey",
  "api_key",
  "key",
  "credential",
  "credentials",
  "accessToken",
  "access_token",
  "refreshToken",
  "refresh_token",
  "privateKey",
  "private_key",
]);

export function sanitizeBody(
  body: unknown,
  depth = 0,
): Record<string, unknown> {
  if (depth > 2 || !body || typeof body !== "object" || Array.isArray(body)) {
    return {};
  }
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body as Record<string, unknown>)) {
    if (SENSITIVE_BODY_KEYS.has(k)) {
      result[k] = "[redacted]";
    } else if (typeof v === "object" && v !== null && !Array.isArray(v)) {
      result[k] = sanitizeBody(v, depth + 1);
    } else {
      result[k] = v;
    }
  }
  return result;
}

export function lookupResource(
  method: string,
  routeUrl: string,
): ResourceInfo | null {
  const key = `${method} ${routeUrl}`;
  return AUDIT_RESOURCE_MAP[key] ?? null;
}
