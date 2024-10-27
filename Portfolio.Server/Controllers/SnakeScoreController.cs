using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Portfolio.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SnakeScoreController : ControllerBase
    {
        private readonly Services.SnakeGameService _snakeGameService;

     
        public SnakeScoreController(Services.SnakeGameService snakeGameService)
        {
            _snakeGameService = snakeGameService;
        }


        [HttpPost("addScore")]
        public IActionResult AddScore([FromBody] SnakeScoreDto scoreDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _snakeGameService.InsertScore(scoreDto.Username, scoreDto.Score, scoreDto.TimePlay, scoreDto.Difficulty,scoreDto.extraFoodScore,scoreDto.bonusAmount,scoreDto.bonusScore);

     
            return Ok();
        }

        [HttpGet("getScores")]
        public async Task<IActionResult> GetScores()
        {
            var scores = await _snakeGameService.GetScoresAsync();
            return Ok(scores);
        }
    }


    public class SnakeScoreDto
    {
        public string Username { get; set; }
        public int Score { get; set; }
        public int TimePlay { get; set; }
        public int Difficulty { get; set; }
        public int extraFoodScore { get; set; }
        public int bonusAmount { get; set; }
        public int bonusScore { get; set; }

    }
  

}
