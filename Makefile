ENV_FILE=.env

.PHONY: dev prod up down logs ps restart psql

dev:
	cp .env.development $(ENV_FILE)
	docker-compose up --build

prod:
	cp .env.production $(ENV_FILE)
	docker-compose -f docker-compose.yaml up --build

up:
	docker-compose up --build

pause:
	docker-compose pause

unpause:
	docker-compose unpause

down:
	docker-compose down

logs:
	docker-compose logs -f

ps:
	docker-compose ps

restart: down up

psql:
	docker exec -it postgres psql -U user -d tododb