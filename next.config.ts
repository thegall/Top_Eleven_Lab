import type { NextConfig } from 'next';

/**
 * Export estático na Vercel, sem servidor (ADR 0001).
 *
 * `agentRules: false` — o projeto já tem o próprio AGENTS.md como
 * referência técnica (ver raiz do repo); sem isso, `next dev` regrava um
 * bloco nele a cada start.
 */
const nextConfig: NextConfig = {
  output: 'export',
  agentRules: false,
};

export default nextConfig;
