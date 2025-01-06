
using System;
using System.Linq;
using Core.DataAccess.EntityFramework;
using Entities.Concrete;
using DataAccess.Concrete.EntityFramework.Contexts;
using DataAccess.Abstract;
namespace DataAccess.Concrete.EntityFramework
{
    public class DepoRepository : EfEntityRepositoryBase<Depo, ProjectDbContext>, IDepoRepository
    {
        public DepoRepository(ProjectDbContext context) : base(context)
        {
        }
    }
}
