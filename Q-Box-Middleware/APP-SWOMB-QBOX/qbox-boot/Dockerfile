
FROM openjdk:11
ENV ENVIRONMENT env
ENV VERTICLE_FILE target/Boot-Runner.jar
ENV CONF_FOLDER src
# Set the location of the verticles
ENV VERTICLE_HOME /opt/verticles
RUN apt-get install -y curl
EXPOSE 9999

COPY $VERTICLE_FILE $VERTICLE_HOME/
ADD $CONF_FOLDER $VERTICLE_HOME/src/

WORKDIR $VERTICLE_HOME
ENTRYPOINT ["sh", "-c"]

CMD ["java -jar Boot-Runner.jar -conf ./src/config/$ENVIRONMENT.json"]
