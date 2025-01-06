
using Business.Handlers.Colors.Commands;
using FluentValidation;

namespace Business.Handlers.Colors.ValidationRules
{

    public class CreateColorValidator : AbstractValidator<CreateColorCommand>
    {
        public CreateColorValidator()
        {

        }
    }
    public class UpdateColorValidator : AbstractValidator<UpdateColorCommand>
    {
        public UpdateColorValidator()
        {

        }
    }
}