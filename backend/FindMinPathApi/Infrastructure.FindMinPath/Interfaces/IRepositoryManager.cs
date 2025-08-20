using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.FindMinPath.Interfaces
{
    public interface IRepositoryManager
    {
        IMapRepository Map { get; }
        IMapDetailRepository MapDetail { get; }

        Task SaveAsync();
    }
}
