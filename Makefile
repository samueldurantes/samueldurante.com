PROD ?= 0

ifeq ($(PROD),0)
	FLAGS := --buildDrafts
endif

.PHONY: install
install:
	npm install

.PHONY: build
build:
	hugo $(FLAGS)

.PHONY: server
server:
	hugo server $(FLAGS)
