type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type ApiResponse = any | null;

async function genericAPI(
    url: string,
    path: string,
    method: ApiMethod = 'GET',
    headers: HeadersInit,
    body: object | null = null): Promise<ApiResponse> {
    const canonicalPath = path.replace(/^\//, '');
    const uri = `${url}/${canonicalPath}`;
    async function apiReturn(result: Response) {
        if (result.status == 204) {
            return null;
        } else if (result.status == 404 && (method == 'DELETE' || method == 'GET')) {
            return null;
        } else if (!result.ok) {
            throw new Error(`${method} ${uri} failed with status ${result.status}`);
        } else {
            const response = await result.json();
            return response;
        }
    }
    if (body != null) {
        const result = await fetch(uri, { method, headers, body: JSON.stringify(body) });
        return apiReturn(result);
    } else {
        const result = await fetch(uri, { method, headers });
        return apiReturn(result);
    }
}

const githubAPI = (
    githubToken: string,
    path: string,
    method: ApiMethod = 'GET',
    body: object | null = null
): Promise<ApiResponse> => {
    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${githubToken}`
    };
    return genericAPI('https://api.github.com', path, method, headers, body);
};

async function listRepos(githubToken: string, organization: string): Promise<any> {
    const repos = await githubAPI(githubToken, `${organization}/repos`);
    return repos;
}

async function enableRepoActions(githubToken: string, repo: string): Promise<any[]> {
    const { workflows } = await githubAPI(githubToken, `repos/${repo}/actions/workflows`, 'GET');
    const updates = workflows.
        filter(
            (workflow: any) => workflow.state != "active"
        ).
        flatMap(
            async (workflow: any) => {
                await githubAPI(githubToken, `repos/${repo}/actions/workflows/${workflow.id}/enable`, 'PUT');
                const { workflows } = await githubAPI(githubToken, `repos/${repo}/actions/workflows/${workflow.id}`, 'GET');
                return workflows;
            }
    );
    return updates;
}

async function enableOrganizationActions(githubToken: string, organizations: string[]): Promise<any[]> {
    const repos = await organizations.flatMap(async (organization) => {
        const ghOrg = await githubAPI(githubToken, `orgs/${organization}`);
        if (ghOrg.ok) {
            const repos = await listRepos(githubToken, organization);
            const workflows = await repos.map(async (repo: any) => await enableRepoActions(githubToken, repo.full_name));
            return workflows;
        } else {
            return [];
        }
    });
    return repos;
}

export { githubAPI, listRepos, enableRepoActions, enableOrganizationActions };
