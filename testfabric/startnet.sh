
cd ../myNetwork/

cd ../fabcar/

docker ps -a
    
docker-compose -f docker-compose-cli.yaml -f docker-compose-couch.yaml -f docker-compose-e2e-template.yaml down --volumes --remove-orphans

docker stop $(docker ps -aq)

docker rm $(docker ps -aq)

docker-compose -f docker-compose-cli.yaml -f docker-compose-couch.yaml -f docker-compose-e2e-template.yaml up -d

docker exec cli scripts/script.sh testchannel 3 node 10 false