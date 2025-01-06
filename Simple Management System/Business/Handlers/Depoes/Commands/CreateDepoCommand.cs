
using Business.BusinessAspects;
using Business.Constants;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Logging;
using Core.Aspects.Autofac.Validation;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using Business.Handlers.Depoes.ValidationRules;
using System;

namespace Business.Handlers.Depoes.Commands
{
    /// <summary>
    /// 
    /// </summary>
    public class CreateDepoCommand : IRequest<IResult>
    {

        public int CreatedUserId { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public int LastUpdatedUserId { get; set; }
        public System.DateTime LastUpdatedDate { get; set; }
        public bool Status { get; set; }
        public bool IsDeleted { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int ColorId { get; set; }
        public Core.Enums.SizeEnum Size { get; set; }
        public int Quantity { get; set; }


        public class CreateDepoCommandHandler : IRequestHandler<CreateDepoCommand, IResult>
        {
            private readonly IDepoRepository _depoRepository;
            private readonly IMediator _mediator;
            public CreateDepoCommandHandler(IDepoRepository depoRepository, IMediator mediator)
            {
                _depoRepository = depoRepository;
                _mediator = mediator;
            }

            [ValidationAspect(typeof(CreateDepoValidator), Priority = 1)]
            [CacheRemoveAspect("Get")]
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IResult> Handle(CreateDepoCommand request, CancellationToken cancellationToken)
            {
                var isThereDepoRecord = _depoRepository.Query().Any(u => u.ProductId == request.ProductId && u.ColorId == request.ColorId && 
                u.Size == u.Size && !u.IsDeleted);

                if (isThereDepoRecord == true)
                    return new ErrorResult("Bu ID'ye sahip başka bir ürün zaten mevcut.");

                var addedDepo = new Depo
                {
                    CreatedUserId = request.CreatedUserId,
                    CreatedDate = DateTime.Now,
                    LastUpdatedUserId = request.CreatedUserId,
                    LastUpdatedDate = DateTime.Now,
                    Status = true,
                    IsDeleted = false,
                    ProductId = request.ProductId,
                    ProductName = request.ProductName,
                    ColorId = request.ColorId,
                    Size = request.Size,
                    Quantity = request.Quantity,

                };

                _depoRepository.Add(addedDepo);
                await _depoRepository.SaveChangesAsync();
                return new SuccessResult(Messages.Added);
            }
        }
    }
}