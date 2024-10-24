using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using System.Data;

namespace Portfolio.Server.Services
{
    public class SnakeGameService
    {
        private readonly string _connectionString;

        // Konstruktor z wstrzykiwaniem IConfiguration
        public SnakeGameService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public void InsertScore(string username, int score, int timePlay, int difficulty)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("[dbo].[InsertScoreFromSnakeGame]", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@username", username);
                    command.Parameters.AddWithValue("@score", score);
                    TimeSpan time = TimeSpan.FromSeconds(timePlay);
                    command.Parameters.AddWithValue("@timePlay", time);
                    command.Parameters.AddWithValue("@difficult", difficulty);

           
                    connection.Open();
                    command.ExecuteNonQuery();

                }
            }  
        }

        public async Task<List<SnakeScoreDto>> GetScoresAsync()
        {
            var scores = new List<SnakeScoreDto>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = @"
                    SELECT TOP 25
                        [sc_UserName] AS 'User',
                        [sc_Score] AS 'Score',
                        [sc_Difficult] AS 'Difficult',
                        [sc_TimeStamp] AS 'Date'
                    FROM [kedzior299_mainPortfolio].[kedzior299_superadmin].[pf_SnakeScore]
                    ORDER BY sc_Score desc";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    await connection.OpenAsync();
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var score = new SnakeScoreDto
                            {
                                User = reader["User"].ToString(),
                                Score = (int)reader["Score"],
                                Difficult = (int)reader["Difficult"],
                                Date = (DateTime)reader["Date"]
                            };
                            scores.Add(score);
                        }
                    }
                }
            }

            return scores;
        }
    }

    public class SnakeScoreDto
    {
        public string User { get; set; }
        public int Score { get; set; }
        public int Difficult { get; set; }
        public DateTime Date { get; set; }
    }


}

