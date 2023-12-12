export function MatchManagerUtil(matches, hasThird) {
    const third_match = hasThird;
    let list_len = matches.length;
    let third_id = -1;

    const round_matches = [];
    const final_matches = [];

    if (third_match) {
        list_len -= 1;
        const this_match = matches[list_len];
        third_id = this_match.id;
        let player_list = [];
        let scores_list = [];
        if (this_match.players !== "") {
            player_list = this_match.players.split(",").map(Number);
        }
        if (this_match.scores !== "") {
            scores_list = this_match.scores.split(",").map(Number)
        }
        const third_place_match = {
            name: "Third Place Match",
            name_id: list_len+1,
            id: this_match.id,
            players: player_list,
            next_matches: [],
            scores: scores_list,
            is_bye: Boolean(this_match.is_bye),
            is_started: Boolean(this_match.is_started),
            is_done: Boolean(this_match.is_done),
        };
        final_matches.push(third_place_match);
    }
    for (let i = list_len-1; i > 0; i--) {
        const this_match = matches[i];
        let next_match_list = this_match.next_matches.split(",").map(Number)
        next_match_list = next_match_list.map(function(number) {
            return number === -1 ? third_id : number;
        });
        
        let player_list = [];
        let scores_list = [];
        if (this_match.players !== "") {
            player_list = this_match.players.split(",").map(Number);
        }
        if (this_match.scores !== "") {
            scores_list = this_match.scores.split(",").map(Number)
        }
        const new_match = {
            name: "Match " + (list_len - this_match.id),
            name_id: list_len - this_match.id,
            id: this_match.id,
            players: player_list,
            next_matches: next_match_list,
            scores: scores_list,
            is_bye: Boolean(this_match.is_bye),
            is_started: Boolean(this_match.is_started),
            is_done: Boolean(this_match.is_done),
        }
        round_matches.push(new_match)
    }
    const grands = matches[0];
    let player_list = [];
    let scores_list = [];
    if (grands.players !== "") {
        player_list = grands.players.split(",").map(Number);
    }
    if (grands.scores !== "") {
        scores_list = grands.scores.split(",").map(Number)
    }
    const grands_match = {
        name: "Grand Finals",
        name_id: list_len - grands.id,
        id: grands.id,
        players: player_list,
        next_matches: [],
        scores: scores_list,
        is_bye: Boolean(grands.is_bye),
        is_started: Boolean(grands.is_started),
        is_done: Boolean(grands.is_done),
    };
    final_matches.push(grands_match);
    return([round_matches, final_matches]);
}

const addPlayer = async (match_id, bid, player_id) => {
    try {
        const response = await fetch("/api/match-add-player", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            match_id: match_id,
            bid: bid,
            player_id: player_id,
          }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to add player");
        }
  
        response.json();
      } catch (error) {
        console.error("Error adding player:", error.message);
    }
}

const markStarted = async (match_id, bid) => {
    try {
        const response = await fetch("/api/match-start", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            match_id: match_id,
            bid: bid
          }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to start match");
        }
  
        response.json();
      } catch (error) {
        console.error("Error starting match:", error.message);
    }
}

const markDone = async (match_id, bid) => {
    try {
        const response = await fetch("/api/match-done", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            match_id: match_id,
            bid: bid
          }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to end match");
        }
  
        response.json();
      } catch (error) {
        console.error("Error finishing match:", error.message);
    }
}

const setScore = async (match_id, bid, score) => {
    try {
        const response = await fetch("/api/match-score", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            match_id: match_id,
            bid: bid,
            score: score,
          }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to set match score");
        }
  
        response.json();
      } catch (error) {
        console.error("Error setting match score:", error.message);
    }
}

const getMatches = async (bid) => {
    try {
        const response = await fetch(`/api/matches/${bid}`);
        if (!response.ok) {
            throw new Error("Failed to fetch match details");
        }

        const data = await response.json();
        return data
    } catch (error) {
        console.error("Error fetching match details:", error.message);
    }
}

async function updateByes(matches, bid) {
    for (let i = 0; i < matches.length; i++) {
        if (matches[i].is_bye) {
            const nextMatches = matches[i].next_matches;
            const players = matches[i].players;

            for (let index = 0; index < nextMatches.length && index < players.length; index++) {
                const matchId = nextMatches[index];
                const playerId = players[index];
                await addPlayer(matchId, bid, playerId);
            }
            await markStarted(matches[i].id, bid);
            await markDone(matches[i].id, bid);
        }
    }
}

async function tryStartMatch(matches, id, bid) {
    for(let i = 0; i < matches.length; i++){
        if(!matches[i].is_done && matches[i].next_matches.includes(id)) {
            return false;
        }
    }
    await markStarted(id, bid);
    return true;
}

export async function BracketStartMatchManage(matches, hasThird, bid) {
    let temp_match_list = MatchManagerUtil(matches, hasThird);
    let all_matches = [...temp_match_list[0], ...temp_match_list[1]];
    await updateByes(all_matches, bid);
    const updated_matches = await getMatches(bid);
    temp_match_list = MatchManagerUtil(updated_matches, hasThird);
    all_matches = [...temp_match_list[0], ...temp_match_list[1]];
    for(let i = 0; i < all_matches.length; i++){
        let m = all_matches[i];
        if(!m.is_bye && m.players.length > 0 && !m.is_started && !m.is_done) {
            await tryStartMatch(all_matches, m.id, bid);
        }
    }
    try {
        const response = await fetch("/api/start-bracket", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bid: bid
          }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to start bracket");
        }
  
        response.json();
      } catch (error) {
        console.error("Error starting bracket:", error.message);
    }
}

export async function SetMatchScore(match, score, bid, hasThird) {
    await setScore(match.id, bid, score.join(','));
    await markDone(match.id, bid);
    const combinedArray = score.map((value, index) => ({ score: value, player: match.players[index] }));
    combinedArray.sort((a, b) => b.score - a.score);
    const sortedPlayers = combinedArray.map(item => item.player);
    for (let index = 0; index < match.next_matches.length && index < sortedPlayers.length; index++) {
        const matchId = match.next_matches[index];
        const playerId = sortedPlayers[index];
        await addPlayer(matchId, bid, playerId);
    }
    const updated_matches = await getMatches(bid);
    const temp_match_list = MatchManagerUtil(updated_matches, hasThird);
    const all_matches = [...temp_match_list[0], ...temp_match_list[1]];
    for(let i = 0; i < all_matches.length; i++){
        let m = all_matches[i];
        if(!m.is_bye && m.players.length > 0 && !m.is_started && !m.is_done) {
            await tryStartMatch(all_matches, m.id, bid);
        }
    }
}