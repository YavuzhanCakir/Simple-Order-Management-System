
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
using Business.Handlers.Customers.ValidationRules;
using System;
using DataAccess.Concrete.EntityFramework;


namespace Business.Handlers.Customers.Commands
{


    public class UpdateCustomerCommand : Customer, IRequest<IResult>
    {


        public class UpdateCustomerCommandHandler : IRequestHandler<UpdateCustomerCommand, IResult>
        {
            private readonly ICustomerRepository _customerRepository;
            private readonly IMediator _mediator;

            public UpdateCustomerCommandHandler(ICustomerRepository customerRepository, IMediator mediator)
            {
                _customerRepository = customerRepository;
                _mediator = mediator;
            }

            [ValidationAspect(typeof(UpdateCustomerValidator), Priority = 1)]
            [CacheRemoveAspect("Get")]
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IResult> Handle(UpdateCustomerCommand request, CancellationToken cancellationToken)
            {
                var isThereCustomerRecord = await _customerRepository.GetAsync(u => u.Id == request.Id);


                if (request.Email != isThereCustomerRecord.Email)
                {
                    var isNewEmailExists = await _customerRepository.GetAsync(u => u.Id == request.Id && !u.IsDeleted != true);
                    if (isNewEmailExists != null)
                    {
                        return new ErrorResult("Bu E posta önceden kayıtlı");
                    }
                }


                isThereCustomerRecord.LastUpdatedUserId = request.LastUpdatedUserId;
                isThereCustomerRecord.LastUpdatedDate = DateTime.Now;
                isThereCustomerRecord.Status = request.Status;
                isThereCustomerRecord.IsDeleted = request.IsDeleted;
                isThereCustomerRecord.CustomerName = request.CustomerName;
                isThereCustomerRecord.CustomerCode = request.CustomerCode;
                isThereCustomerRecord.Address = request.Address;
                isThereCustomerRecord.PhoneNumber = request.PhoneNumber;
                isThereCustomerRecord.Email = request.Email;


                _customerRepository.Update(isThereCustomerRecord);
                await _customerRepository.SaveChangesAsync();
                return new SuccessResult(Messages.Updated);
            }
        }
    }
}

