
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
using Business.Handlers.Colors.ValidationRules;
using System;


namespace Business.Handlers.Colors.Commands
{


    public class UpdateColorCommand : Color, IRequest<IResult>
    {


        public class UpdateColorCommandHandler : IRequestHandler<UpdateColorCommand, IResult>
        {
            private readonly IColorRepository _colorRepository;
            private readonly IMediator _mediator;

            public UpdateColorCommandHandler(IColorRepository colorRepository, IMediator mediator)
            {
                _colorRepository = colorRepository;
                _mediator = mediator;
            }

            [ValidationAspect(typeof(UpdateColorValidator), Priority = 1)]
            [CacheRemoveAspect("Get")]
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IResult> Handle(UpdateColorCommand request, CancellationToken cancellationToken)
            {
                var isThereColorRecord = await _colorRepository.GetAsync(u => u.Id == request.Id);

                if (request.Name != isThereColorRecord.Name)
                {
                    var isColorNameAlreadyExists = await _colorRepository.GetAsync(u => u.Name == request.Name && !u.IsDeleted == true);
                    if (isColorNameAlreadyExists != null)
                    {
                        return new ErrorResult("Bu renk adı önceden kayıtlı.");
                    }
                }


                isThereColorRecord.LastUpdatedUserId = request.LastUpdatedUserId;
                isThereColorRecord.LastUpdatedDate = DateTime.Now;
                isThereColorRecord.Status = request.Status;
                isThereColorRecord.Name = request.Name;
                isThereColorRecord.Code = request.Code;


                _colorRepository.Update(isThereColorRecord);
                await _colorRepository.SaveChangesAsync();
                return new SuccessResult(Messages.Updated);
            }
        }
    }
}

