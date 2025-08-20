using Infrastructure.FindMinPath.Models;
using Infrastructure.FindMinPath.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.FindMinPath.Interfaces
{
    public interface IMapDetailRepository
    {
        Task<MapDetail?> GetMapDetailAsync(int Id, bool trackChanges);
        Task<MapDetail?> GetMapDetailByMapIdAsync(int mapId, bool trackChanges);
        void CreateMap(MapDetail Map);
        void DeleteMap(MapDetail Map);
        void UpdateMap(MapDetail Map);
    }
}
