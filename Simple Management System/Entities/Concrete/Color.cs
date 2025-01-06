using Core.Entities;

namespace Entities.Concrete
{
    public class Color : BaseEntity, IEntity
    {   
        public string Name { get; set; } // Renk adı
        public int? Code { get; set; }

    }
}
