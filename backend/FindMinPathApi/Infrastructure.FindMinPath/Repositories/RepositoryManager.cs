using Infrastructure.FindMinPath.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.FindMinPath.Repositories
{
    public sealed class RepositoryManager : IRepositoryManager
    {
        #region properties
        private readonly RepositoryContext _repositoryContext;
        private readonly Lazy<IMapRepository> _mapRepository;
        private readonly Lazy<IMapDetailRepository> _mapDetailRepository;

        #endregion

        #region constructor
        public RepositoryManager(RepositoryContext repositoryContext)
        {
            _repositoryContext = repositoryContext;
            _mapRepository = new Lazy<IMapRepository>(() => new MapRepository(repositoryContext));
            _mapDetailRepository = new Lazy<IMapDetailRepository>(() => new MapDetailRepository(repositoryContext));
        }
        #endregion

        #region methods
        public IMapRepository Map => _mapRepository.Value;
        public IMapDetailRepository MapDetail => _mapDetailRepository.Value;
        public async Task SaveAsync() => await _repositoryContext.SaveChangesAsync();
        #endregion

    }
}
