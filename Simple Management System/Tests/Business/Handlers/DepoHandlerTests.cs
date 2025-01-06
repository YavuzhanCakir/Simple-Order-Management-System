
using Business.Handlers.Depoes.Queries;
using DataAccess.Abstract;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using static Business.Handlers.Depoes.Queries.GetDepoQuery;
using Entities.Concrete;
using static Business.Handlers.Depoes.Queries.GetDepoesQuery;
using static Business.Handlers.Depoes.Commands.CreateDepoCommand;
using Business.Handlers.Depoes.Commands;
using Business.Constants;
using static Business.Handlers.Depoes.Commands.UpdateDepoCommand;
using static Business.Handlers.Depoes.Commands.DeleteDepoCommand;
using MediatR;
using System.Linq;
using FluentAssertions;


namespace Tests.Business.HandlersTest
{
    [TestFixture]
    public class DepoHandlerTests
    {
        Mock<IDepoRepository> _depoRepository;
        Mock<IMediator> _mediator;
        [SetUp]
        public void Setup()
        {
            _depoRepository = new Mock<IDepoRepository>();
            _mediator = new Mock<IMediator>();
        }

        [Test]
        public async Task Depo_GetQuery_Success()
        {
            //Arrange
            var query = new GetDepoQuery();

            _depoRepository.Setup(x => x.GetAsync(It.IsAny<Expression<Func<Depo, bool>>>())).ReturnsAsync(new Depo()
//propertyler buraya yazılacak
//{																		
//DepoId = 1,
//DepoName = "Test"
//}
);

            var handler = new GetDepoQueryHandler(_depoRepository.Object, _mediator.Object);

            //Act
            var x = await handler.Handle(query, new System.Threading.CancellationToken());

            //Asset
            x.Success.Should().BeTrue();
            //x.Data.DepoId.Should().Be(1);

        }

        [Test]
        public async Task Depo_GetQueries_Success()
        {
            //Arrange
            var query = new GetDepoesQuery();

            _depoRepository.Setup(x => x.GetListAsync(It.IsAny<Expression<Func<Depo, bool>>>()))
                        .ReturnsAsync(new List<Depo> { new Depo() { /*TODO:propertyler buraya yazılacak DepoId = 1, DepoName = "test"*/ } });

            var handler = new GetDepoesQueryHandler(_depoRepository.Object, _mediator.Object);

            //Act
            var x = await handler.Handle(query, new System.Threading.CancellationToken());

            //Asset
            x.Success.Should().BeTrue();
            ((List<Depo>)x.Data).Count.Should().BeGreaterThan(1);

        }

        [Test]
        public async Task Depo_CreateCommand_Success()
        {
            Depo rt = null;
            //Arrange
            var command = new CreateDepoCommand();
            //propertyler buraya yazılacak
            //command.DepoName = "deneme";

            _depoRepository.Setup(x => x.GetAsync(It.IsAny<Expression<Func<Depo, bool>>>()))
                        .ReturnsAsync(rt);

            _depoRepository.Setup(x => x.Add(It.IsAny<Depo>())).Returns(new Depo());

            var handler = new CreateDepoCommandHandler(_depoRepository.Object, _mediator.Object);
            var x = await handler.Handle(command, new System.Threading.CancellationToken());

            _depoRepository.Verify(x => x.SaveChangesAsync());
            x.Success.Should().BeTrue();
            x.Message.Should().Be(Messages.Added);
        }

        [Test]
        public async Task Depo_CreateCommand_NameAlreadyExist()
        {
            //Arrange
            var command = new CreateDepoCommand();
            //propertyler buraya yazılacak 
            //command.DepoName = "test";

            _depoRepository.Setup(x => x.Query())
                                           .Returns(new List<Depo> { new Depo() { /*TODO:propertyler buraya yazılacak DepoId = 1, DepoName = "test"*/ } }.AsQueryable());

            _depoRepository.Setup(x => x.Add(It.IsAny<Depo>())).Returns(new Depo());

            var handler = new CreateDepoCommandHandler(_depoRepository.Object, _mediator.Object);
            var x = await handler.Handle(command, new System.Threading.CancellationToken());

            x.Success.Should().BeFalse();
            x.Message.Should().Be(Messages.NameAlreadyExist);
        }

        [Test]
        public async Task Depo_UpdateCommand_Success()
        {
            //Arrange
            var command = new UpdateDepoCommand();
            //command.DepoName = "test";

            _depoRepository.Setup(x => x.GetAsync(It.IsAny<Expression<Func<Depo, bool>>>()))
                        .ReturnsAsync(new Depo() { /*TODO:propertyler buraya yazılacak DepoId = 1, DepoName = "deneme"*/ });

            _depoRepository.Setup(x => x.Update(It.IsAny<Depo>())).Returns(new Depo());

            var handler = new UpdateDepoCommandHandler(_depoRepository.Object, _mediator.Object);
            var x = await handler.Handle(command, new System.Threading.CancellationToken());

            _depoRepository.Verify(x => x.SaveChangesAsync());
            x.Success.Should().BeTrue();
            x.Message.Should().Be(Messages.Updated);
        }

        [Test]
        public async Task Depo_DeleteCommand_Success()
        {
            //Arrange
            var command = new DeleteDepoCommand();

            _depoRepository.Setup(x => x.GetAsync(It.IsAny<Expression<Func<Depo, bool>>>()))
                        .ReturnsAsync(new Depo() { /*TODO:propertyler buraya yazılacak DepoId = 1, DepoName = "deneme"*/});

            _depoRepository.Setup(x => x.Delete(It.IsAny<Depo>()));

            var handler = new DeleteDepoCommandHandler(_depoRepository.Object, _mediator.Object);
            var x = await handler.Handle(command, new System.Threading.CancellationToken());

            _depoRepository.Verify(x => x.SaveChangesAsync());
            x.Success.Should().BeTrue();
            x.Message.Should().Be(Messages.Deleted);
        }
    }
}

