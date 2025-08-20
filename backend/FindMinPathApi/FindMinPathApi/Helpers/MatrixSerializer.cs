using Newtonsoft.Json;

namespace FindMinPathApi.Helpers
{
    public static class MatrixSerializer
    {
        // Convert int[,] to int[][]
        public static int[][] ConvertToJagged(int[,] matrix)
        {
            int n = matrix.GetLength(0);
            int m = matrix.GetLength(1);
            int[][] jagged = new int[n][];

            for (int i = 0; i < n; i++)
            {
                jagged[i] = new int[m];
                for (int j = 0; j < m; j++)
                {
                    jagged[i][j] = matrix[i, j];
                }
            }

            return jagged;
        }

        // Convert to JSON
        public static string ToJson(int[,] matrix)
        {
            var jagged = ConvertToJagged(matrix);
            return JsonConvert.SerializeObject(jagged);
        }

        // Convert back from JSON
        public static int[,] FromJson(string json)
        {
            var jagged = JsonConvert.DeserializeObject<int[][]>(json);
            int n = jagged.Length;
            int m = jagged[0].Length;

            int[,] rect = new int[n, m];
            for (int i = 0; i < n; i++)
                for (int j = 0; j < m; j++)
                    rect[i, j] = jagged[i][j];

            return rect;
        }
    }
}
