
using Business.BusinessAspects;
using Core.Aspects.Autofac.Performance;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Core.Aspects.Autofac.Logging;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Aspects.Autofac.Caching;

namespace Business.Handlers.Depoes.Queries
{

    public class GetDepoesQuery : IRequest<IDataResult<IEnumerable<Depo>>>
    {
        public class GetDepoesQueryHandler : IRequestHandler<GetDepoesQuery, IDataResult<IEnumerable<Depo>>>
        {
            private readonly IDepoRepository _depoRepository;
            private readonly IMediator _mediator;

            public GetDepoesQueryHandler(IDepoRepository depoRepository, IMediator mediator)
            {
                _depoRepository = depoRepository;
                _mediator = mediator;
            }

            [PerformanceAspect(5)]
            [CacheAspect(10)]
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IDataResult<IEnumerable<Depo>>> Handle(GetDepoesQuery request, CancellationToken cancellationToken)
            {
                var aa = await _depoRepository.GetListAsync();
                return new SuccessDataResult<IEnumerable<Depo>>(aa);
            }
        }
    }
}