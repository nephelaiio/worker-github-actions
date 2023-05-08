/* eslint-disable @typescript-eslint/no-unused-vars */

import { listRepos } from "./github";

export interface Env {
  GITHUB_TOKEN: string;
  GITHUB_APPLY: boolean;
}

export default {
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    console.log(
      `Hello world from ${env.GITHUB_APPLY ? "apply" : "check"} mode`
    );
  },

  async handleRequest(request: Request, env: Env): Promise<Response> {
    return new Response(
      `Hello world from ${env.GITHUB_APPLY ? "apply" : "check"} mode`
    );
  },
};
