WEBPACK = ./node_modules/.bin/webpack

compile:
	$(WEBPACK) -p && cp ./vendor/libflac* ./build