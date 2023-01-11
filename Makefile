ANGULAR_ENV_PROD := src/environments/environment.prod.ts
ANGULAR_ENV := src/environments/environment.ts

default: build

angular-environment:
	@echo "export const environment = { production: true, firebase: $${firebase} }" > $(ANGULAR_ENV_PROD)
	@echo "export const environment = { production: false, firebase: $${firebase} }" > $(ANGULAR_ENV)

build: angular-environment
ng build --prod

