
using Business.BusinessAspects;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Core.Aspects.Autofac.Logging;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;


namespace Business.Handlers.Depoes.Queries
{
    public class GetDepoQuery : IRequest<IDataResult<Depo>>
    {
        public int Id { get; set; }

        public class GetDepoQueryHandler : IRequestHandler<GetDepoQuery, IDataResult<Depo>>
        {
            private readonly IDepoRepository _depoRepository;
            private readonly IMediator _mediator;

            public GetDepoQueryHandler(IDepoRepository depoRepository, IMediator mediator)
            {
                _depoRepository = depoRepository;
                _mediator = mediator;
            }
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IDataResult<Depo>> Handle(GetDepoQuery request, CancellationToken cancellationToken)
            {
                var depo = await _depoRepository.GetAsync(p => p.Id == request.Id);
                return new SuccessDataResult<Depo>(depo);
            }
        }
    }
}
