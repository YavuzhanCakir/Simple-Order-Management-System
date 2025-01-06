
using Business.Constants;
using Core.Aspects.Autofac.Caching;
using Business.BusinessAspects;
using Core.Aspects.Autofac.Logging;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Utilities.Results;
using DataAccess.Abstract;
using MediatR;
using System.Threading;
using System.Threading.Tasks;


namespace Business.Handlers.Depoes.Commands
{
    /// <summary>
    /// 
    /// </summary>
    public class DeleteDepoCommand : IRequest<IResult>
    {
        public int Id { get; set; }

        public class DeleteDepoCommandHandler : IRequestHandler<DeleteDepoCommand, IResult>
        {
            private readonly IDepoRepository _depoRepository;
            private readonly IMediator _mediator;

            public DeleteDepoCommandHandler(IDepoRepository depoRepository, IMediator mediator)
            {
                _depoRepository = depoRepository;
                _mediator = mediator;
            }

            [CacheRemoveAspect("Get")]
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IResult> Handle(DeleteDepoCommand request, CancellationToken cancellationToken)
            {
                var depoToDelete = _depoRepository.Get(p => p.Id == request.Id);
                depoToDelete.IsDeleted = true;
                depoToDelete.Status = false;

                _depoRepository.Update(depoToDelete);
                await _depoRepository.SaveChangesAsync();
                return new SuccessResult(Messages.Deleted);
            }
        }
    }
}

