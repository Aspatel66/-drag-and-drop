import YAML from 'yaml';

interface AgentConfig {
  name: string;
  tools?: string[];
  allowedToUse?: string[];
  constraints?: string[];
  backoffStrategy?: string;
  memory?: string;
}

export function generateAgentYaml(agent: AgentConfig): string {
  const yamlConfig = {
    name: agent.name,
    tools: agent.tools || [],
    allowed_to_use: agent.allowedToUse || [],
    constraints: agent.constraints || [],
    config: {
      backoff_strategy: agent.backoffStrategy || 'exponential',
      memory: agent.memory || 'none',
    },
  };

  return YAML.stringify(yamlConfig);
}

export function generateTaskYaml(agents: AgentConfig[]): string {
  const yamlConfig = {
    description: 'Task workflow configuration',
    agents: agents.map(agent => ({
      name: agent.name,
    })),
    workflow: agents.map((agent, index) => ({
      step: index + 1,
      agent: agent.name,
      depends_on: index > 0 ? [agents[index - 1].name] : [],
    })),
  };

  return YAML.stringify(yamlConfig);
}