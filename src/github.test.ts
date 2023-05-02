import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { githubAPI, listRepos, enableRepoActions } from "./github";

const token = process.env.GITHUB_TOKEN || 'any';

describe("githubAPI", () => {
	it("should retrieve a repo", async () => {
		const repo = await githubAPI(token, 'nephelaiio/ansible-role-metricbeat')
		expect(repo).toHaveProperty('state', 'active')
	});
});

describe("listRepos", () => {
	it("should return a lst of repositories", async () => {
		const json = await listRepos(token, 'nephelaiio');
		expect(json).toHaveLength(30);
		expect(json[0]).toHaveProperty('name', 'ansible-playbooks');
		expect(json[json.length-1]).toHaveProperty('name', 'ansible-role-metricbeat');
	});
});

describe("enableRepo", () => {
	it("should enable a Repo", async () => {
		const workflows = await enableRepoActions(token, 'nephelaiio/ansible-role-metricbeat')
		workflows.forEach(async (workflow) => {
			expect(await workflow).toHaveProperty('state', 'active')
		});
	});
});
