FROM node:8.4.0

# Install yarn
RUN curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.2.1
ENV PATH $HOME/.yarn/bin:$PATH

# Install bolt
ENV BOLT_VERSION "0.20.7"
RUN echo "Installing bolt@$BOLT_VERSION"
RUN yarn global add "bolt@$BOLT_VERSION"

# Install zip
RUN apt-get -y update
RUN apt-get -y install zip
