FROM openjdk:11

# Environment variables
ENV VERTICLE_FILE=target/Media-Runner.jar
ENV CONF_FOLDER=src
ENV VERTICLE_HOME=/opt/verticles
ENV ENVIRONMENT=env

# Install FFmpeg
RUN apt-get update
RUN apt-get install -y ffmpeg
RUN apt-get clean

# Expose the application port
EXPOSE 8089

# Copy the Java application JAR file and configuration files
COPY $VERTICLE_FILE $VERTICLE_HOME/
ADD $CONF_FOLDER $VERTICLE_HOME/src/

# Set the working directory
WORKDIR $VERTICLE_HOME

# Set the entry point to run the Java application
ENTRYPOINT ["sh", "-c"]

# Default command to run the Java application
CMD ["java -jar Media-Runner.jar -conf ./src/config/$ENVIRONMENT.json"]

