FROM ubuntu:20.04 as optpng
RUN apt-get update && \
    apt-get -y install imagemagick optipng
COPY ./src/images/ /source/
RUN for i in `find /source/ -name "*.png"` ; do \
    echo -n "$i " ; \
    echo -n `du -sh $i | awk '{print($1)}'` '-> ' ; \ 
    mogrify -filter Triangle -define filter:support=2 -thumbnail '900>' -unsharp 0.25x0.25+8+0.065 -dither None -posterize 136 -quality 82 -define jpeg:fancy-upsampling=off -define png:compression-filter=5 -define png:compression-level=9 -define png:compression-strategy=1 -define png:exclude-chunk=all -interlace none -colorspace sRGB -strip "$i"; \
    optipng --quiet --clobber --strip all -o7 "$i"; \
    echo `du -sh $i | awk '{print($1)}'` ; \
    done

FROM node AS build
WORKDIR /usr/app

COPY package.json /usr/app/
RUN npm install

COPY ./ /usr/app
COPY --from=optpng /source/ /usr/app/src/images/
RUN npm run test && npm run build

FROM nginx
COPY --from=build /usr/app/dist /usr/share/nginx/html
RUN /bin/sh -c 'echo "" > /usr/share/nginx/html/index.html'
