import fs from "node:fs";
import path from "node:path";
import dedent from "ts-dedent";
import { expect, test, vi } from "vitest";
import { isBuild, serverLogs } from "../../../__test-utils__";

test.skipIf(isBuild)(
	"should display warnings if nodejs_compat is missing",
	async () => {
		await vi.waitFor(async () => {
			expect(serverLogs.warns.join("").replaceAll("\\", "/")).toContain(
				dedent`
				Unexpected Node.js imports for environment "worker". Do you need to enable the "nodejs_compat" compatibility flag? Refer to https://developers.cloudflare.com/workers/runtime-apis/nodejs/ for more details.
				 - "node:assert/strict" imported from "worker-warnings/index.ts"
				 - "perf_hooks" imported from "worker-warnings/index.ts"
				`
			);
		});
	}
);

test.runIf(isBuild)("tree-shake unused nodejs builtin", () => {
	const content = fs.readFileSync(
		path.join(
			import.meta.dirname,
			"../../dist/worker-warnings/worker/index.js"
		),
		"utf-8"
	);
	expect(content).not.toContain("perf_hooks");
});
