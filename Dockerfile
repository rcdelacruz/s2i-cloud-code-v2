FROM registry.redhat.io/ubi8/s2i-base

# This image provides a Node.JS environment you can use to run your Node.JS
# applications.

EXPOSE 8080

# Add $HOME/node_modules/.bin to the $PATH, allowing user to make npm scripts
# available on the CLI without using npm's --global installation mode
# This image will be initialized with "npm run $NPM_RUN"
# See https://docs.npmjs.com/misc/scripts, and your repo's package.json
# file for possible values of NPM_RUN
# Description
# Environment:
# * $NPM_RUN - Select an alternate / custom runtime mode, defined in your package.json files' scripts section (default: npm run "start").
# Expose ports:
# * 8080 - Unprivileged port used by nodejs application

ENV NODEJS_VERSION=14 \
    NPM_RUN=start \
    NAME=nodejs \
    NPM_CONFIG_PREFIX=$HOME/.npm-global \
    PATH=$HOME/node_modules/.bin/:$HOME/.npm-global/bin/:$PATH

ENV SUMMARY="Platform for building and running Node.js $NODEJS_VERSION applications" \
    DESCRIPTION="Node.js $NODEJS_VERSION available as container is a base platform for \
    building and running various Node.js $NODEJS_VERSION applications and frameworks. \
    Node.js is a platform built on Chrome's JavaScript runtime for easily building \
    fast, scalable network applications. Node.js uses an event-driven, non-blocking I/O model \
    that makes it lightweight and efficient, perfect for data-intensive real-time applications \
    that run across distributed devices."

LABEL summary="$SUMMARY" \
    description="$DESCRIPTION" \
    io.k8s.description="$DESCRIPTION" \
    io.k8s.display-name="Node.js $NODEJS_VERSION" \
    io.openshift.expose-services="8080:http" \
    io.openshift.tags="builder,$NAME,${NAME}${NODEJS_VERSION}" \
    io.openshift.s2i.scripts-url="image:///usr/libexec/s2i" \
    io.s2i.scripts-url="image:///usr/libexec/s2i" \
    com.redhat.dev-mode="DEV_MODE:false" \
    com.redhat.deployments-dir="${APP_ROOT}/src" \
    com.redhat.dev-mode.port="DEBUG_PORT:5858" \
    com.redhat.component="${NAME}-${NODEJS_VERSION}-container" \
    name="ubi8/$NAME-$NODEJS_VERSION" \
    version="1" \
    com.redhat.license_terms="https://www.redhat.com/en/about/red-hat-end-user-license-agreements#UBI" \
    maintainer="SoftwareCollections.org <sclorg@redhat.com>" \
    help="For more information visit https://github.com/sclorg/s2i-nodejs-container" \
    usage="s2i build <SOURCE-REPOSITORY> ubi8/$NAME-$NODEJS_VERSION:latest <APP-NAME>"

RUN yum -y module reset nodejs && yum -y module enable nodejs:$NODEJS_VERSION && \
    INSTALL_PKGS="nodejs npm nodejs-nodemon nss_wrapper" && \
    ln -s /usr/lib/node_modules/nodemon/bin/nodemon.js /usr/bin/nodemon && \
    yum remove -y $INSTALL_PKGS && \
    yum install -y --setopt=tsflags=nodocs $INSTALL_PKGS && \
    rpm -V $INSTALL_PKGS && \
    yum -y clean all --enablerepo='*' && \
    npm install -g yarn -s &>/dev/null

# Install OpenShift CLI tool
RUN wget https://mirror.openshift.com/pub/openshift-v4/clients/ocp/stable/openshift-client-linux.tar.gz && \
    tar -xf openshift-client-linux.tar.gz && \
    ln -s $(pwd)/oc /usr/bin/oc 

# Copy the S2I scripts from the specific language image to $STI_SCRIPTS_PATH
COPY ./s2i/bin/ $STI_SCRIPTS_PATH

# Copy extra files to the image.
COPY ./root/ /
# COPY ./root/opt/app-root/etc/parse-config.js ${APP_ROOT}/src

# Drop the root user and make the content of /opt/app-root owned by user 1001
RUN chown -R 1001:0 ${APP_ROOT} && chmod -R ug+rwx ${APP_ROOT} && \
    rpm-file-permissions

USER 1001

# Set the default CMD to print the usage of the language image
CMD $STI_SCRIPTS_PATH/usage
