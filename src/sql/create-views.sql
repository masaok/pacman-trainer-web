DROP VIEW IF EXISTS lobby_maze_view;
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
  , cre.user_id AS creator_id
  , cre.name AS creator_name
FROM lobby lob
JOIN lobby_maze lma ON lob.lobby_id = lma.lobby_id
JOIN maze maz ON maz.maze_id = lma.maze_id
JOIN user cre ON lob.created_by = cre.user_id
ORDER BY lob.lobby_id DESC
;

DROP VIEW IF EXISTS user_lobby_view;
CREATE VIEW user_lobby_view AS
SELECT 
    user.user_id
  , user.name AS user_name
  , user.status AS user_status
  , user.role AS user_role
  , lobb.lobby_id
  , lobb.code AS lobby_code
  , creat.user_id AS creator_id
  , creat.name AS creator_name
FROM user_lobby ulob
JOIN user ON user.user_id = ulob.user_id
JOIN lobby lobb ON lobb.lobby_id = ulob.lobby_id
JOIN user creat ON lobb.created_by = creat.user_id
ORDER BY ulob.lobby_id DESC
;