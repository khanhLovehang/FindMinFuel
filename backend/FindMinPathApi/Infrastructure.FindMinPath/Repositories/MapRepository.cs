using Infrastructure.FindMinPath.Interfaces;
using Infrastructure.FindMinPath.Models;
using Infrastructure.FindMinPath.Requests;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.FindMinPath.Repositories
{
    public class MapRepository : RepositoryBase<Map>, IMapRepository
    {
        #region properties
        #endregion

        #region constructor
        public MapRepository(RepositoryContext repositoryContext)
            : base(repositoryContext)
        {
        }
        #endregion

        #region methods

        public async Task<IEnumerable<Map>> GetAllMapsAsync(bool trackChanges, int page = 0, int size = 1)
        {
            return await FindAll(trackChanges)
                //.Where(i => i.IsVisibility == true)
                .OrderBy(i => i.CreatedDate)
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();
        }

        public async Task<Map> GetMapAsync(int mapId, bool trackChanges) =>
            await FindByCondition(i => i.Id.Equals(mapId), trackChanges).SingleOrDefaultAsync();

        public void CreateMap(Map Map) => Create(Map);
        public void DeleteMap(Map Map) => Delete(Map);
        public void UpdateMap(Map Map) => Update(Map);

        #endregion
    }
}
