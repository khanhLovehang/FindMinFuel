namespace FindMinPathApi.Helpers
{
    public static class TreasureFinder
    {
        public static double CalculateMinFuel(int[,] matrix, int n, int m, int p)
        {
            // Step 1: Store positions for each key 1..p
            var positions = new List<(int r, int c)>[p + 1];
            for (int i = 0; i <= p; i++)
                positions[i] = new List<(int, int)>();

            for (int i = 0; i < n; i++)
            {
                for (int j = 0; j < m; j++)
                {
                    int val = matrix[i, j];
                    if (val >= 1 && val <= p)
                    {
                        positions[val].Add((i, j));
                    }
                }
            }

            // Step 2: Start from (0,0) with key 0
            List<(int r, int c)> prevPositions = new List<(int, int)> { (0, 0) };
            double totalFuel = 0;

            // Step 3: Iterate through keys in order
            for (int key = 1; key <= p; key++)
            {
                double minDist = double.MaxValue;

                foreach (var from in prevPositions)
                {
                    foreach (var to in positions[key])
                    {
                        double dist = Distance(from, to);
                        if (dist < minDist)
                            minDist = dist;
                    }
                }

                totalFuel += minDist;
                prevPositions = positions[key];
            }

            return totalFuel;
        }

        private static double Distance((int r, int c) a, (int r, int c) b)
        {
            return Math.Sqrt(Math.Pow(a.r - b.r, 2) + Math.Pow(a.c - b.c, 2));
        }
    }
}
