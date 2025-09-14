# Frontend Application

# Development
dev:
	yarn dev

build:
	yarn build

preview:
	yarn preview

# Test commands
test:
	yarn test:unit

test-watch:
	yarn test:watch

test-coverage:
	yarn test:coverage

test-coverage-ui:
	yarn test:coverage:ui

test-run:
	yarn test:run

# Code quality commands
lint:
	yarn lint

lint-check:
	yarn lint:check

format:
	yarn format

format-check:
	yarn format:check

type-check:
	yarn type-check

# Quality assurance - runs all checks
quality:
	yarn quality

# Install dependencies
install:
	yarn install

# Clean dependencies and cache
clean:
	rm -rf node_modules
	rm -rf dist
	rm -rf coverage
	yarn cache clean

# Full setup for new environment
setup:
	yarn install
	yarn type-check
	yarn test:coverage
