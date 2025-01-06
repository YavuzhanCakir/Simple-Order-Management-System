
using Business.Constants;
using Business.BusinessAspects;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Logging;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using Core.Aspects.Autofac.Validation;
using Business.Handlers.Depoes.ValidationRules;
using System;


namespace Business.Handlers.Depoes.Commands
{


    public class UpdateDepoCommand : IRequest<IResult>
    {
        public int Id { get; set; }
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

        public class UpdateDepoCommandHandler : IRequestHandler<UpdateDepoCommand, IResult>
        {
            private readonly IDepoRepository _depoRepository;
            private readonly IMediator _mediator;

            public UpdateDepoCommandHandler(IDepoRepository depoRepository, IMediator mediator)
            {
                _depoRepository = depoRepository;
                _mediator = mediator;
            }

            [ValidationAspect(typeof(UpdateDepoValidator), Priority = 1)]
            [CacheRemoveAspect("Get")]
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IResult> Handle(UpdateDepoCommand request, CancellationToken cancellationToken)
            {
                var isThereDepoRecord = await _depoRepository.GetAsync(u => u.Id == request.Id && !u.IsDeleted);

                if (isThereDepoRecord == null)
                {
                    return new ErrorResult("Ürün bulunamadı.");
                }

                if (isThereDepoRecord.IsDeleted)
                {
                    return new ErrorResult("Silinmiş bir ürün güncellenemez.");
                }

                // Eğer ürünün ID'si değişiyorsa, yeni ID'nin mevcut olmadığını kontrol et
                if (request.ProductId != isThereDepoRecord.ProductId)
                {
                    var isNewIdExists = await _depoRepository.GetAsync(u => u.Id == request.Id);
                    if (isNewIdExists != null)
                    {
                        return new ErrorResult("Bu ID'ye sahip başka bir ürün zaten mevcut.");
                    }
                }

                isThereDepoRecord.LastUpdatedUserId = request.LastUpdatedUserId;
                isThereDepoRecord.LastUpdatedDate = DateTime.Now;
                isThereDepoRecord.Status = true;
                isThereDepoRecord.IsDeleted = false;
                isThereDepoRecord.ProductId = request.ProductId;
                isThereDepoRecord.ProductName = request.ProductName;
                isThereDepoRecord.ColorId = request.ColorId;
                isThereDepoRecord.Size = request.Size;
                isThereDepoRecord.Quantity = request.Quantity;


                _depoRepository.Update(isThereDepoRecord);
                await _depoRepository.SaveChangesAsync();
                return new SuccessResult(Messages.Updated);
            }
        }
    }
}

