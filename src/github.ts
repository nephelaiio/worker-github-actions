/* eslint-disable @typescript-eslint/no-explicit-any */
import { Octokit } from 'octokit';

async function listRepos(
    githubToken: string,
    organization: string
): Promise<any> {
    const octokit = new Octokit({ auth: githubToken });
    const repos = await octokit.request(`GET /${organization}/repos`);
    return repos.data;
}

async function enableRepoActions(
    githubToken: string,
    repo: string
): Promise<any[]> {
    const octokit = new Octokit({ auth: githubToken });
    const workflows = await octokit.request(
        `GET /repos/${repo}/actions/workflows`
    );
    const updates = workflows.data.workflows
        .filter((workflow: any) => workflow.state != 'active')
        .flatMap(async (workflow: any) => {
            await octokit.request(
                `PUT /repos/${repo}/actions/workflows/${workflow.id}/enable`
            );
            const { data } = await octokit.request(
                `GET /repos/${repo}/actions/workflows/${workflow.id}`
            );
            return data;
        });
    return updates;
}

async function enableOrganizationActions(
    githubToken: string,
    organizations: string[]
): Promise<any[]> {
    const octokit = new Octokit({ auth: githubToken });
    const repos = organizations.flatMap(async (organization) => {
        const response = octokit.request(`GET /orgs/${organization}`);
        return response.then(async ({ data }) => {
            const repos = await listRepos(githubToken, data.organization);
            const workflows = await repos.map(
                async (repo: any) =>
                    await enableRepoActions(githubToken, repo.full_name)
            );
            return workflows;
        });
    });
    return repos;
}

export { listRepos, enableRepoActions, enableOrganizationActions };
