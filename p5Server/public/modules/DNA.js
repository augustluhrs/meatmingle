//only used for offspring generation
//normalized range so ecosystem can adjust all at once if needed
class DNA {
  constructor(_DNA){
    if (_DNA.genes !== undefined) { //child, passed parent genes
      this.genes = [];
      for (let [i,gene] of _DNA.genes.entries()) {
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
    else if (_DNA !== undefined) { //user created Genny, needs to create DNA
      this.poem = _DNA.poem;
      this.colors = _DNA.colors; //[primary, secondary, hair]
      this.radius = _DNA.radius; //based on generous (bigger) to thirsty (smaller)
      this.maxSpeed = _DNA.maxSpeed; //from thirsty
      this.refractoryPeriod = _DNA.refractoryPeriod; //from prolific
      this.childInheritance = _DNA.childInheritance; //from generous
      this.minLubeToMate = _DNA.minLubeToMate; //from prepared
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
    else {
      console.log("Genny _DNA error: ");
      console.log(_DNA);
    }
    
  }
}

module.exports = DNA;
