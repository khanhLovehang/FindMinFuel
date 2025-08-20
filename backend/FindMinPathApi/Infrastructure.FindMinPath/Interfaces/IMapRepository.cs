using Infrastructure.FindMinPath.Models;
using Infrastructure.FindMinPath.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.FindMinPath.Interfaces
{
    public interface IMapRepository
    {
        Task<IEnumerable<Map>> GetAllMapsAsync(bool trackChanges, int page = 0, int size = 1);
        Task<Map> GetMapAsync(int mapId, bool trackChanges);
        void CreateMap(Map Map);
        void DeleteMap(Map Map);
        void UpdateMap(Map Map);
    }
}
