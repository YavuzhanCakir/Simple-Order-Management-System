using Business.BusinessAspects;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Logging;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Entities.Dtos;
using Core.Utilities.Results;
using DataAccess.Abstract;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Business.Handlers.Orders.Queries
{
    public class GetOrdersLookupQuery : IRequest<IDataResult<IEnumerable<SelectionItem>>>
    {
        public class
            GetOrdersLookupQueryHandler : IRequestHandler<GetOrdersLookupQuery, IDataResult<IEnumerable<SelectionItem>>>
        {
            private readonly IUserRepository _userRepository;

            public GetOrdersLookupQueryHandler(IUserRepository userRepository)
            {
                _userRepository = userRepository;
            }

            [SecuredOperation(Priority = 1)]
            [CacheAspect(10)]
            [LogAspect(typeof(FileLogger))]
            public async Task<IDataResult<IEnumerable<SelectionItem>>> Handle(GetOrdersLookupQuery request, CancellationToken cancellationToken)
            {
                var list = await _userRepository.GetListAsync(x => x.Status);
                var userLookup = list.Select(x => new SelectionItem() { Id = x.UserId.ToString(), Label = x.FullName });
                return new SuccessDataResult<IEnumerable<SelectionItem>>(userLookup);
            }
        }
    }
}