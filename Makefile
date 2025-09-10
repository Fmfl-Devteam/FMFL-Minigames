default: build

prepare:
	pnpm install
	pnpm husky
	cp .env.example .env

build:
	pnpm tsc

format:
	pnpm prettier --ignore-path .gitignore --write "**/*.+(js|ts|json)"

clean:
	rm -rf dist

dev:
	pnpm tsx watch src/index.ts

check:
	pnpm tsc --noEmit
	pnpm prettier --ignore-path .gitignore --check "**/*.+(js|ts|json)"