//Shiffman's flocking algos
// https://p5js.org/examples/simulate-flocking.html

const Victor = require("victor");
const Genny = require("./genny");
const D = require("./defaults");

let goalPolyculeSize = [2, 3, 4, 4, 5, 6, 7, 8, 9];

//just for calculating the flocking forces, actual pos is outside
class Boid {
    constructor(genny) {
        this.acceleration = new Victor(0, 0);
        this.velocity = new Victor(D.map(Math.random(), 0, 1, -1, 1), D.map(Math.random(), 0, 1, -1, 1));
        // this.pos is external, this boid is just for motion force, but still need for qtree?
        this.pos = genny.pos;
        this.r = genny.radius;
        // this.posVector = new Victor(this.pos.x, this.pos.y);
        this.perceptionRadius = genny.perceptionRadius || 400;
        this.maxSpeed = genny.maxSpeed;
        this.maxForce = genny.maxForce || 0.05;
        this.desiredSeparation = genny.desiredSeparation || 80;
        this.separationBias = genny.separationBias || 10; //go down if ready to mate
        this.desiredFlockSize = genny.desiredFlockSize || 12;
        // this.desiredFlockSize = genny.desiredFlockSize || goalPolyculeSize[Math.floor(Math.random() * goalPolyculeSize.length)]; //num people they want around
        this.alignmentBias = genny.alignmentBias || 1;
        this.cohesionBias = genny.cohesionBias || 1.5;
        this.hunger = genny.hunger || 10; //to mult food seeking
    }

    // main genny flocking/lube/mate function
    run (self, gennies, lubeLocations) {
        //first adjust biases if not ready to mate
        this.separationBias = (self.isTooDry) ? 20 : 1;
        this.cohesionBias = (self.isHorny) ? 50 : 20;
        this.alignmentBias = (self.isReadyToMate) ? 10: 5;

        let surroundings = this.lookAround(self, gennies, lubeLocations);
        this.flock(surroundings.neighbors);
        // if (gennies.length > 1) {this.flock(surroundings.neighbors)}; //fixing weird bug with one genny getting stuck on edge
        let snack; //lube
        if (self.wetness < D.options.maxWetness * 0.8) {snack = this.graze(surroundings.lubeAround)}; //doesn't seek lube unless it needs it
        let mate = this.cruise(self, surroundings.neighbors); //findMate() -- needs self for mating info
        // console.log("snack: " + snack)
        this.bounds();
        this.update();
        this.pos.add(this.velocity); //forgot i need to update this pos too
        // return [this.velocity, snack, mate];
        return [snack, mate];
    }

    // lookAround (self, qtree) {
    lookAround (self, gennies, lubeLocations) {
        // let perception = new Circle(this.pos.x, this.pos.y, this.perceptionRadius);
        // let allAround = qtree.query(perception);
        let surroundings = {
            neighbors: [],
            lubeAround: []
        };

        for (let genny of gennies) {
          if (genny.id !== self.id) {
            if (Math.hypot((this.pos.x - genny.pos.x), (this.pos.y - genny.pos.y)) <= this.perceptionRadius) {
              surroundings.neighbors.push(genny);
            }
          }
        }

        for (let lube of lubeLocations) {
            if (Math.hypot((this.pos.x - lube.pos.x), (this.pos.y - lube.pos.y)) <= this.perceptionRadius) {
              surroundings.lubeAround.push(lube);
            }
        }

        return surroundings; 
    }

    graze (lubeAround) {
        let snack = undefined;
        lubeAround.forEach( (lube) => {
            if (Math.hypot((this.pos.x - lube.pos.x), (this.pos.y - lube.pos.y)) <= this.r) {
                snack = lube; //send up to splice and add to wetness
            } else {
                //fine to do this for each b/c lube drive is heavier? 
                //will they get stuck between lube? maybe should check for biggest lube? or depends... -- edit: yes, TODO FIX
                let lubeVec = new Victor(lube.pos.x, lube.pos.y);
                let hunger = this.seek(lubeVec);
                hunger.multiply(new Victor(this.hunger, this.hunger));
                this.applyForce(hunger);
            }
        });
        return snack;
    }

    cruise (self, neighbors) {
        let mate = undefined;
        for (let neighbor of neighbors) {
            if (Math.hypot((self.pos.x - neighbor.pos.x), (self.pos.y - neighbor.pos.y)) <= (self.radius / 2 + neighbor.radius / 2) &&
                self.isReadyToMate) { 
                mate = neighbor;    
                // console.log("mate", mate);
                break; 
            }
          }

        return mate;
    }

    //
    //
    //
    // FLOCKING AND MOVEMENT
    //
    //
    //

    
    flock (gennies) {
        let separation = this.separation(gennies);
        let alignment = this.alignment(gennies);
        let cohesion = this.cohesion(gennies);

        separation.multiply(new Victor(this.separationBias, this.separationBias));
        alignment.multiply(new Victor(this.alignmentBias, this.alignmentBias));
        cohesion.multiply(new Victor(this.cohesionBias, this.cohesionBias));

        this.applyForce(separation);
        this.applyForce(alignment);
        this.applyForce(cohesion);
    }

    bounds() {
        if (this.pos.x > D.ecoWidth - 10) {this.applyForce(new Victor(-1, 0))}
        if (this.pos.x < 10) {this.applyForce(new Victor(1, 0))}
        if (this.pos.y > D.ecoHeight - 10) {this.applyForce(new Victor(0, -1))}
        if (this.pos.y < 10) {this.applyForce(new Victor(0, 1))};
    }

    update() {
        // console.log(this.acceleration);
        this.velocity.add(this.acceleration);
        this.velocity = this.limit(this.velocity, this.maxSpeed);
        this.acceleration.multiply(new Victor(0, 0));
    }

    applyForce (force) {
        //could add mass or other things later, redundant for now
        this.acceleration.add(force);
    }

    limit (vector, max) { //DIY p5.Vector.limit since Victor.limit isn't the same
        //normalize then mult by max
        vector.normalize();
        vector.multiply(new Victor(max, max));
        return vector;
    }

    seek (target) { //not sure if this is necessary, but might be able to use for food?
        let desired = target.subtract(this.pos);
        desired.normalize(); //removing to see if limit is enough, per james' suggestion 1/11
        desired.multiply(new Victor(this.maxSpeed, this.maxSpeed));
        let steer = desired.subtract(this.velocity);
        // let test = this.limit(steer, this.maxForce);
        // console.log("test " + test);
        steer = this.limit(steer, this.maxForce);
        // console.log(steer);
        return steer;
    }

    separation (gennies) {
        let steer = new Victor(0, 0);
        let count = 0;
        //for every boid, check if too close
        for (let genny of gennies) {
            let d = this.pos.distance(genny.pos);
            if (d > 0 && d < this.desiredSeparation) {
                let diff = this.pos.clone(); //this.pos is getting subtracted from!! without clone it was messing with this.pos!! WHAT IS A REFERENCE
                diff.subtract(genny.pos);
                // diff.normalize(); // 1/11 remove test
                diff.divide(new Victor(d, d));
                steer.add(diff);
                count++;
            }
        }

        if (count > 0) {
            // console.log('count ' + count);
            steer.divide(new Victor(count, count));
        }

        if (steer.magnitude() > 0) {
            // console.log("separation steer before " + steer);
            steer.normalize(); // 1/11 remove test
            steer.multiply(new Victor(this.maxSpeed, this.maxSpeed));
            steer.subtract(this.velocity);
            steer = this.limit(steer, this.maxForce);
            // console.log("separation steer after " + steer);
        }

        return steer;
    }

    alignment (gennies) {
        //should eventually have some sort of leadership variable that modifies this
        let sum = new Victor(0, 0);
        let count = 0;
        for (let genny of gennies) {
            let d = this.pos.distance(genny.pos);
            if (d > 0 && d < this.desiredFlockSize) {
                sum.add(genny.boid.velocity);
                count++;
            }
        }

        if (count > 0) {
            sum.divide(new Victor(count, count));
            sum.normalize(); // 1/11 remove test
            sum.multiply(new Victor(this.maxSpeed, this.maxSpeed));
            let steer = sum.subtract(this.velocity);
            // console.log("alignment steer before " + steer);
            steer = this.limit(steer, this.maxForce);
            // console.log("alignment steer after " + steer);
            
            return steer;
        } else {
            return new Victor(0, 0);
        }
    }

    cohesion (gennies) { 
        let sum = new Victor(0, 0);
        let count = 0;
        for (let genny of gennies) {
            let d = this.pos.distance(genny.pos);
            if (d > 0 && d < this.desiredFlockSize) {
                sum.add(genny.pos);
                count++;
            }
        }

        if (count > 0) {
            sum.divide(new Victor(count, count));
            return this.seek(sum)
        } else {
            return new Victor(0, 0);
        }
    }
}

module.exports = Boid;
