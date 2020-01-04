Django react docker architecture

# prerequisites
make sure sqlite db is formed before running docker 
containers
for that go to django folder and run python migrate

cd into docker folder

# for development
docker-compose build
docker-compose up

# for production
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up

# for development after adding a package using yarn add outside the container, 
# to reflect inside the container we need to remove old data volume.
# remove all volumes attached 
docker-compose down -v
docker-compose up

# environment files for production / development are located in docker/config
