import { describe, expect, it } from 'vitest';
import { listRepos, enableRepoActions } from './github';

const token = process.env.GITHUB_TOKEN || 'any';

describe('listRepos', () => {
    it('should return a lst of repositories', async () => {
        const json = await listRepos(token, 'nephelaiio');
        expect(json).toHaveLength(30);
        expect(json[0]).toHaveProperty('name', 'ansible-playbooks');
        expect(json[json.length - 1]).toHaveProperty(
            'name',
            'ansible-role-metricbeat'
        );
    });
});

describe('enableRepo', () => {
    it('should enable a Repo', async () => {
        const workflows = await enableRepoActions(
            token,
            'nephelaiio/ansible-role-metricbeat'
        );
        workflows.forEach(async (workflow: any) => {
            expect(await workflow).toHaveProperty('state', 'active');
        });
    });
});
