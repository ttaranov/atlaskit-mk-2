FROM node:8.4.0

# Install zip
RUN apt-get -y update
RUN apt-get -y install zip

# Install yarn
# NOTE: This version of yarn is not the one that is used to install dependencies at the root. That yarn
# version comes from bolt itself ("~/.config/yarn/global/node_modules/bolt/node_modules/.bin/yarn")
RUN curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.8.0
ENV PATH $HOME/.yarn/bin:$PATH

# Install bolt
ENV BOLT_VERSION "0.20.7"
RUN yarn global add "bolt@$BOLT_VERSION"

