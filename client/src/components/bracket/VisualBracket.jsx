export function getRounds(matches, bracket_details) {
  const match_count = matches.length;
  const pps = bracket_details.players_per_station;
  const pmo = bracket_details.players_move_on;
  const shallow_matches = [...matches];
  const rounds = [];
  let total_games = 0;
  const matches_per_round = [];
  while (total_games < match_count) {
    const new_round = Math.pow(pps / pmo, matches_per_round.length + 1);
    matches_per_round.push(new_round);
    total_games += new_round;
  }
  for (let i = 0; i < matches_per_round.length; i++) {
    rounds.unshift(shallow_matches.splice(-matches_per_round[i]));
  }
  return rounds;
}

export function MatchVisual({ matchDetails, playerDetails, bracketInfo }) {
  return (
    <div className="match-visual">
      <span>{matchDetails.name_id}</span>
      <div className={"players"}>
        {Array.from({ length: bracketInfo.players_per_station }, (_, index) => (
          <div
            className={
              "player-data match-player-" +
              (index < matchDetails.players.length
                ? matchDetails.players[index]
                : matchDetails.is_bye
                ? "null bye"
                : "null")
            }
            key={index}
          >
            <div className="player-seed">
              {index < matchDetails.players.length
                ? playerDetails.find(
                    (player) => player.player_id === matchDetails.players[index]
                  ).seed + 1
                : ""}
            </div>
            <div className="player-name">
              {index < matchDetails.players.length
                ? playerDetails.find(
                    (player) => player.player_id === matchDetails.players[index]
                  ).name
                : matchDetails.is_bye
                ? "BYE"
                : null}
            </div>
            <div className="player-score">
              {matchDetails.is_done && index < matchDetails.scores.length
                ? matchDetails.scores[index]
                : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
