#### Useful Articles:
https://blog.appsignal.com/2022/01/19/how-to-set-up-a-nodejs-project-with-typescript.html -- to setup typescript development environment.

#### Message flow trail1:
    - dictator creates a pod with the env variable run_id.
    - follower picks up the run_id and sets up it's environtment and raises (run.run_id.ready) so every one nows that the run is ready to follower is ready to receive messages.
    - then follower will bind to a topic exchange and listens to (run_id.*) various commands from the parent process and responds accordingly eg: run_id.stop, run_id.start, run_id.heartbeat etc...

