using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Portfolio.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SnakeScoreController : ControllerBase
    {
        private readonly SnakeGameService _snakeGameService;

        // Inicjalizacja serwisu przez wstrzykiwanie zależności (dependency injection)
        public SnakeScoreController(SnakeGameService snakeGameService)
        {
            _snakeGameService = snakeGameService;
        }

        // Endpoint do przyjmowania danych wyniku od gracza
        [HttpPost("addScore")]
        public IActionResult AddScore([FromBody] SnakeScoreDto scoreDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Wywołanie serwisu, aby dodać wynik do bazy danych
            int newRecordId = _snakeGameService.InsertScore(scoreDto.Username, scoreDto.Score, scoreDto.TimePlay, scoreDto.Difficulty);

            // Zwrócenie ID nowego rekordu jako odpowiedź
            return Ok(new { RecordId = newRecordId });
        }
    }

    // DTO (Data Transfer Object) do odbierania danych od klienta (Angular)
    public class SnakeScoreDto
    {
        public string Username { get; set; }
        public int Score { get; set; }
        public int TimePlay { get; set; }
        public int Difficulty { get; set; }
    }

}
