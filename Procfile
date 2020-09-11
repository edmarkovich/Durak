
#web: waitress-serve --port=$PORT --threads=200 app:app
web: NEW_RELIC_CONFIG_FILE=newrelic.ini newrelic-admin run-program waitress-serve --port=$PORT --threads=200 app:app
