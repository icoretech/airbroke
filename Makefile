run: stop
	docker compose up $(filter-out $@,$(MAKECMDGOALS)) --remove-orphans --no-attach caddy

stop:
	docker compose down --remove-orphans

build:
	docker compose build --pull

resetdb: stop
	docker compose run --rm web npx prisma migrate reset --force

# dummy rule that prevents make from printing an error message for
# any targets that were not defined
%:
	@:
