CREATE VIEW lobby_maze_view AS
SELECT 
    lob.lobby_id
  , lob.status AS lobby_status
  , lob.code AS lobby_code
  , lob.prompt AS lobby_prompt
  , lob.num_samples
  , maz.maze_id
  , maz.status AS maze_status
  , maz.string AS maze_string
FROM lobby lob
JOIN lobby_maze lma ON lob.lobby_id = lma.lobby_id
JOIN maze maz ON maz.maze_id = lma.maze_id
;