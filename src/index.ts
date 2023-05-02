import { listRepos } from './github';

export interface Env {}

export default {
	async scheduled(
		controller: ScheduledController,
		env: Env,
		ctx: ExecutionContext
	): Promise<void> {
		console.log('hello');
	}
};
