
class Match {
    constructor(players=[], isBye=false, isThird=false) {
        this.players = players;
        this.results = [];
        this.nextMatches = [];
        this.isThird = isThird;
        this.isBye = isBye;
        this.isStarted = false;
        this.isCompleted = false;
    }
}

class SingleEliminationBracket {
    constructor(players_per_station=2, players_move_on=1, 
        third_place_match=false, seeded=true, started=false, completed=false) {
        this.matches = [];
        this.players_per_station = players_per_station;
        this.players_move_on = players_move_on;
        this.third_place_match = third_place_match;
        this.seeded = seeded;
        this.started = started;
        this.completed = completed;
    }

    /*
    This generates a bracket based on all of the variables. It expects a list of
    ordered ids representing user_ids in seed order.
    */
    generateBracket(participants){
        let round = -1;
        let total = participants.length;
        let num_matches = 0;
        let third = null;
        if (this.third_place_match) { 
            third = new Match(isThird=true); 
        }
        do {
            let new_matches = []
            round += 1;
            num_matches = Math.pow((this.players_per_station/this.players_move_on), round);
            for(let i = 0; i < num_matches; i++) {
                let new_match = new Match();
                if (round !== 0) {
                    for (let j = 0; j < this.players_move_on; j++) {
                        let val = Math.floor(((this.matches.length + i-1)*this.players_move_on)/this.players_per_station)+j;
                        if (val > this.matches.length-1) { val = Math.floor((val*this.players_move_on)/this.players_per_station); }
                        new_match.nextMatches.push(val)
                    }
                    if (round === 1 && third) {
                        for (let j = 0; j < this.players_move_on; j++) {
                            new_match.nextMatches.push(-1);
                        }
                    }
                    new_matches.push(new_match);
                } else {
                    new_matches.push(new_match);
                }
            }
            while (new_matches.length > 0) {this.matches.push(new_matches.shift());}
        }while(total > num_matches*this.players_per_station);
        let seed_locations = this.seeding(round);
        let num_first_matches = seed_locations.length/this.players_per_station
        for(let match = 0; match < num_first_matches; match += 1) {
            let seed_index = match*this.players_per_station;
            let bracket_index = this.matches.length-num_first_matches+match;
            let seeds_to_play = seed_locations.slice(seed_index, seed_index+this.players_per_station);
            seeds_to_play.forEach((value) => {
                if (value-1 < participants.length) {
                    this.matches[bracket_index].players.push(participants[value-1]);
                }
            })
            if(this.matches[bracket_index].players.length <= this.players_move_on) {
                this.matches[bracket_index].isBye = true;
            }
        }
    }

    seeding(rounds) {
        let pls = [];
        let diff = this.players_per_station/this.players_move_on;
        if(this.players_per_station === 2) {
            pls = [1,2];
            for (let round = 0; round < rounds; round++) {
              pls = nextLayer2(pls, diff);
            }
        } else if (this.players_per_station === 3) {
            pls = [1,2,3];
            for (let round = 0; round < rounds; round++) {
              pls = nextLayer3(pls);
            }
        } else if (this.players_per_station === 4) {
            pls = [1,4,2,3];
            for (let round = 0; round < rounds; round++) {
              pls = nextLayer2(pls, diff);
            }
        }
      
        return pls;
      
        function nextLayer2(pls, diff) {
          let out = [];
          let length = pls.length * (diff) + 1;
      
          for (let i = 0; i < pls.length; i++) {
            out.push(pls[i]);
            out.push(length - pls[i]);
          }
      
          return out;
        }
        function nextLayer3(pls) {
            let out = [];
            let length = pls.length * 2 + 1
        
            for (let i = 0; i < pls.length; i++) {
              out.push(pls[i]);
              out.push(length - pls[i]);
              out.push(length + pls[i]-1)
            }
        
            return out;
          }
      }
}

class Tournament {
    constructor(id, style="singleElimination", participants=[]) {
        this.id = id;
        this.style = this.setStyle(style);
        this.participants = participants;
        this.bracket = null;
    }

    setStyle(style) {
        this.style = style;
        if(this.style === "singleElimination") {
            this.bracket = SingleEliminationBracket();
        }
    }

    loadMatch(newMatch) {
        let newGame = new Match();
        unmappedPlayers = newMatch.players.split(',');
        unmappedMatches = newMatch.next_matches.split(',');
        unmappedScores = newMatch.scores.split(',')

        newGame.players = unmappedPlayers.map(Number);
        newGame.nextMatches = unmappedMatches.map(Number);
        newGame.scores = unmappedScores.map(Number);
        newGame.isBye = Boolean(newMatch.is_bye);
        newGame.isStarted = Boolean(newMatch.is_started);
        newGame.isCompleted = Boolean(is_done);
        this.bracket.matches.push(newGame)
    }

    exportMatch(m, idx) {
        return{ 
            id:idx,
            players: m.player.join(','),
            next_matches: m.nextMatches.join(','),
            scores: m.scores.join(','),
            is_bye: Number(m.isBye),
            is_started: Number(m.isStarted),
            is_done: Number(isCompleted),
        }
    }

    generateRandomBracket() {
        randomSeed = this.participants.map(value => ({ player_id: value.player_id, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ player_id }) => player_id)
        this.bracket.generateBracket(randomSeed);
    }

    generateSeededBracket(){
        this.bracket.generateBracket(this.participants.map(player => player.player_id));
    }

    addParticipant(participant){
        return this.participants.push(participant)
    }
}


