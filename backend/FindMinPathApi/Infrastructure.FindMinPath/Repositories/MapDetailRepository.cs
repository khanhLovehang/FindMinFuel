using Infrastructure.FindMinPath.Interfaces;
using Infrastructure.FindMinPath.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.FindMinPath.Repositories
{
    public class MapDetailRepository : RepositoryBase<MapDetail>, IMapDetailRepository
    {
        #region properties
        #endregion

        #region constructor
        public MapDetailRepository(RepositoryContext repositoryContext)
            : base(repositoryContext)
        {
        }
        #endregion

        #region methods

        

        public async Task<MapDetail?> GetMapDetailAsync(int Id, bool trackChanges) =>
            await FindByCondition(i => i.Id.Equals(Id), trackChanges).SingleOrDefaultAsync();

        public async Task<MapDetail?> GetMapDetailByMapIdAsync(int mapId, bool trackChanges) =>
            await FindByCondition(i => i.MapId.Equals(mapId), trackChanges).SingleOrDefaultAsync();

        public void CreateMap(MapDetail Map) => Create(Map);
        public void DeleteMap(MapDetail Map) => Delete(Map);
        public void UpdateMap(MapDetail Map) => Update(Map);

        #endregion
    }
}
