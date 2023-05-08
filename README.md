# Worker Github Actions

[![Test](https://github.com/nephelaiio/worker-github-actions/actions/workflows/test.yml/badge.svg)](https://github.com/nephelaiio/worker-github-actions/actions/workflows/test.yml) [![Deploy](https://github.com/nephelaiio/worker-github-actions/actions/workflows/main.yml/badge.svg)](https://github.com/nephelaiio/worker-github-actions/actions/workflows/main.yml)

Worker Github Actions is a Cloudflare Worker that periodically enables Github Actions for all repositories in a given organization. This project uses the [Github REST API v3](https://docs.github.com/en/rest) to access Github repository information and the [Cloudflare Workers API](https://developers.cloudflare.com/workers) to automate the Github Actions workflow.

## Installation

To install and deploy the Worker Github Actions project, follow these steps:

1. Clone the repository: `git clone git@github.com:nephelaiio/worker-github-actions.git`
2. Install dependencies: `npm install`
3. Create a [Cloudflare API token](https://developers.cloudflare.com/api) with the `Workers Scripts` permission.
4. Configure [Cloudflare API token](https://developers.cloudflare.com/api) for deployment

```sh
   npm run configure -- secret.gh_token <Cloudflare API token>
```

5. Deploy the worker: `npm run deploy`

## Usage

After the worker has been deployed, it will periodically enable Github Actions for all repositories in the organization specified by the `GH_ORG` environment variable. By default, the worker runs every day at midnight UTC. You can modify the scheduling by changing the cron expression in the `wrangler.toml` file.

If you need to manually trigger the worker, you can do so by sending a `POST` request to the worker's URL with an empty body.

## Contributing

We welcome contributions to this project! To get started, fork the repository and create a new branch for your changes. When you're ready to submit your changes, create a pull request.

Before submitting a pull request, please ensure that your code follows our code style guidelines and that all tests pass. You can run tests with the command `npm test`.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
