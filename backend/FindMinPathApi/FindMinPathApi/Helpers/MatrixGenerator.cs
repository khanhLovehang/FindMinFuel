namespace FindMinPathApi.Helpers
{
    public static class MatrixGenerator
    {
        public static int[,] GenerateMatrix(int n, int m, int p)
        {
            Random rnd = new Random();
            int[,] grid = new int[n, m];

            // Step 1: Ensure at least one of each chest 1..p
            for (int k = 1; k <= p; k++)
            {
                int i, j;
                do
                {
                    i = rnd.Next(0, n);
                    j = rnd.Next(0, m);
                } while (grid[i, j] != 0); // make sure not overwriting another guaranteed chest

                grid[i, j] = k;
            }

            // Step 2: Fill remaining cells randomly with 1..p
            for (int i = 0; i < n; i++)
            {
                for (int j = 0; j < m; j++)
                {
                    if (grid[i, j] == 0)
                    {
                        grid[i, j] = rnd.Next(1, p + 1);
                    }
                }
            }

            return grid;
        }

        // Helper to print matrix
        public static void PrintMatrix(int[,] grid, int n, int m)
        {
            for (int i = 0; i < n; i++)
            {
                for (int j = 0; j < m; j++)
                {
                    Console.Write(grid[i, j] + " ");
                }
                Console.WriteLine();
            }
        }
    }
}
