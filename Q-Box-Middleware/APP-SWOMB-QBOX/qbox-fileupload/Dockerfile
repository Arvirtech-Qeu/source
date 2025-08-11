FROM openjdk:11

ENV VERTICLE_FILE=target/FileUpload-Runner.jar
ENV CONF_FOLDER=src
# Set the location of the verticles
ENV VERTICLE_HOME=/opt/verticles

EXPOSE 8088

COPY $VERTICLE_FILE $VERTICLE_HOME/
ADD $CONF_FOLDER $VERTICLE_HOME/src/

WORKDIR $VERTICLE_HOME
ENTRYPOINT ["sh", "-c"]

CMD ["java -jar FileUpload-Runner.jar -conf ./src/config/$ENVIRONMENT.json" ]
