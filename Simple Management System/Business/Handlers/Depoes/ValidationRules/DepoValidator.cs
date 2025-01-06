
using Business.Handlers.Depoes.Commands;
using FluentValidation;

namespace Business.Handlers.Depoes.ValidationRules
{

    public class CreateDepoValidator : AbstractValidator<CreateDepoCommand>
    {
        public CreateDepoValidator()
        {
            RuleFor(x => x.ProductName).NotEmpty();
            RuleFor(x => x.ColorId).NotEmpty();
            RuleFor(x => x.Size).NotEmpty();
            RuleFor(x => x.Quantity).NotEmpty();

        }
    }
    public class UpdateDepoValidator : AbstractValidator<UpdateDepoCommand>
    {
        public UpdateDepoValidator()
        {
            RuleFor(x => x.ProductName).NotEmpty();
            RuleFor(x => x.ColorId).NotEmpty();
            RuleFor(x => x.Size).NotEmpty();
            RuleFor(x => x.Quantity).NotEmpty();

        }
    }
}