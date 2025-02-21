# FROM nginx:1.17.9

# ## Copy our default nginx config
# COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# ## Remove default nginx website
# RUN rm -rf /usr/share/nginx/html/*

# ## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
# COPY ./dist /usr/share/nginx/html

# CMD ["nginx", "-g", "daemon off;"]


FROM nginx:alpine
COPY ./dist/www/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
