//only used for offspring generation
//normalized range so ecosystem can adjust all at once if needed
//(not for radius or minLube rn)
class DNA {
  constructor(data){
    if (data !== undefined){ //user created Genny, needs to create DNA
      /*
      if (data.genes !== undefined) { //child, passed parent genes
        this.genes = [];
        for (let [i,gene] of data.genes.entries()) {
            this.genes[i] = gene;
        }
        //redundant, but for ease of reading
        this.poem = this.genes[0];
        this.colors = this.genes[1]; //[primary, secondary, hair]
        this.radius = this.genes[2]; //based on generous (bigger) to thirsty (smaller)
        this.maxSpeed = this.genes[3]; //from thirsty
        this.refractoryPeriod = this.genes[4]; //from prolific
        this.childInheritance = this.genes[5]; //from generous
        this.minLubeToMate = this.genes[6]; //from prepared
      } 
      else if (data !== undefined) { 
        */
        
      this.poem = data.poem;
      this.colors = data.colors; //[primary, secondary, hair]
      this.radius = data.radius; //based on generous (bigger) to thirsty (smaller)
      this.maxSpeed = data.maxSpeed; //from thirsty
      this.refractoryPeriod = data.refractoryPeriod; //from prolific
      this.childInheritance = data.childInheritance; //from generous
      this.minLubeToMate = data.minLubeToMate; //from prepared
      this.genes = [
        this.poem,
        this.colors,
        this.radius,
        this.maxSpeed,
        this.refractoryPeriod,
        this.childInheritance,
        this.minLubeToMate
      ]
      // } 
      // else {
      //   console.log("Genny data error: ");
      //   console.log(data);
      // }
    }
    else { //new genes for crossover, will be overwritten
      this.poem = " ";
      this.colors = [" ", " ", " "]; //[primary, secondary, hair]
      this.radius = 0; //based on generous (bigger) to thirsty (smaller)
      this.maxSpeed = 0; //from thirsty
      this.refractoryPeriod = 0; //from prolific
      this.childInheritance = 0; //from generous
      this.minLubeToMate = 0; //from prepared
      this.genes = [
        this.poem,
        this.colors,
        this.radius,
        this.maxSpeed,
        this.refractoryPeriod,
        this.childInheritance,
        this.minLubeToMate
      ]
    }
    
    
  }
}

module.exports = DNA;
